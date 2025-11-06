// Translation system for multi-language support
export type Language = 'es' | 'en' | 'pt';

export interface Translations {
  // Header
  title: string;
  subtitle: string;
  requestsLeft: string;
  
  // Categories
  categoryWriting: string;
  categoryProfessional: string;
  categoryFinance: string;
  categoryEducation: string;
  categoryCreative: string;
  categoryLifestyle: string;
  
  // Actions - Writing
  improve: string;
  summarize: string;
  translate: string;
  formal: string;
  casual: string;
  email: string;
  social: string;
  headline: string;
  spell: string;
  paraphrase: string;
  story: string;
  twitter: string;
  
  // Actions - Professional
  cv: string;
  cover: string;
  interview: string;
  linkedin: string;
  presentation: string;
  
  // Actions - Finance
  finance: string;
  business: string;
  savings: string;
  financeterm: string;
  salary: string;
  businessmodel: string;
  bankAnalyzer: string;
  
  // Actions - Education
  eli5: string;
  quiz: string;
  studysummary: string;
  research: string;
  language: string;
  
  // Actions - Creative
  naming: string;
  adcopy: string;
  videoscript: string;
  birthday: string;
  gift: string;
  
  // Actions - Lifestyle
  relationship: string;
  
  // UI Elements
  generateButton: string;
  generating: string;
  result: string;
  copy: string;
  copied: string;
  error: string;
  
  // Donate
  donateButton: string;
  donateTooltip: string;
  donateMessage: string;
  supportProject: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    // Header
    title: '🤖 35 Agentes IA en 1',
    subtitle: 'Tu asistente multifuncional con inteligencia artificial',
    requestsLeft: 'solicitudes disponibles hoy',
    
    // Categories
    categoryWriting: '📝 Escritura',
    categoryProfessional: '💼 Carrera',
    categoryFinance: '💰 Finanzas',
    categoryEducation: '🎓 Educación',
    categoryCreative: '🎨 Creativo',
    categoryLifestyle: '💝 Vida',
    
    // Actions - Writing
    improve: '✨ Mejorar',
    summarize: '📝 Resumir',
    translate: '🌍 Traducir',
    formal: '👔 Formal',
    casual: '😊 Casual',
    email: '📧 Email Pro',
    social: '📱 Redes',
    headline: '📰 Titular',
    spell: '🎯 Ortografía',
    paraphrase: '✍️ Parafrasear',
    story: '📖 Historia',
    twitter: '🐦 Twitter',
    
    // Actions - Professional
    cv: '📄 CV',
    cover: '💌 Carta',
    interview: '🎤 Entrevista',
    linkedin: '🤝 LinkedIn',
    presentation: '📊 Presentación',
    
    // Actions - Finance
    finance: '💰 Asesor $',
    business: '💡 Negocio',
    savings: '📈 Ahorro',
    financeterm: '🧾 Finanzas',
    salary: '💸 Salario',
    businessmodel: '📋 BMC',
    bankAnalyzer: '🏦 Extractos',
    
    // Actions - Education
    eli5: '👨‍🏫 ELI5',
    quiz: '🧠 Quiz',
    studysummary: '📚 Estudio',
    research: '🔍 Research',
    language: '🗣️ Idioma',
    
    // Actions - Creative
    naming: '🎨 Naming',
    adcopy: '📣 Anuncio',
    videoscript: '🎬 Video',
    birthday: '💌 Cumpleaños',
    gift: '🎁 Regalo',
    
    // Actions - Lifestyle
    relationship: '💑 Relaciones',
    
    // UI Elements
    generateButton: '🚀 Generar con IA',
    generating: '⏳ Procesando...',
    result: '✨ Resultado',
    copy: '📋 Copiar',
    copied: '✅ Copiado al portapapeles!',
    error: '⚠️',
    
    // Donate
    donateButton: 'Invítame un café',
    donateTooltip: '¿Te sirvió?',
    donateMessage: 'Apoya el proyecto. ¡Es gratis para siempre!',
    supportProject: '☕ Apoya el proyecto',
  },
  
  en: {
    // Header
    title: '🤖 35 AI Agents in 1',
    subtitle: 'Your multifunctional AI assistant',
    requestsLeft: 'requests available today',
    
    // Categories
    categoryWriting: '📝 Writing',
    categoryProfessional: '💼 Career',
    categoryFinance: '💰 Finance',
    categoryEducation: '🎓 Education',
    categoryCreative: '🎨 Creative',
    categoryLifestyle: '💝 Life',
    
    // Actions - Writing
    improve: '✨ Improve',
    summarize: '📝 Summarize',
    translate: '🌍 Translate',
    formal: '👔 Formal',
    casual: '😊 Casual',
    email: '📧 Email Pro',
    social: '📱 Social',
    headline: '📰 Headline',
    spell: '🎯 Spelling',
    paraphrase: '✍️ Paraphrase',
    story: '📖 Story',
    twitter: '🐦 Twitter',
    
    // Actions - Professional
    cv: '📄 Resume',
    cover: '💌 Cover Letter',
    interview: '🎤 Interview',
    linkedin: '🤝 LinkedIn',
    presentation: '📊 Presentation',
    
    // Actions - Finance
    finance: '💰 Finance',
    business: '💡 Business',
    savings: '📈 Savings',
    financeterm: '🧾 Finance',
    salary: '💸 Salary',
    businessmodel: '📋 BMC',
    bankAnalyzer: '🏦 Bank Statement',
    
    // Actions - Education
    eli5: '👨‍🏫 ELI5',
    quiz: '🧠 Quiz',
    studysummary: '📚 Study',
    research: '🔍 Research',
    language: '🗣️ Language',
    
    // Actions - Creative
    naming: '🎨 Naming',
    adcopy: '📣 Ad Copy',
    videoscript: '🎬 Video',
    birthday: '💌 Birthday',
    gift: '🎁 Gift',
    
    // Actions - Lifestyle
    relationship: '💑 Relations',
    
    // UI Elements
    generateButton: '🚀 Generate with AI',
    generating: '⏳ Processing...',
    result: '✨ Result',
    copy: '📋 Copy',
    copied: '✅ Copied to clipboard!',
    error: '⚠️',
    
    // Donate
    donateButton: 'Buy me a coffee',
    donateTooltip: 'Did this help you?',
    donateMessage: 'Support the project. It\'s free forever!',
    supportProject: '☕ Support the project',
  },
  
  pt: {
    // Header
    title: '🤖 35 Agentes de IA em 1',
    subtitle: 'Seu assistente multifuncional com inteligência artificial',
    requestsLeft: 'solicitações disponíveis hoje',
    
    // Categories
    categoryWriting: '📝 Escrita',
    categoryProfessional: '💼 Carreira',
    categoryFinance: '💰 Finanças',
    categoryEducation: '🎓 Educação',
    categoryCreative: '🎨 Criativo',
    categoryLifestyle: '💝 Vida',
    
    // Actions - Writing
    improve: '✨ Melhorar',
    summarize: '📝 Resumir',
    translate: '🌍 Traduzir',
    formal: '👔 Formal',
    casual: '😊 Casual',
    email: '📧 Email Pro',
    social: '📱 Redes',
    headline: '📰 Título',
    spell: '🎯 Ortografia',
    paraphrase: '✍️ Parafrasear',
    story: '📖 História',
    twitter: '🐦 Twitter',
    
    // Actions - Professional
    cv: '📄 CV',
    cover: '💌 Carta',
    interview: '🎤 Entrevista',
    linkedin: '🤝 LinkedIn',
    presentation: '📊 Apresentação',
    
    // Actions - Finance
    finance: '💰 Finanças',
    business: '💡 Negócio',
    savings: '📈 Poupança',
    financeterm: '🧾 Finanças',
    salary: '💸 Salário',
    businessmodel: '📋 BMC',
    bankAnalyzer: '🏦 Extratos',
    
    // Actions - Education
    eli5: '👨‍🏫 ELI5',
    quiz: '🧠 Quiz',
    studysummary: '📚 Estudo',
    research: '🔍 Pesquisa',
    language: '🗣️ Idioma',
    
    // Actions - Creative
    naming: '🎨 Naming',
    adcopy: '📣 Anúncio',
    videoscript: '🎬 Vídeo',
    birthday: '💌 Aniversário',
    gift: '🎁 Presente',
    
    // Actions - Lifestyle
    relationship: '💑 Relações',
    
    // UI Elements
    generateButton: '🚀 Gerar com IA',
    generating: '⏳ Processando...',
    result: '✨ Resultado',
    copy: '📋 Copiar',
    copied: '✅ Copiado!',
    error: '⚠️',
    
    // Donate
    donateButton: 'Me pague um café',
    donateTooltip: 'Isso te ajudou?',
    donateMessage: 'Apoie o projeto. É grátis para sempre!',
    supportProject: '☕ Apoie o projeto',
  },
};

// Detect browser language
export const detectLanguage = (): Language => {
  if (typeof window === 'undefined') return 'es';
  
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('pt')) return 'pt';
  return 'en'; // Default to English for all other languages
};

// Get donation link based on region
export const getDonationLink = (language: Language): string => {
  // LATAM (Spanish/Portuguese) → Cafecito
  if (language === 'es' || language === 'pt') {
    return 'https://cafecito.app/compound';
  }
  // Rest of the world → Ko-fi
  return 'https://ko-fi.com/tuusuario';
};
