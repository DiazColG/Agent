import * as XLSX from 'xlsx';

export interface BankTransaction {
  date: string;
  description: string;
  amount: number;
  balance?: number;
  type?: 'credit' | 'debit';
}

export interface ParsedBankData {
  transactions: BankTransaction[];
  summary: {
    totalTransactions: number;
    totalCredits: number;
    totalDebits: number;
    period: string;
  };
  rawText?: string;
}

/**
 * Parse Excel or CSV files to extract bank transactions
 */
export async function parseExcelOrCSV(buffer: ArrayBuffer): Promise<ParsedBankData> {
  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Find header row (usually contains: fecha, descripcion, monto, saldo, etc.)
    let headerRowIndex = 0;
    const headerKeywords = ['fecha', 'date', 'descripcion', 'description', 'monto', 'amount', 'importe', 'saldo', 'balance'];
    
    for (let i = 0; i < Math.min(10, jsonData.length); i++) {
      const row = jsonData[i];
      if (Array.isArray(row)) {
        const rowText = row.join(' ').toLowerCase();
        const hasKeywords = headerKeywords.some(keyword => rowText.includes(keyword));
        if (hasKeywords) {
          headerRowIndex = i;
          break;
        }
      }
    }
    
    const headers = jsonData[headerRowIndex] as string[];
    const dataRows = jsonData.slice(headerRowIndex + 1);
    
    // Detect column indices - support both single amount column and debit/credit columns
    const dateCol = findColumnIndex(headers, ['fecha', 'date', 'data']);
    const descCol = findColumnIndex(headers, ['movimiento', 'descripcion', 'description', 'concepto', 'detalle', 'detail']);
    
    // Try to find debit/credit columns first (common in bank statements)
    const debitCol = findColumnIndex(headers, ['debito', 'débito', 'debit', 'cargo', 'egreso']);
    const creditCol = findColumnIndex(headers, ['credito', 'crédito', 'credit', 'abono', 'ingreso']);
    
    // If no debit/credit, look for single amount column
    const amountCol = (debitCol === -1 && creditCol === -1) 
      ? findColumnIndex(headers, ['monto', 'amount', 'importe', 'valor'])
      : -1;
    
    const balanceCol = findColumnIndex(headers, ['saldo', 'balance', 'saldo parcial']);
    
    const transactions: BankTransaction[] = [];
    
    for (const row of dataRows) {
      if (!Array.isArray(row) || row.length === 0) continue;
      
      const date = row[dateCol];
      const description = row[descCol];
      
      // Skip empty rows
      if (!date && !description) continue;
      
      // Calculate amount based on debit/credit or single amount column
      let parsedAmount = 0;
      
      if (debitCol >= 0 || creditCol >= 0) {
        // Debit/Credit format
        const debit = debitCol >= 0 ? parseAmount(row[debitCol]) : 0;
        const credit = creditCol >= 0 ? parseAmount(row[creditCol]) : 0;
        
        // If both are present, use the non-zero one
        // Debits are negative, credits are positive
        if (debit !== 0) {
          parsedAmount = -Math.abs(debit);
        } else if (credit !== 0) {
          parsedAmount = Math.abs(credit);
        }
      } else if (amountCol >= 0) {
        // Single amount column
        const amount = row[amountCol];
        if (typeof amount === 'number') {
          parsedAmount = amount;
        } else if (typeof amount === 'string') {
          parsedAmount = parseAmount(amount);
        }
      }
      
      // Skip transactions with 0 amount and no description
      if (parsedAmount === 0 && !description) continue;
      
      transactions.push({
        date: formatDate(date),
        description: String(description || 'Sin descripción').trim(),
        amount: parsedAmount,
        balance: balanceCol >= 0 ? parseAmount(row[balanceCol]) : undefined,
        type: parsedAmount >= 0 ? 'credit' : 'debit',
      });
    }
    
    // Calculate summary
    const totalCredits = transactions
      .filter(t => t.amount >= 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalDebits = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const dates = transactions.map(t => t.date).filter(Boolean);
    const period = dates.length > 0 
      ? `${dates[0]} - ${dates[dates.length - 1]}`
      : 'Período no detectado';
    
    return {
      transactions,
      summary: {
        totalTransactions: transactions.length,
        totalCredits,
        totalDebits,
        period,
      },
    };
  } catch (error) {
    throw new Error(`Error parsing Excel/CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Note: PDF parsing removed for simplicity and reliability.
 * Excel (.xlsx, .xls) and CSV files are fully supported.
 * For PDF bank statements, users should export to Excel/CSV first.
 */

/**
 * Helper: Find column index by possible names
 */
function findColumnIndex(headers: string[], possibleNames: string[]): number {
  const lowerHeaders = headers.map(h => String(h).toLowerCase());
  
  for (const name of possibleNames) {
    const index = lowerHeaders.findIndex(h => h.includes(name));
    if (index >= 0) return index;
  }
  
  return -1;
}

/**
 * Helper: Parse amount from string (handles different formats)
 */
function parseAmount(value: any): number {
  if (typeof value === 'number') return value;
  if (!value || value === '') return 0;
  
  let str = String(value).trim();
  
  // Remove currency symbols and spaces
  str = str.replace(/[$€£¥₹\s]/g, '');
  
  // If empty after cleanup, return 0
  if (!str) return 0;
  
  // Handle negative signs
  const isNegative = str.includes('-') || str.startsWith('(');
  str = str.replace(/[-()]/g, '');
  
  // Count dots and commas to determine format
  const dotCount = (str.match(/\./g) || []).length;
  const commaCount = (str.match(/,/g) || []).length;
  
  // Determine decimal separator
  let result: number;
  
  if (dotCount === 0 && commaCount === 0) {
    // No separators - simple number
    result = parseFloat(str);
  } else if (dotCount > 0 && commaCount === 0) {
    // Only dots - could be 1.234.567,00 or 1234.56
    const lastDotPos = str.lastIndexOf('.');
    const afterLastDot = str.substring(lastDotPos + 1);
    
    if (afterLastDot.length === 2) {
      // EU format: 1.234,56 but without comma (rare)
      // Or could be thousands: 1.234
      // Check if there are multiple dots
      if (dotCount > 1) {
        // Multiple dots = thousands separator
        str = str.replace(/\./g, '');
        result = parseFloat(str);
      } else {
        // Single dot with 2 decimals - ambiguous, assume decimal
        result = parseFloat(str);
      }
    } else {
      // US format: 1,234.56 (without comma) or just 1234.56
      result = parseFloat(str.replace(/\./g, ''));
    }
  } else if (commaCount > 0 && dotCount === 0) {
    // Only commas - could be 1,234,567 or 1234,56
    const lastCommaPos = str.lastIndexOf(',');
    const afterLastComma = str.substring(lastCommaPos + 1);
    
    if (afterLastComma.length === 2) {
      // EU format: 1.234,56 (decimal comma)
      str = str.replace(/,/, '.');
      result = parseFloat(str);
    } else {
      // US format: 1,234,567 (thousands comma)
      str = str.replace(/,/g, '');
      result = parseFloat(str);
    }
  } else {
    // Both dots and commas present
    const lastDotPos = str.lastIndexOf('.');
    const lastCommaPos = str.lastIndexOf(',');
    
    if (lastCommaPos > lastDotPos) {
      // EU format: 1.234,56 -> comma is decimal
      str = str.replace(/\./g, '').replace(',', '.');
      result = parseFloat(str);
    } else {
      // US format: 1,234.56 -> dot is decimal
      str = str.replace(/,/g, '');
      result = parseFloat(str);
    }
  }
  
  // Apply negative if needed
  if (isNegative && result > 0) {
    result = -result;
  }
  
  return isNaN(result) ? 0 : result;
}

/**
 * Helper: Format date to YYYY-MM-DD
 */
function formatDate(value: any): string {
  if (!value) return '';
  
  // Handle Excel date numbers
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  
  const str = String(value);
  
  // Try to parse common formats
  const patterns = [
    /(\d{4})[-/](\d{1,2})[-/](\d{1,2})/, // YYYY-MM-DD or YYYY/MM/DD
    /(\d{1,2})[-/](\d{1,2})[-/](\d{4})/, // DD-MM-YYYY or MM-DD-YYYY
    /(\d{1,2})[-/](\d{1,2})[-/](\d{2})/,  // DD-MM-YY or MM-DD-YY
  ];
  
  for (const pattern of patterns) {
    const match = str.match(pattern);
    if (match) {
      const [, a, b, c] = match;
      
      // Detect if it's YYYY-MM-DD
      if (a.length === 4) {
        return `${a}-${b.padStart(2, '0')}-${c.padStart(2, '0')}`;
      }
      
      // Assume DD-MM-YYYY for ambiguous cases
      const year = c.length === 2 ? `20${c}` : c;
      return `${year}-${b.padStart(2, '0')}-${a.padStart(2, '0')}`;
    }
  }
  
  return str;
}
