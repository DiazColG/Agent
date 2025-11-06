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
    
    // Detect column indices
    const dateCol = findColumnIndex(headers, ['fecha', 'date', 'data']);
    const descCol = findColumnIndex(headers, ['descripcion', 'description', 'concepto', 'detalle', 'detail']);
    const amountCol = findColumnIndex(headers, ['monto', 'amount', 'importe', 'valor']);
    const balanceCol = findColumnIndex(headers, ['saldo', 'balance']);
    
    const transactions: BankTransaction[] = [];
    
    for (const row of dataRows) {
      if (!Array.isArray(row) || row.length === 0) continue;
      
      const date = row[dateCol];
      const description = row[descCol];
      const amount = row[amountCol];
      
      // Skip empty rows
      if (!date && !description && !amount) continue;
      
      // Parse amount (handle different formats: $1,234.56, 1.234,56, etc.)
      let parsedAmount = 0;
      if (typeof amount === 'number') {
        parsedAmount = amount;
      } else if (typeof amount === 'string') {
        parsedAmount = parseAmount(amount);
      }
      
      transactions.push({
        date: formatDate(date),
        description: String(description || 'Sin descripción'),
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
  if (!value) return 0;
  
  let str = String(value);
  
  // Remove currency symbols
  str = str.replace(/[$€£¥₹]/g, '');
  
  // Detect format: 1,234.56 (US) vs 1.234,56 (EU)
  const hasCommaDecimal = /\d+\.\d{3},\d{2}/.test(str);
  
  if (hasCommaDecimal) {
    // EU format: 1.234,56 -> 1234.56
    str = str.replace(/\./g, '').replace(',', '.');
  } else {
    // US format: 1,234.56 -> 1234.56
    str = str.replace(/,/g, '');
  }
  
  // Handle parentheses as negative (accounting format)
  if (str.includes('(') && str.includes(')')) {
    str = '-' + str.replace(/[()]/g, '');
  }
  
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
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
