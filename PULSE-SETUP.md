# 🔥 AGENTE PULSE - Twitter Intelligence Setup

## ✅ CÓDIGO YA IMPLEMENTADO

### Lo que acabamos de crear:
- ✅ Agente "Pulse" agregado a la app (categoría Social Intelligence)
- ✅ Integración con Twitter API v2
- ✅ Análisis de hasta 100 tweets por consulta
- ✅ AI analysis con Groq (sentimiento, tendencias, insights)
- ✅ Package `twitter-api-v2` instalado

---

## 🔑 PASO 1: OBTENER TWITTER API KEY

### 1. Ve a Twitter Developer Portal:
**URL:** https://developer.twitter.com/en/portal/dashboard

### 2. Crear cuenta Developer (si no tienes):
- Click en "Sign up"
- Completa el formulario básico
- Acepta términos y condiciones
- Verifica email

### 3. Crear un Project + App:

#### **Project:**
- Name: `AI Agents Social Pulse`
- Use case: "Making a bot" o "Exploring the API"  
- Description: `AI-powered social media analytics tool for real-time insights from Twitter`

#### **App:**
- App name: `agent-pulse-yourname` (debe ser único globalmente)
- Environment: `Development`

### 4. Obtener Bearer Token:
Después de crear la app, verás las keys:
- API Key
- API Secret  
- **Bearer Token** ← ¡Este es el que necesitas!

**⚠️ IMPORTANTE:** Copia el Bearer Token ahora, solo se muestra una vez.

Si lo perdiste:
- Ve a tu app en el portal
- Keys and tokens tab
- Regenerate Bearer Token

---

## 🔧 PASO 2: CONFIGURAR LOCALMENTE

### 1. Agregar Bearer Token al `.env`:

```bash
# Tu archivo .env debe tener:
GROQ_API_KEY=your_groq_api_key_here
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
```

### 2. Reiniciar servidor dev:

```bash
# Detener servidor (Ctrl+C)
npm run dev
```

---

## ⚡ PASO 3: PROBAR LOCALMENTE

### 1. Abre: http://localhost:3000

### 2. Selecciona categoría: **🔥 Social Intelligence**

### 3. Selecciona agente: **🔥 Pulse (Twitter)**

### 4. Prueba con:
- `elecciones argentina`
- `bitcoin`
- `inteligencia artificial`
- `messi`

### 5. Verifica resultado:
Deberías ver:
```
🔥 **PULSE: Análisis en tiempo real de Twitter**

📅 **Última actualización:** 26/10/2025 20:45:30
📊 **Tweets analizados:** 100
🔍 **Query:** "elecciones argentina"

---

📊 RESUMEN GENERAL
...

🔥 TEMAS PRINCIPALES
...

💭 SENTIMIENTO PREDOMINANTE
...
```

---

## 🚀 PASO 4: DEPLOY A VERCEL

### 1. Commit y push:
```bash
git add .
git commit -m "Add Pulse agent - Twitter intelligence"
git push
```

### 2. Agregar env var en Vercel:
- Ve a: https://vercel.com/diazcolg/agent
- Settings → Environment Variables
- Add:
  - **Name:** `TWITTER_BEARER_TOKEN`
  - **Value:** Tu Bearer Token de Twitter
  - **Environments:** Production, Preview, Development

### 3. Re-deploy:
Vercel automáticamente re-deployará con la nueva variable.

---

## 📊 LIMITACIONES DE TWITTER API FREE:

### **Free Tier:**
- ✅ 500,000 tweets/mes (~16,000/día)
- ✅ 100 tweets por búsqueda
- ✅ Tweets de últimos 7 días
- ❌ NO streaming en tiempo real
- ❌ NO filtros avanzados
- Rate limit: 15 requests cada 15 minutos

### **Si necesitas más:**
**Twitter API Basic ($100/mes):**
- 10M tweets/mes
- Streaming en tiempo real
- Tweets de últimos 30 días
- Filtros avanzados

---

## 🎯 CASOS DE USO:

### **Política:**
- "elecciones argentina"
- "debate presidencial"
- "milei" 
- "cristina kirchner"

### **Tecnología:**
- "inteligencia artificial"
- "chatgpt"
- "bitcoin"
- "ethereum"

### **Entretenimiento:**
- "messi"
- "river boca"
- "oscars 2025"
- "stranger things"

### **Negocios:**
- "tesla stock"
- "apple earnings"
- "inflacion argentina"
- "dolar blue"

---

## ⚠️ DISCLAIMER IMPORTANTE:

El análisis muestra SIEMPRE:

> "⚠️ Este análisis se basa únicamente en Twitter y NO representa una encuesta científica. Los resultados pueden no reflejar la opinión pública real. Twitter tiene sesgos demográficos y puede ser manipulado por bots."

---

## 🔥 MEJORAS FUTURAS (FASE 2):

### **Corto plazo (1-2 semanas):**
- [ ] Caché de resultados (evitar re-buscar mismo query)
- [ ] Gráficos de sentimiento
- [ ] Comparación temporal (hoy vs ayer)
- [ ] Export a PDF/CSV

### **Mediano plazo (1 mes):**
- [ ] Dashboard dedicado
- [ ] Histórico de 7 días
- [ ] Alertas personalizadas
- [ ] Multi-query comparison

### **Largo plazo (3 meses):**
- [ ] Upgrade a Twitter API Basic
- [ ] Streaming en tiempo real
- [ ] Predicciones con ML
- [ ] API pública para empresas

---

## 💰 MONETIZACIÓN ESPECÍFICA:

### **Tier Free:**
- 5 búsquedas/día
- 50 tweets máx
- Sin histórico

### **Tier Pro ($10/mes):**
- Búsquedas ilimitadas
- 100 tweets máx
- Histórico 7 días
- Export CSV

### **Tier Enterprise ($100/mes):**
- API access
- Streaming real-time
- Histórico 30 días
- Alertas custom
- White label

---

## ✅ CHECKLIST:

```
[ ] Registrado en Twitter Developer Portal
[ ] Project + App creados
[ ] Bearer Token copiado
[ ] TWITTER_BEARER_TOKEN agregado a .env local
[ ] Testeado localmente (elecciones argentina)
[ ] Commit + push a GitHub
[ ] TWITTER_BEARER_TOKEN agregado en Vercel
[ ] Verificado en producción: https://agent-ten-blue.vercel.app
[ ] Primera búsqueda exitosa online
```

---

**¿Listo para conquistar Twitter con AI?** 🚀

**Siguiente paso:** Dame tu Bearer Token cuando lo tengas y lo configuramos!
