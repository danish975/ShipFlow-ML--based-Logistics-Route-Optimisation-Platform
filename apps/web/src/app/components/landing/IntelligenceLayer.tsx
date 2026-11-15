import { Clock, ShieldAlert, Route as RouteIcon, Replace } from 'lucide-react';

export default function IntelligenceLayer() {
  return (
    <section className="py-32 bg-[#FFFFFF]">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-[clamp(36px,4vw,56px)] font-bold text-[#0A0A0A] leading-[1.1] mb-16 tracking-tight">
          Intelligence across every stage of delivery
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5E5] p-8 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-[#F7F7F5] border border-[#E5E5E5] flex items-center justify-center mb-6 text-[#0A0A0A] group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors">
              <Clock size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">Predict</h3>
            <p className="text-[#5F6368] mb-6">ETA prediction</p>
            <div className="bg-[#F7F7F5] h-24 rounded-lg border border-[#E5E5E5] flex items-center justify-center">
               <span className="text-2xl font-bold text-[#0A0A0A]">4:32 PM</span>
            </div>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5E5] p-8 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-[#F7F7F5] border border-[#E5E5E5] flex items-center justify-center mb-6 text-[#0A0A0A] group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">Detect</h3>
            <p className="text-[#5F6368] mb-6">Delay-risk detection</p>
            <div className="bg-[#F7F7F5] h-24 rounded-lg border border-[#E5E5E5] flex items-center justify-center p-4">
               <div className="w-full bg-[#E5E5E5] h-2 rounded-full overflow-hidden">
                 <div className="w-[78%] h-full bg-[#EF4444]" />
               </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5E5] p-8 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-[#F7F7F5] border border-[#E5E5E5] flex items-center justify-center mb-6 text-[#0A0A0A] group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors">
              <RouteIcon size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">Optimize</h3>
            <p className="text-[#5F6368] mb-6">Route optimization</p>
            <div className="bg-[#F7F7F5] h-24 rounded-lg border border-[#E5E5E5] flex items-center justify-center p-4">
              <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d="M 0 10 Q 50 -10 100 10" fill="none" stroke="#0A0A0A" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5E5] p-8 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-[#F7F7F5] border border-[#E5E5E5] flex items-center justify-center mb-6 text-[#0A0A0A] group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors">
              <Replace size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">Respond</h3>
            <p className="text-[#5F6368] mb-6">Dynamic rerouting</p>
            <div className="bg-[#F7F7F5] h-24 rounded-lg border border-[#E5E5E5] flex items-center justify-center">
               <span className="px-3 py-1 bg-[#FFFFFF] rounded border border-[#E5E5E5] text-xs font-semibold text-[#0A0A0A]">Rerouted</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
