import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Healthway Diagnostics | Retina Analysis",
  description: "High-precision AI analysis for clinical retina diagnostics.",
};

const Navbar = () => {
  return (
    <nav className="bg-white/80 border-b border-slate-100 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-accent-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6 shadow-lg shadow-accent-primary/20">
             <div className="w-5 h-5 border-[3px] border-white rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 tracking-tighter leading-none">
              Healthway
            </span>
            <span className="text-[10px] font-bold text-accent-primary uppercase tracking-[0.2em] leading-none mt-1">
              Diagnostics
            </span>
          </div>
        </Link>
        
        <div className="flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-accent-primary transition-colors">Home</Link>
          <Link href="/history" className="hover:text-accent-primary transition-colors">History</Link>
          <Link href="/technology" className="hover:text-accent-primary transition-colors">Technology</Link>
          <Link href="/upload" className="clinical-btn !py-2.5 !px-6 text-[11px] shadow-sm">
            Launch Portal
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
