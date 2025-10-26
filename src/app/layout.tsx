import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free AI Assistant - 33 AI Agents for Writing, Career, Finance & More | No Signup Required",
  description: "Free AI-powered tools: improve writing, create CVs, get financial advice, generate content. 33 specialized AI agents. No registration, unlimited use. Available in English, Spanish & Portuguese.",
  keywords: "free AI assistant, AI writing tool, AI CV generator, free financial advisor AI, AI text improver, no signup AI tools, free AI agents, multilingual AI assistant",
  authors: [{ name: "Compound", url: "https://cafecito.app/compound" }],
  creator: "Compound",
  publisher: "Compound",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_ES", "pt_BR"],
    url: "https://agent-ten-blue.vercel.app",
    siteName: "Free AI Assistant - 33 AI Agents",
    title: "Free AI Assistant - 33 Specialized AI Agents | No Signup",
    description: "33 free AI tools for writing, career, finance, education and more. No registration required. Multi-language support.",
    images: [
      {
        url: "https://agent-ten-blue.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Free AI Assistant - 33 AI Agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Assistant - 33 AI Agents | No Signup",
    description: "33 free AI tools: writing, CV, finance, education & more. No registration needed.",
    creator: "@compound",
    images: ["https://agent-ten-blue.vercel.app/og-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://agent-ten-blue.vercel.app",
    languages: {
      "en": "https://agent-ten-blue.vercel.app",
      "es": "https://agent-ten-blue.vercel.app",
      "pt": "https://agent-ten-blue.vercel.app",
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free AI Assistant - 33 AI Agents",
    "description": "Free AI-powered tools with 33 specialized agents for writing, career, finance, education and more. No signup required.",
    "url": "https://agent-ten-blue.vercel.app",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "AI Writing Assistant",
      "CV Generator",
      "Financial Advisor",
      "Translation Service",
      "Content Generation",
      "Educational Tools"
    ],
    "inLanguage": ["en", "es", "pt"],
    "isAccessibleForFree": true,
    "author": {
      "@type": "Person",
      "name": "Compound",
      "url": "https://cafecito.app/compound"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
