import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

type ActionType = 
  // Escritura & Contenido
  | 'improve' | 'summarize' | 'translate' | 'formal' | 'casual' 
  | 'email' | 'social' | 'headline' | 'spell' | 'paraphrase' | 'story' | 'twitter'
  // Profesional & Carrera
  | 'cv' | 'cover' | 'interview' | 'linkedin' | 'presentation'
  // Finanzas & Negocios
  | 'finance' | 'business' | 'savings' | 'financeterm' | 'salary' | 'businessmodel'
  // Educación & Aprendizaje
  | 'eli5' | 'quiz' | 'studysummary' | 'research' | 'language'
  // Creatividad & Marketing
  | 'naming' | 'adcopy' | 'videoscript' | 'birthday' | 'gift'
  // Estilo de Vida
  | 'relationship'
  // Social Intelligence
  | 'pulse';

const prompts: Record<ActionType, string> = {
  // Escritura & Contenido
  improve: 'Mejora el siguiente texto haciéndolo más claro, profesional y bien escrito. Mantén el mismo idioma. Solo devuelve el texto mejorado sin explicaciones adicionales:',
  
  summarize: 'Resume el siguiente texto de forma concisa capturando los puntos principales. Mantén el mismo idioma. Solo devuelve el resumen sin explicaciones adicionales:',
  
  translate: 'Traduce el siguiente texto al inglés de forma natural y fluida. Solo devuelve la traducción sin explicaciones adicionales:',
  
  formal: 'Reescribe el siguiente texto en un tono formal y profesional. Mantén el mismo idioma. Solo devuelve el texto formal sin explicaciones adicionales:',
  
  casual: 'Reescribe el siguiente texto en un tono casual y amigable. Mantén el mismo idioma. Solo devuelve el texto casual sin explicaciones adicionales:',
  
  email: 'Actúa como experto en comunicación profesional. Escribe un email profesional, claro y efectivo basado en la descripción del usuario. Incluye saludo apropiado, cuerpo bien estructurado y cierre cortés. Mantén el idioma del usuario:',
  
  social: 'Actúa como experto en redes sociales y marketing de contenidos. Crea un post atractivo y con gancho para redes sociales basado en la descripción. Incluye emojis relevantes y un llamado a la acción. Mantén el idioma del usuario:',
  
  headline: 'Actúa como copywriter experto. Genera 5 titulares llamativos y efectivos sobre el tema indicado. Usa técnicas de copywriting: curiosidad, beneficio claro, urgencia o cifras. Mantén el idioma del usuario:',
  
  spell: 'Corrige únicamente los errores ortográficos y gramaticales del siguiente texto. NO cambies el estilo, tono o estructura. Solo correcciones. Devuelve el texto corregido:',
  
  paraphrase: 'Reescribe el siguiente texto manteniendo exactamente el mismo significado pero usando palabras y estructura diferente. Útil para evitar plagio. Mantén el mismo idioma y longitud similar:',
  
  story: 'Actúa como storyteller profesional. Convierte los datos o hechos que te proporciono en una historia narrativa atractiva y memorable. Usa técnicas de storytelling: conflicto, emoción, resolución. Mantén el idioma del usuario:',
  
  twitter: 'Actúa como experto en Twitter/X y contenido viral. Crea tweets o hilos de Twitter efectivos basados en la descripción. REGLAS: tweets máximo 280 caracteres, usa emojis estratégicamente, incluye gancho en primera línea, hashtags relevantes (2-3 máximo). Si es hilo, numera cada tweet. Tono: auténtico, conversacional, atractivo. Mantén el idioma del usuario:',
  
  // Profesional & Carrera
  cv: 'Actúa como experto en recursos humanos y escritura de CV profesionales. Mejora el siguiente texto de CV haciéndolo más impactante y profesional. Usa verbos de acción fuertes, cuantifica logros cuando sea posible, y resalta habilidades clave. Mantén el mismo idioma:',
  
  cover: 'Actúa como experto en búsqueda de empleo. Escribe una carta de presentación profesional, persuasiva y personalizada basada en la información proporcionada. Estructura: introducción con entusiasmo, por qué eres ideal, cierre con llamado a acción. Mantén el idioma del usuario:',
  
  interview: 'Actúa como coach de entrevistas laborales. Proporciona consejos específicos para preparar la entrevista: preguntas comunes que harán, mejores respuestas usando técnica STAR, preguntas que debes hacer, tips según la empresa/industria. Mantén el idioma del usuario:',
  
  linkedin: 'Actúa como experto en personal branding en LinkedIn. Crea un resumen/bio profesional y atractivo que destaque experiencia, logros clave y propuesta de valor. Usa palabras clave relevantes para la industria. Mantén el idioma del usuario:',
  
  presentation: 'Actúa como experto en presentaciones ejecutivas. Crea una estructura clara para presentar el proyecto: resumen ejecutivo, problema, solución, resultados/impacto, próximos pasos. Usa lenguaje conciso y orientado a resultados. Mantén el idioma del usuario:',
  
  // Finanzas & Negocios
  finance: 'Actúa como asesor financiero experto certificado. Analiza la consulta financiera y proporciona consejos prácticos, claros y profesionales. Incluye recomendaciones específicas, explica el razonamiento y menciona riesgos cuando sea relevante. Mantén un tono educativo:',
  
  business: 'Actúa como consultor de negocios experimentado. Analiza la idea de negocio con framework de validación: problema que resuelve, mercado objetivo, competencia, modelo de ingresos, viabilidad. Proporciona feedback constructivo y próximos pasos. Mantén el idioma del usuario:',
  
  savings: 'Actúa como planificador financiero personal. Crea un plan de ahorro personalizado y realista basado en la información financiera proporcionada. Incluye: presupuesto sugerido, estrategias de ahorro, timeline para la meta, tips para mantener disciplina. Mantén el idioma del usuario:',
  
  financeterm: 'Actúa como educador financiero. Explica el término financiero de forma simple y clara, usando ejemplos prácticos del día a día. Incluye: definición simple, cómo funciona, ejemplo real, por qué importa. Mantén el idioma del usuario:',
  
  salary: 'Actúa como coach de negociación salarial. Proporciona estrategia para negociar: cómo investigar salarios del mercado, argumentos basados en valor/logros, momento adecuado, scripts de conversación, manejo de objeciones. Mantén el idioma del usuario:',
  
  businessmodel: 'Actúa como consultor de negocios especializado en Business Model Canvas. Crea un modelo de negocio completo usando el framework BMC con los 9 bloques: 1) Segmentos de Clientes, 2) Propuesta de Valor, 3) Canales, 4) Relación con Clientes, 5) Fuentes de Ingresos, 6) Recursos Clave, 7) Actividades Clave, 8) Socios Clave, 9) Estructura de Costos. Para cada bloque proporciona análisis específico y recomendaciones. Incluye análisis de viabilidad y próximos pasos. Mantén el idioma del usuario:',
  
  // Educación & Aprendizaje
  eli5: 'Actúa como profesor que explica conceptos complejos de forma ultra simple. Explica el concepto como si le hablaras a un niño de 5 años: usa analogías cotidianas, lenguaje simple, ejemplos visuales. Sin términos técnicos. Mantén el idioma del usuario:',
  
  quiz: 'Actúa como profesor creador de evaluaciones. Genera 10 preguntas de estudio sobre el contenido proporcionado: mezcla de opción múltiple, verdadero/falso y preguntas abiertas. Incluye las respuestas correctas al final. Mantén el idioma del usuario:',
  
  studysummary: 'Actúa como tutor académico. Crea un resumen de estudio efectivo del material: conceptos clave organizados, puntos importantes resaltados, tips para recordar. Estructura clara y fácil de repasar. Mantén el idioma del usuario:',
  
  research: 'Actúa como asesor académico de investigación. Crea un outline/esquema para un paper o proyecto de investigación: introducción, pregunta de investigación, metodología sugerida, puntos clave a desarrollar, conclusión preliminar, fuentes a consultar. Mantén el idioma del usuario:',
  
  language: 'Actúa como profesor de idiomas nativo. Corrige el texto identificando errores, explica por qué están mal y proporciona la versión correcta. Incluye tips de gramática relevantes y expresiones más naturales. Sé amable y motivador:',
  
  // Creatividad & Marketing
  naming: 'Actúa como experto en branding y naming. Genera 10 nombres creativos y memorables para el producto/empresa descrito. Para cada nombre incluye: el nombre, por qué funciona, y si el .com está probablemente disponible. Varía estilos: descriptivos, abstractos, compuestos. Mantén el idioma del usuario:',
  
  adcopy: 'Actúa como copywriter publicitario senior. Crea copy publicitario persuasivo: titular con gancho, descripción de beneficios (no características), manejo de objeciones, llamado a acción fuerte. Usa técnicas de copywriting: PAS (Problema-Agitación-Solución) o AIDA. Mantén el idioma del usuario:',
  
  videoscript: 'Actúa como guionista de contenido digital. Crea un script para video estructurado: gancho inicial (3 seg), introducción, contenido principal con timestamps, cierre con CTA. Incluye notas sobre qué mostrar visualmente. Mantén el idioma del usuario:',
  
  birthday: 'Actúa como escritor de mensajes personalizados. Crea un mensaje de cumpleaños único, cálido y personalizado basado en la descripción de la persona. Evita clichés, sé auténtico y emotivo. Incluye un toque de humor si es apropiado. Mantén el idioma del usuario:',
  
  gift: 'Actúa como asesor personal de regalos. Sugiere 7-10 ideas de regalo específicas y creativas basadas en la persona, ocasión y presupuesto. Para cada idea explica por qué es apropiada y dónde comprarlo. Varía desde opciones prácticas hasta experiencias. Mantén el idioma del usuario:',
  
  // Estilo de Vida
  relationship: 'Actúa como coach de relaciones y comunicación interpersonal certificado. Proporciona consejos profesionales, empáticos y constructivos sobre la situación de relaciones planteada. Cubre temas como: comunicación efectiva en pareja, manejo de conflictos, intimidad emocional y física (de forma apropiada y educativa), límites saludables, inteligencia emocional. Mantén un tono respetuoso, profesional y no juzgador. Basa tus consejos en principios de psicología y terapia de pareja. Mantén el idioma del usuario:',
  
  // Social Intelligence
  pulse: 'NO USES ESTE PROMPT - Este action usa Twitter API directamente',
};


export async function POST(req: NextRequest) {
  try {
    const { text, action } = await req.json();

    if (!text || !action) {
      return NextResponse.json(
        { error: 'Texto y acción son requeridos' },
        { status: 400 }
      );
    }

    // SPECIAL HANDLER: Pulse (Twitter Intelligence)
    if (action === 'pulse') {
      const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;
      
      if (!twitterBearerToken) {
        return NextResponse.json(
          { error: 'Twitter API no configurada. Agrega TWITTER_BEARER_TOKEN en variables de entorno.' },
          { status: 500 }
        );
      }

      try {
        // Initialize Twitter client
        const twitterClient = new TwitterApi(twitterBearerToken);
        const roClient = twitterClient.readOnly;

        // Search recent tweets (simplified query to avoid errors)
        const searchQuery = text + ' -is:retweet'; // Exclude retweets only
        
        console.log('Twitter Query:', searchQuery);
        console.log('Using token:', twitterBearerToken.substring(0, 20) + '...');
        
        const tweets = await roClient.v2.search(searchQuery, {
          'tweet.fields': ['created_at', 'public_metrics', 'lang'],
          max_results: 10, // Reducido a 10 para testing
        });

        const tweetsData = tweets.data.data || [];

        if (tweetsData.length === 0) {
          return NextResponse.json({ 
            result: `❌ No se encontraron tweets recientes sobre "${text}". Intenta con otro tema o usa términos más generales.` 
          });
        }

        // Prepare tweets text for AI analysis
        const tweetsText = tweetsData
          .map((tweet: any, i: number) => `Tweet ${i + 1}: ${tweet.text}`)
          .join('\n\n');

        // Use Groq AI to analyze tweets
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
          return NextResponse.json(
            { error: 'GROQ API key no configurada' },
            { status: 500 }
          );
        }

        const groq = new Groq({ apiKey });

        const analysisPrompt = `Eres un experto analista de redes sociales y social listening. Analiza los siguientes ${tweetsData.length} tweets sobre "${text}" y proporciona:

1. **📊 RESUMEN GENERAL** (2-3 líneas sobre qué se está hablando)
2. **🔥 TEMAS PRINCIPALES** (Top 3 temas más mencionados)
3. **💭 SENTIMIENTO PREDOMINANTE** (Positivo/Negativo/Neutral con % estimado)
4. **📈 TENDENCIAS** (Qué está en aumento o disminuyendo)
5. **🎯 INSIGHTS CLAVE** (2-3 conclusiones importantes)
6. **⚠️ DISCLAIMER** (Recordar que esto es solo Twitter, no representa toda la población)

Tweets a analizar:

${tweetsText}

Formatea tu respuesta de forma clara y estructurada. Usa emojis. Sé conciso pero informativo.`;

        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'Eres un experto en análisis de redes sociales y social listening con experiencia en Twitter Analytics.',
            },
            {
              role: 'user',
              content: analysisPrompt,
            },
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 2000,
        });

        const analysis = completion.choices[0]?.message?.content || 'No se pudo analizar los tweets';

        // Add metadata
        const result = `🔥 **PULSE: Análisis en tiempo real de Twitter**\n\n` +
          `📅 **Última actualización:** ${new Date().toLocaleString('es-AR')}\n` +
          `📊 **Tweets analizados:** ${tweetsData.length}\n` +
          `🔍 **Query:** "${text}"\n\n` +
          `---\n\n${analysis}\n\n` +
          `---\n\n` +
          `💡 **Tip:** Refresca para obtener datos actualizados (Twitter se actualiza cada minuto)`;

        return NextResponse.json({ result });

      } catch (twitterError: any) {
        console.error('Twitter API Error:', twitterError);
        
        let errorMsg = 'Error desconocido de Twitter API';
        
        if (twitterError.code === 429) {
          errorMsg = `⚠️ **Rate Limit alcanzado**\n\nTwitter Free Tier limita a 15 requests cada 15 minutos.\n\n**Posibles causas:**\n1. Ya hiciste varias búsquedas recientemente\n2. Tu cuenta necesita verificación adicional en Twitter Developer Portal\n\n**Soluciones:**\n- Espera 15 minutos e intenta nuevamente\n- Verifica tu app en: https://developer.twitter.com/en/portal/dashboard\n- Asegúrate de tener "Essential" access level activado`;
        } else if (twitterError.code === 400) {
          errorMsg = `⚠️ **Query inválida**\n\nEl término de búsqueda no es válido.\n\n**Intenta:**\n- Usar palabras más simples (ej: "messi" en vez de "messi argentina gol")\n- Evitar caracteres especiales\n- Usar términos en inglés o español`;
        } else if (twitterError.code === 401 || twitterError.code === 403) {
          errorMsg = `⚠️ **Token inválido o sin permisos**\n\nTu Bearer Token no tiene los permisos correctos.\n\n**Verifica en Twitter Developer Portal:**\n1. Ve a tu App\n2. Settings → User authentication settings\n3. Asegúrate de tener "Read" permissions\n4. Regenera el Bearer Token si es necesario`;
        } else {
          errorMsg = `⚠️ **Error de Twitter API**\n\nCódigo: ${twitterError.code || 'desconocido'}\nMensaje: ${twitterError.message || 'Sin detalles'}\n\n**Más info:** https://developer.twitter.com/en/support/twitter-api/error-troubleshooting`;
        }
        
        return NextResponse.json({ result: errorMsg });
      }
    }

    // NORMAL HANDLER: All other agents use Groq AI
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey || apiKey === 'tu_api_key_aqui') {
      console.error('API key no configurada correctamente');
      return NextResponse.json(
        { error: 'API key no configurada. Por favor verifica tu archivo .env' },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey: apiKey,
    });

    const systemPrompt = prompts[action as ActionType];
    
    console.log('Procesando solicitud:', { action, textLength: text.length });
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = completion.choices[0]?.message?.content || 'No se pudo procesar el texto';

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error detallado:', error);
    
    let errorMessage = 'Error al procesar el texto';
    
    if (error?.message?.includes('API key')) {
      errorMessage = 'API key inválida. Verifica tu configuración.';
    } else if (error?.message?.includes('rate limit')) {
      errorMessage = 'Límite de API excedido. Intenta en unos minutos.';
    } else if (error?.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
