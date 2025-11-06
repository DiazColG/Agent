'use client';

import { useState, useEffect } from 'react';
import { Language, translations, detectLanguage, getDonationLink } from '@/lib/translations';

type ActionType = 
  // Escritura & Contenido
  | 'improve' | 'summarize' | 'translate' | 'formal' | 'casual' 
  | 'email' | 'social' | 'headline' | 'spell' | 'paraphrase' | 'story' | 'twitter'
  // Profesional & Carrera
  | 'cv' | 'cover' | 'interview' | 'linkedin' | 'presentation'
  // Finanzas & Negocios
  | 'finance' | 'business' | 'savings' | 'financeterm' | 'salary' | 'businessmodel' | 'bankAnalyzer'
  // Educación & Aprendizaje
  | 'eli5' | 'quiz' | 'studysummary' | 'research' | 'language'
  // Creatividad & Marketing
  | 'naming' | 'adcopy' | 'videoscript' | 'birthday' | 'gift'
  // Estilo de Vida
  | 'relationship'
  // Social Intelligence
  | 'pulse';

type Category = 'writing' | 'professional' | 'finance' | 'education' | 'creative' | 'lifestyle' | 'social';

interface RateLimitInfo {
  count: number;
  date: string;
}

const MAX_REQUESTS_PER_DAY = 10;

export default function Home() {
  const [text, setText] = useState('');
  const [action, setAction] = useState<ActionType>('improve');
  const [category, setCategory] = useState<Category>('writing');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingRequests, setRemainingRequests] = useState<number | null>(null);
  const [showDonateTooltip, setShowDonateTooltip] = useState(false);
  const [language, setLanguage] = useState<Language>('es');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Detect language on mount
  useEffect(() => {
    setLanguage(detectLanguage());
  }, []);

  const t = translations[language];

  const checkRateLimit = (): boolean => {
    if (typeof window === 'undefined') return true;
    
    const today = new Date().toDateString();
    const stored = localStorage.getItem('rateLimitInfo');
    
    if (!stored) {
      const newInfo: RateLimitInfo = { count: 1, date: today };
      localStorage.setItem('rateLimitInfo', JSON.stringify(newInfo));
      return true;
    }

    const info: RateLimitInfo = JSON.parse(stored);
    
    if (info.date !== today) {
      const newInfo: RateLimitInfo = { count: 1, date: today };
      localStorage.setItem('rateLimitInfo', JSON.stringify(newInfo));
      return true;
    }

    if (info.count >= MAX_REQUESTS_PER_DAY) {
      return false;
    }

    info.count += 1;
    localStorage.setItem('rateLimitInfo', JSON.stringify(info));
    return true;
  };

  useEffect(() => {
    // Calcular las solicitudes restantes solo en el cliente
    const calculateRemaining = () => {
      const today = new Date().toDateString();
      const stored = localStorage.getItem('rateLimitInfo');
      
      if (!stored) return MAX_REQUESTS_PER_DAY;
      
      const info: RateLimitInfo = JSON.parse(stored);
      
      if (info.date !== today) return MAX_REQUESTS_PER_DAY;
      
      return Math.max(0, MAX_REQUESTS_PER_DAY - info.count);
    };
    
    setRemainingRequests(calculateRemaining());
  }, [result]); // Actualizar cuando cambie el resultado

  const getRemainingRequests = (): number => {
    if (typeof window === 'undefined') return MAX_REQUESTS_PER_DAY;
    
    const today = new Date().toDateString();
    const stored = localStorage.getItem('rateLimitInfo');
    
    if (!stored) return MAX_REQUESTS_PER_DAY;
    
    const info: RateLimitInfo = JSON.parse(stored);
    
    if (info.date !== today) return MAX_REQUESTS_PER_DAY;
    
    return Math.max(0, MAX_REQUESTS_PER_DAY - info.count);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Por favor ingresa un texto');
      return;
    }

    if (!checkRateLimit()) {
      setError(`Has alcanzado el límite de ${MAX_REQUESTS_PER_DAY} solicitudes por día. Vuelve mañana!`);
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el texto');
      }

      setResult(data.result);
    } catch (err: any) {
      const errorMessage = err.message || 'Hubo un error al procesar tu solicitud. Intenta nuevamente.';
      setError(errorMessage);
      console.error('Error completo:', err);
    } finally {
      setLoading(false);
    }
  };

  const actionLabels: Record<ActionType, string> = {
    improve: t.improve,
    summarize: t.summarize,
    translate: t.translate,
    formal: t.formal,
    casual: t.casual,
    email: t.email,
    social: t.social,
    headline: t.headline,
    spell: t.spell,
    paraphrase: t.paraphrase,
    story: t.story,
    twitter: t.twitter,
    cv: t.cv,
    cover: t.cover,
    interview: t.interview,
    linkedin: t.linkedin,
    presentation: t.presentation,
    finance: t.finance,
    business: t.business,
    savings: t.savings,
    financeterm: t.financeterm,
    salary: t.salary,
    businessmodel: t.businessmodel,
    bankAnalyzer: t.bankAnalyzer,
    eli5: t.eli5,
    quiz: t.quiz,
    studysummary: t.studysummary,
    research: t.research,
    language: t.language,
    naming: t.naming,
    adcopy: t.adcopy,
    videoscript: t.videoscript,
    birthday: t.birthday,
    gift: t.gift,
    relationship: t.relationship,
    pulse: '🔥 Pulse (Twitter)',
  };

  const placeholders: Record<ActionType, string> = {
    // Escritura & Contenido
    improve: 'Escribe o pega tu texto aquí...',
    summarize: 'Pega el texto que quieres resumir...',
    translate: 'Texto a traducir al inglés...',
    formal: 'Texto a formalizar...',
    casual: 'Texto a hacer casual...',
    email: 'Describe qué email necesitas (ej: pedir reunión con jefe, seguimiento cliente)...',
    social: 'Describe tu post (ej: lanzamiento producto, tips negocio, logro personal)...',
    headline: 'Describe el tema para crear titular llamativo...',
    spell: 'Pega el texto para corregir ortografía...',
    paraphrase: 'Texto a parafrasear...',
    story: 'Describe los hechos/datos que quieres convertir en historia...',
    twitter: 'Describe tu tweet o hilo (tema, objetivo, tono: viral/educativo/divertido)...',
    // Profesional & Carrera
    cv: 'Pega tu experiencia laboral o sección del CV...',
    cover: 'Describe: puesto, empresa, tus skills principales...',
    interview: 'Describe: puesto, empresa, tus preocupaciones...',
    linkedin: 'Describe: tu profesión, experiencia, logros clave...',
    presentation: 'Describe el proyecto/tema a presentar...',
    // Finanzas & Negocios
    finance: 'Tu consulta financiera: inversiones, ahorro, presupuesto, deudas...',
    business: 'Describe tu idea de negocio en detalle...',
    savings: 'Describe: ingresos mensuales, gastos, meta de ahorro...',
    financeterm: 'Qué término financiero quieres que te explique...',
    salary: 'Describe: puesto actual, salario, logros, mercado...',
    businessmodel: 'Describe tu idea: problema, solución, cliente, propuesta de valor...',
    bankAnalyzer: 'Sube tu extracto bancario (Excel o CSV)...',
    // Educación & Aprendizaje
    eli5: 'Qué concepto quieres que explique de forma simple...',
    quiz: 'Pega el tema/contenido para generar preguntas de estudio...',
    studysummary: 'Pega el material de estudio a resumir...',
    research: 'Describe el tema de tu paper/proyecto...',
    language: 'Escribe en el idioma que practicas y te corregiré...',
    // Creatividad & Marketing
    naming: 'Describe tu producto/empresa para generar nombres...',
    adcopy: 'Describe: producto/servicio, público objetivo, beneficio clave...',
    videoscript: 'Describe el tema/objetivo de tu video...',
    birthday: 'Describe: persona, relación, gustos, edad...',
    gift: 'Describe: persona, ocasión, presupuesto, intereses...',
    // Estilo de Vida
    relationship: 'Describe tu situación o consulta sobre relaciones, pareja, comunicación...',
    // Social Intelligence
    pulse: 'Escribe el tema que quieres analizar en Twitter (ej: elecciones argentina, bitcoin, messi)...',
  };

  const categories: Record<Category, { label: string; actions: ActionType[] }> = {
    writing: {
      label: t.categoryWriting,
      actions: ['improve', 'summarize', 'translate', 'formal', 'casual', 'email', 'social', 'headline', 'spell', 'paraphrase', 'story', 'twitter'],
    },
    professional: {
      label: t.categoryProfessional,
      actions: ['cv', 'cover', 'interview', 'linkedin', 'presentation'],
    },
    finance: {
      label: t.categoryFinance,
      actions: ['finance', 'business', 'savings', 'financeterm', 'salary', 'businessmodel', 'bankAnalyzer'],
    },
    education: {
      label: t.categoryEducation,
      actions: ['eli5', 'quiz', 'studysummary', 'research', 'language'],
    },
    creative: {
      label: t.categoryCreative,
      actions: ['naming', 'adcopy', 'videoscript', 'birthday', 'gift'],
    },
    lifestyle: {
      label: t.categoryLifestyle,
      actions: ['relationship'],
    },
    social: {
      label: '🔥 Social Intelligence',
      actions: ['pulse'],
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 flex gap-2">
          {(['es', 'en', 'pt'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                language === lang
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* SEO-Rich Hero Section */}
        <div className="text-center mb-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Free AI Assistant with <span className="text-indigo-600">35 Specialized Agents</span>
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 font-medium">
            No Signup Required • Unlimited Free Access • Multi-Language Support
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Transform your workflow with AI-powered tools for <strong>writing</strong>, <strong>career development</strong>, <strong>finance</strong>, <strong>education</strong>, and more. 
            All agents are <strong>100% free</strong>, require no registration, and support English, Spanish, and Portuguese.
          </p>
          
          {/* Key Features - SEO Keywords */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="text-2xl mb-1">✍️</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">AI Writing Assistant</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="text-2xl mb-1">💼</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">CV Generator</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="text-2xl mb-1">💰</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">Financial Advisor</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <div className="text-2xl mb-1">🌍</div>
              <div className="font-semibold text-gray-800 dark:text-gray-200">Translation Service</div>
            </div>
          </div>

          {remainingRequests !== null && (
            <div className="inline-block px-6 py-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
              <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                ⚡ {remainingRequests} {t.requestsLeft}
              </span>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Category Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex overflow-x-auto scrollbar-thin">
                {(Object.keys(categories) as Category[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setAction(categories[cat].actions[0]);
                    }}
                    className={`flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all border-b-2 ${
                      category === cat
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {categories[cat].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mb-6">
                {categories[category].actions.map((act) => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => {
                      setAction(act);
                      setSelectedFile(null);
                      setText('');
                      setError('');
                      setResult('');
                    }}
                    className={`py-3 px-2 rounded-lg text-xs font-medium transition-all transform hover:scale-105 ${
                      action === act
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {actionLabels[act]}
                  </button>
                ))}
              </div>

              {/* Input Area - Conditional: File Upload or Text Area */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {action === 'bankAnalyzer' ? '� ' + actionLabels[action] : '�💬 ' + actionLabels[action]}
                </label>
                
                {action === 'bankAnalyzer' ? (
                  <div>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setError('');
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full h-40 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 cursor-pointer transition-all bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="text-center">
                        {selectedFile ? (
                          <>
                            <div className="text-4xl mb-2">📄</div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {selectedFile.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </div>
                            <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                              Click para cambiar archivo
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-4xl mb-2">📤</div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Click para seleccionar archivo
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Excel (.xlsx, .xls) o CSV (máx 10MB)
                            </div>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                ) : (
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-40 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-all"
                    placeholder={placeholders[action]}
                  />
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
              >
                {loading ? t.generating : t.generateButton}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-xl">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⚠️</span>
              <p className="flex-1">{error}</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center">
                {t.result}
              </h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  alert(t.copied);
                }}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
              >
                {t.copy}
              </button>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-700">
              <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                {result}
              </div>
            </div>
          </div>
        )}

        {/* Floating Donate Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            {/* Tooltip */}
            {showDonateTooltip && (
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg p-3 shadow-xl">
                <p className="font-semibold mb-1">{t.donateTooltip}</p>
                <p className="text-xs text-gray-300">{t.donateMessage}</p>
                <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700"></div>
              </div>
            )}
            
            {/* Donate Button */}
            <button
              onClick={() => window.open(getDonationLink(language), '_blank')}
              onMouseEnter={() => setShowDonateTooltip(true)}
              onMouseLeave={() => setShowDonateTooltip(false)}
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center gap-2"
            >
              <span className="text-2xl group-hover:animate-bounce">☕</span>
              <span className="hidden sm:inline">{t.donateButton}</span>
            </button>
          </div>
        </div>

        {/* Thank You Message in Results */}
        {result && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'es' ? '¿Este resultado te ayudó?' : language === 'en' ? 'Did this help you?' : 'Isso te ajudou?'}{' '}
              <button
                onClick={() => window.open(getDonationLink(language), '_blank')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                {t.supportProject}
              </button>
            </p>
          </div>
        )}

        {/* SEO FAQ Section with Schema Markup */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="font-semibold text-lg text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600" itemProp="name">
                Is this AI assistant really free?
              </summary>
              <div className="mt-4 text-gray-600 dark:text-gray-300" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">
                  Yes! This AI assistant is <strong>100% free forever</strong>. No hidden costs, no premium tiers, no credit card required. 
                  We use the free tier of Groq AI (14,400 requests/day) and host on Vercel's free plan. 
                  If you find it useful, consider supporting via voluntary donations.
                </p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="font-semibold text-lg text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600" itemProp="name">
                Do I need to create an account or sign up?
              </summary>
              <div className="mt-4 text-gray-600 dark:text-gray-300" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">
                  <strong>No signup required!</strong> You can start using all 33 AI agents immediately without creating an account, 
                  providing email, or logging in. Your privacy is protected - we don't collect personal data.
                </p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="font-semibold text-lg text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600" itemProp="name">
                What can I do with these 33 AI agents?
              </summary>
              <div className="mt-4 text-gray-600 dark:text-gray-300" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <div itemProp="text">
                  <p className="mb-2">Our AI agents cover 6 major categories:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li><strong>Writing:</strong> Improve text, summarize, translate, paraphrase, spell check, generate stories/headlines</li>
                    <li><strong>Professional:</strong> Create CVs, cover letters, LinkedIn profiles, interview prep, presentations</li>
                    <li><strong>Finance:</strong> Financial advice, business plans, savings strategies, salary negotiation</li>
                    <li><strong>Education:</strong> ELI5 explanations, quizzes, study guides, research help, language learning</li>
                    <li><strong>Creative:</strong> Brand naming, ad copy, video scripts, gift ideas</li>
                    <li><strong>Lifestyle:</strong> Relationship advice, birthday messages, social content</li>
                  </ul>
                </div>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="font-semibold text-lg text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600" itemProp="name">
                Which languages are supported?
              </summary>
              <div className="mt-4 text-gray-600 dark:text-gray-300" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">
                  The interface supports <strong>3 languages</strong>: English, Spanish (Español), and Portuguese (Português). 
                  The AI can understand and generate content in dozens of languages depending on your input. 
                  Translation agents can convert between virtually any language pair.
                </p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="font-semibold text-lg text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600" itemProp="name">
                How is this better than ChatGPT or other AI assistants?
              </summary>
              <div className="mt-4 text-gray-600 dark:text-gray-300" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">
                  Unlike ChatGPT: <strong>(1)</strong> No account needed, <strong>(2)</strong> Completely free with no rate limits, 
                  <strong>(3)</strong> Specialized agents for specific tasks (faster results), <strong>(4)</strong> Simpler interface focused on productivity, 
                  <strong>(5)</strong> Multi-language interface. Perfect for quick tasks without the hassle of logging in or paying for premium features.
                </p>
              </div>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="font-semibold text-lg text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600" itemProp="name">
                Is my data private and secure?
              </summary>
              <div className="mt-4 text-gray-600 dark:text-gray-300" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">
                  Yes. We don't store your input text or AI responses on our servers. Rate limiting is done via browser localStorage only. 
                  Your data is sent directly to Groq AI for processing and not retained. We don't use cookies for tracking or analytics.
                </p>
              </div>
            </details>
          </div>

          {/* Additional SEO content */}
          <div className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p className="mb-4">
              <strong>Keywords:</strong> free AI tools, AI writing assistant, AI CV generator, free financial advisor AI, 
              no signup AI, AI text improver, AI translation, AI content generator, free productivity tools
            </p>
            <p>
              Built with Next.js + Groq AI • Open Source • Made with ❤️ by <a href="https://cafecito.app/compound" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">Compound</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
