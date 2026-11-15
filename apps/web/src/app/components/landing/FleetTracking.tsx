export default function FleetTracking() {
  return (
    <section className="py-32 bg-[#FFFFFF]">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-[clamp(36px,4vw,56px)] font-bold text-[#0A0A0A] leading-[1.1] mb-12 tracking-tight text-center">
          One view of your entire fleet
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['All', 'Active', 'Delayed', 'High Risk', 'Idle'].map((filter, i) => (
            <button 
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${i === 0 ? 'bg-[#0A0A0A] text-[#FFFFFF] border-[#0A0A0A]' : 'bg-[#FFFFFF] text-[#5F6368] border-[#E5E5E5] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Map visualization */}
        <div className="bg-[#F7F7F5] border border-[#E5E5E5] rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] h-[600px] relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(#E5E5E5 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
          
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 10 50 Q 30 20 50 50 T 90 30" fill="none" stroke="#2563EB" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
            <path d="M 20 80 Q 40 90 70 60 T 90 80" fill="none" stroke="#2563EB" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
          </svg>

          {/* Dots */}
          <div className="absolute top-[40%] left-[30%] w-3 h-3 bg-[#0A0A0A] rounded-full border-2 border-[#FFFFFF] shadow-sm" />
          <div className="absolute top-[60%] left-[70%] w-3 h-3 bg-[#0A0A0A] rounded-full border-2 border-[#FFFFFF] shadow-sm" />
          <div className="absolute top-[70%] left-[20%] w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#FFFFFF] shadow-sm" />
          <div className="absolute top-[30%] left-[80%] w-3 h-3 bg-[#EF4444] rounded-full border-2 border-[#FFFFFF] shadow-sm animate-pulse" />
          
          {/* Active Popup */}
          <div className="absolute top-[28%] left-[81%] bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] shadow-lg p-4 w-48 z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-[#0A0A0A] text-sm">VH-102</span>
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5F6368]">Driver</span>
                <span className="font-medium text-[#0A0A0A]">J. Smith</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6368]">Status</span>
                <span className="font-medium text-[#EF4444]">Delayed</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
