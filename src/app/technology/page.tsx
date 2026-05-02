import Link from "next/link";

export default function TechnologyPage() {
  return (
    <main className="flex-grow py-20 px-6">
      <div className="max-w-5xl mx-auto space-y-20 animate-fade-in-up">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Advanced Neural Diagnostics</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Healthway leverages cutting-edge computer vision and deep learning to identify clinical markers in fundus photography.
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="clinical-card p-10 space-y-6">
            <div className="w-12 h-12 bg-accent-primary rounded-xl flex items-center justify-center text-white">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800">Residual Networks (ResNet)</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              We utilize ResNet-18 architecture, featuring skip-connections that allow for deeper feature extraction without signal degradation. This enables precise identification of micro-hemorrhages and exudates.
            </p>
          </div>

          <div className="clinical-card p-10 space-y-6">
            <div className="w-12 h-12 bg-accent-primary rounded-xl flex items-center justify-center text-white">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800">Transfer Learning</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              By initializing our models with weights from the ImageNet dataset, we accelerate the convergence of the model on medical-specific features, ensuring higher accuracy even with specialized clinical data.
            </p>
          </div>
        </div>

        {/* Pipeline Section */}
        <div className="clinical-card p-12 bg-slate-900 text-white">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <h2 className="text-3xl font-black tracking-tight">Our Analysis Pipeline</h2>
                 <div className="space-y-6">
                    {[
                      { title: 'Normalisation', desc: 'Auto-adjusting contrast and exposure across the fundus field.' },
                      { title: 'Segmenting', desc: 'Isolating the optic disc and vascular tree for isolated review.' },
                      { title: 'Classification', desc: 'Predicting disease severity based on detected clinical lesions.' }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-6">
                         <span className="text-accent-primary font-black">0{i+1}</span>
                         <div className="space-y-1">
                            <p className="font-bold text-lg">{step.title}</p>
                            <p className="text-slate-400 text-sm">{step.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 aspect-video flex items-center justify-center">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Processing Visualizer v4.2</p>
              </div>
           </div>
        </div>

        <div className="text-center pt-10">
           <Link href="/upload" className="clinical-btn">
              Launch Diagnostic Portal
           </Link>
        </div>
      </div>
    </main>
  );
}
