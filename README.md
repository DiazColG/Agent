# 🤖 30 Agentes IA en 1

Una aplicación web todo-en-uno con 30 mini-agentes de inteligencia artificial especializados para diferentes tareas. Sin registro, sin base de datos, completamente gratis.

## ✨ 30 Agentes Disponibles

### � Escritura & Contenido (11 agentes)
- ✨ **Mejorar** - Mejora cualquier texto
- 📝 **Resumir** - Resume textos largos
- 🌍 **Traducir** - Traduce al inglés
- 👔 **Formal** - Convierte a tono formal
- 😊 **Casual** - Hace textos más casuales
- 📧 **Email Pro** - Escribe emails profesionales
- � **Redes** - Genera posts para redes sociales
- 📰 **Titular** - Crea titulares llamativos
- 🎯 **Ortografía** - Corrección ortográfica
- ✍️ **Parafrasear** - Reescribe evitando plagio
- 📖 **Historia** - Convierte datos en storytelling

### 💼 Profesional & Carrera (5 agentes)
- 📄 **CV** - Optimiza tu currículum
- 💌 **Carta** - Genera cover letters
- � **Entrevista** - Prepárate para entrevistas
- 🤝 **LinkedIn** - Mejora tu perfil
- 📊 **Presentación** - Crea presentaciones ejecutivas

### 💰 Finanzas & Negocios (5 agentes)
- 💰 **Asesor $** - Asesoría financiera personal
- 💡 **Negocio** - Valida ideas de negocio
- � **Ahorro** - Planes de ahorro personalizados
- 🧾 **Finanzas** - Explica conceptos financieros
- 💸 **Salario** - Tips para negociar salario

### 🎓 Educación & Aprendizaje (5 agentes)
- 👨‍🏫 **ELI5** - Explica conceptos de forma simple
- 🧠 **Quiz** - Genera preguntas de estudio
- 📚 **Estudio** - Resume material académico
- 🔍 **Research** - Crea outlines para papers
- 🗣️ **Idioma** - Practica y corrige idiomas

### 🎨 Creatividad & Marketing (5 agentes)
- 🎨 **Naming** - Nombres para marcas/productos
- 📣 **Anuncio** - Copy publicitario persuasivo
- � **Video** - Scripts para videos
- 💌 **Cumpleaños** - Mensajes personalizados
- 🎁 **Regalo** - Ideas de regalos creativas

## 🚀 Características

- 🎯 **30 agentes especializados** organizados en 5 categorías
- 🎨 **UI intuitiva con pestañas** - Todo visible de un pantallazo
- � **Sin registro ni autenticación** - Usa inmediatamente
- 🔒 **10 solicitudes gratis por día** - Control con localStorage
- 💰 **100% gratis** - Usa Groq API (tier gratuito)
- 📱 **Responsive** - Funciona en móvil y desktop
- 🌙 **Modo oscuro** - Se adapta al sistema
- ⚡ **Respuestas rápidas** - Modelo LLaMA 3.3 70B

## 🛠️ Tecnologías

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Groq API** - IA (LLaMA 3.1)
- **Vercel** - Deployment

## 📦 Instalación

1. **Clona el repositorio**
```bash
git clone <tu-repo>
cd Agent
```

2. **Instala dependencias**
```bash
npm install
```

3. **Configura variables de entorno**
```bash
# Copia el archivo de ejemplo
copy .env.example .env

# Edita .env y agrega tu API key de Groq
# Obtén una gratis en: https://console.groq.com
```

4. **Ejecuta en desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🌐 Deploy en Vercel

1. **Sube tu código a GitHub**

2. **Conecta con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio
   - Agrega la variable de entorno `GROQ_API_KEY`
   - Deploy!

3. **Variables de entorno en Vercel**
   - Settings → Environment Variables
   - Agrega: `GROQ_API_KEY` con tu API key de Groq

## 🔑 Obtener API Key de Groq (GRATIS)

1. Ve a [console.groq.com](https://console.groq.com)
2. Crea una cuenta (gratis)
3. Ve a API Keys
4. Crea una nueva key
5. Copia y pega en tu `.env`

**Plan Gratuito de Groq:**
- 14,400 requests por día
- 30 requests por minuto
- ¡Más que suficiente para tu app!

## 📱 Uso

1. Selecciona la acción que quieres realizar
2. Escribe o pega tu texto
3. Haz clic en "Procesar"
4. Copia el resultado

El límite de 10 requests por día se almacena en el navegador del usuario y se resetea automáticamente cada día.

## 🎨 Personalización

- **Colores**: Edita `tailwind.config.ts`
- **Prompts de IA**: Modifica `src/app/api/process/route.ts`
- **Límite diario**: Cambia `MAX_REQUESTS_PER_DAY` en `src/app/page.tsx`
- **Modelo de IA**: Cambia `model` en el API route (opciones: llama-3.1-70b-versatile, llama-3.1-8b-instant, etc.)

## 📝 Licencia

MIT - Úsalo como quieras!

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Abre un issue o pull request.

## ⚠️ Importante

- La API key de Groq debe mantenerse **privada**
- Nunca la subas a GitHub en archivos `.env`
- En Vercel, agrégala en Environment Variables

## 📞 Soporte

¿Problemas? Abre un issue en GitHub.

---

Hecho con ❤️ para ayudar a la gente a escribir mejor
