import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { parseExcelOrCSV, type ParsedBankData } from '@/lib/parsers';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10MB.' },
        { status: 400 }
      );
    }
    
    // Validate file type (Excel and CSV only for reliability)
    const validTypes = [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv',
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx?|csv)$/i)) {
      return NextResponse.json(
        { error: 'Formato de archivo no válido. Use Excel (.xlsx, .xls) o CSV solamente.' },
        { status: 400 }
      );
    }
    
    console.log(`Processing file: ${file.name} (${file.type}, ${file.size} bytes)`);
    
    // Convert file to ArrayBuffer
    const buffer = await file.arrayBuffer();
    
    // Parse file (Excel or CSV)
    const parsedData = await parseExcelOrCSV(buffer);
    
    // Validate that we got transactions
    if (parsedData.transactions.length === 0) {
      return NextResponse.json(
        { 
          error: 'No se pudieron extraer transacciones del archivo. Verifica que contenga datos bancarios válidos.',
          rawText: parsedData.rawText ? parsedData.rawText.substring(0, 500) : undefined,
        },
        { status: 400 }
      );
    }
    
    // Prepare data for AI analysis
    const transactionsText = parsedData.transactions
      .slice(0, 100) // Limit to first 100 transactions to avoid token limits
      .map((t, i) => `${i + 1}. ${t.date} | ${t.description} | ${t.amount >= 0 ? '+' : ''}${t.amount.toFixed(2)}`)
      .join('\n');
    
    const prompt = `Eres un analista financiero experto. Analiza las siguientes transacciones bancarias y proporciona un resumen detallado.

DATOS DEL EXTRACTO:
Período: ${parsedData.summary.period}
Total de transacciones: ${parsedData.summary.totalTransactions}
Total ingresos: +${parsedData.summary.totalCredits.toFixed(2)}
Total egresos: -${parsedData.summary.totalDebits.toFixed(2)}
Balance neto: ${(parsedData.summary.totalCredits - parsedData.summary.totalDebits).toFixed(2)}

TRANSACCIONES:
${transactionsText}

Por favor proporciona:

1. **Resumen Ejecutivo** (2-3 líneas sobre el estado financiero general)

2. **Top 5 Gastos Más Grandes** (lista con monto y descripción)

3. **Categorización Automática** (agrupa los gastos por categoría: Alimentación, Transporte, Servicios, Entretenimiento, Salud, Compras, Transferencias, Otros)

4. **Análisis de Ingresos vs Egresos** (balance y porcentajes)

5. **Patrones Detectados** (gastos recurrentes, días de mayor actividad, tendencias)

6. **Alertas y Recomendaciones** (3-4 sugerencias concretas para mejorar las finanzas)

Formatea la respuesta de manera clara y estructurada usando Markdown.`;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysis = completion.choices[0]?.message?.content || 'No se pudo generar el análisis.';

    // Return response
    return NextResponse.json({
      success: true,
      data: {
        summary: parsedData.summary,
        transactions: parsedData.transactions.slice(0, 50), // Return first 50 for display
        analysis,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          processedAt: new Date().toISOString(),
        },
      },
    });

  } catch (error) {
    console.error('Error analyzing bank file:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error al procesar el archivo',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Configure route to handle larger payloads
export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds max (Vercel Pro feature, hobby defaults to 10s)
