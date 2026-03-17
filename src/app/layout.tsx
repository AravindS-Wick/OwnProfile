import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "@/styles/globals.css";
import { getProfile } from "@/lib/data";

// const CursorProvider = dynamic(() => import("@/components/ui/CursorProvider"), { ssr: false });
const LoadingScreen = dynamic(() => import("@/components/ui/LoadingScreen"), { ssr: false });
const EasterEgg = dynamic(() => import("@/components/ui/EasterEgg"), { ssr: false });
const ThemeProvider = dynamic(() => import("@/components/ui/ThemeProvider"), { ssr: false });
const ThemeSwitcher = dynamic(() => import("@/components/ui/ThemeSwitcher"), { ssr: false });

export async function generateMetadata(): Promise<Metadata> {
  const profile = getProfile();
  return {
    title: `${profile.name} — ${profile.title}`,
    description: profile.bio,
    keywords: [
      "Full Stack Developer",
      "React",
      "Next.js",
      "API Development",
      "GCP",
      "Azure",
      "Mobile App",
      "UI Developer",
      profile.name,
    ],
    authors: [{ name: profile.name }],
    openGraph: {
      title: `${profile.name} — ${profile.title}`,
      description: profile.bio,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} — ${profile.title}`,
      description: profile.bio,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#0a0e1a" />
      </head>
      <body>
        <ThemeProvider />
        <LoadingScreen />
        {/* <CursorProvider /> */}
        <EasterEgg />
        <ThemeSwitcher />
        {children}
      </body>
    </html>
  );
}
