import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#10b981" },
  ],
};

export const metadata: Metadata = {
  title: "AdamGuard Pro - AI-Powered Antivirus",
  description: "Advanced antivirus management dashboard with AI-powered threat detection, real-time protection monitoring, and team collaboration features.",
  keywords: ["antivirus", "security", "malware protection", "threat detection", "security dashboard", "AI protection", "zero-day detection"],
  authors: [{ name: "AdamGuard Team", url: "https://adamguard.security" }],
  creator: "AdamGuard Security",
  publisher: "AdamGuard Security",
  
  // PWA Configuration
  manifest: "/manifest.json",
  
  // Icons
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/icons/safari-pinned-tab.svg", color: "#10b981" },
    ],
  },
  
  // Apple Mobile Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AdamGuard Pro",
  },
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://adamguard.security",
    siteName: "AdamGuard Pro",
    title: "AdamGuard Pro - AI-Powered Antivirus",
    description: "Advanced antivirus with AI-powered threat detection and real-time protection",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AdamGuard Pro Dashboard",
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "AdamGuard Pro - AI-Powered Antivirus",
    description: "Advanced antivirus with AI-powered threat detection",
    images: ["/og-image.png"],
    creator: "@adamguard",
  },
  
  // Other meta
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
  
  // Verification
  verification: {
    google: "google-site-verification-code",
  },
  
  // App info
  applicationName: "AdamGuard Pro",
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#10b981",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('SW registered: ', registration);
                    },
                    function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    }
                  );
                });
              }
            `,
          }}
        />
        {/* iOS PWA meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AdamGuard Pro" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        {/* Windows Tiles */}
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
