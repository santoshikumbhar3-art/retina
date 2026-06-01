import Link from "next/link";

const Hero = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/50 border border-accent-primary/20 rounded-full shadow-sm">
             <span className="w-2.5 h-2.5 bg-accent-primary rounded-full animate-pulse"></span>
             <span className="text-[11px] font-black uppercase tracking-[0.2em] text-accent-primary">Health Excellence 2026</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.05]">
            Precision Retina <br />
            <span className="text-accent-primary">Diagnostics.</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
             Advanced AI-powered screening for professional medical environments. 
             Trusted by diagnostics centers for rapid, precise results.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <Link href="/upload" className="clinical-btn w-full sm:w-auto text-lg px-10 py-5">
              Analyze Now
            </Link>
            <Link href="/technology" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 font-bold border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-all text-lg flex items-center justify-center">
              Explore Tech
            </Link>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-accent-primary/10 rounded-[3rem] blur-3xl -z-10 transition-all group-hover:bg-accent-primary/15"></div>
          <div className="clinical-card p-4 rotate-2 transition-transform group-hover:rotate-0">
             <div className="bg-white rounded-xl aspect-square flex flex-col items-center justify-center p-12 text-center border border-slate-100">
                <div className="w-24 h-24 bg-accent-primary/5 rounded-full flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                   <svg className="w-12 h-12 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                   </svg>
                </div>
                <p className="text-lg font-black uppercase tracking-[0.25em] text-slate-600">Neural Vision v4.0</p>
                <div className="mt-8 grid grid-cols-4 gap-3 w-full max-w-[240px]">
                   {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-accent-primary animate-pulse" style={{animationDelay: `${i*300}ms`, width: `${40+i*15}%`}}></div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureSection = () => {
  return (
    <section className="py-24 bg-white/40 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
         {[
           { title: 'Certified Precision', desc: 'Clinical validation with 99.8% precision across global datasets.' },
           { title: 'HL7 Integration', desc: 'Seamlessly connects with existing clinical management software.' },
           { title: 'Privacy First', desc: 'HIPAA compliant end-to-end encryption for all patient scan data.' }
         ].map((item, i) => (
           <div key={i} className="space-y-6">
              <div className="w-12 h-12 bg-accent-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent-primary/20">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{item.title}</h3>
              <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
           </div>
         ))}
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main className="flex-grow">
      <Hero />
      <FeatureSection />
      
      <section className="py-32 text-center px-6">
         <div className="max-w-3xl mx-auto space-y-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
               Elevating the standard of ocular screening globally.
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
               Join hundreds of medical facilities leveraging Healthway for their primary retina diagnostics workflow.
            </p>
            <div className="pt-6">
               <Link href="/upload" className="clinical-btn shadow-xl shadow-accent-primary/30 px-12">
                  Launch Portal →
               </Link>
            </div>
         </div>
      </section>
    </main>
  );
}
