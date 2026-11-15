export default function Metrics() {
  return (
    <section className="py-32 bg-[#FFFFFF]">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-[clamp(36px,4vw,56px)] font-bold text-[#0A0A0A] leading-[1.1] mb-16 tracking-tight max-w-[800px]">
          Logistics intelligence built for every delivery
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[20px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] h-64 flex items-end">
            <h3 className="text-2xl font-bold text-[#0A0A0A] leading-snug">Real-Time<br/>Fleet Tracking</h3>
          </div>
          
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[20px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] h-64 flex items-end">
            <h3 className="text-2xl font-bold text-[#0A0A0A] leading-snug">Predictive<br/>ETA Intelligence</h3>
          </div>
          
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[20px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] h-64 flex items-end">
            <h3 className="text-2xl font-bold text-[#0A0A0A] leading-snug">Dynamic<br/>Route Optimization</h3>
          </div>
          
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[20px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] h-64 flex items-end">
            <h3 className="text-2xl font-bold text-[#0A0A0A] leading-snug">Event-Driven<br/>Operations</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
