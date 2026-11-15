export default function InteractiveDemo() {
  return (
    <section className="py-32 bg-[#FFFFFF]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-[#5F6368] mb-4 uppercase tracking-widest">Interactive demonstration</p>
          <h2 className="text-[clamp(36px,4vw,56px)] font-bold text-[#0A0A0A] leading-[1.1] tracking-tight">
            See ShipFlow in action
          </h2>
        </div>

        <div className="bg-[#F7F7F5] border border-[#E5E5E5] rounded-[24px] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          
          <div className="p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#E5E5E5]">
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-8">Scenario: High-volume delivery operation</h3>
            
            <ul className="space-y-4 mb-12 text-[#5F6368] text-lg">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" /> 100 shipments</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" /> 20 vehicles</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" /> Multiple delivery windows</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" /> Real-time tracking</li>
            </ul>
          </div>
          
          <div className="p-12 lg:p-16 space-y-8">
            <div>
              <h4 className="text-sm font-bold text-[#5F6368] uppercase tracking-widest mb-2">Problem</h4>
              <p className="text-[#0A0A0A] text-lg font-medium">Traffic disruption affected multiple routes.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#5F6368] uppercase tracking-widest mb-2">ShipFlow detected</h4>
              <p className="text-[#0A0A0A] text-lg font-medium">Delay risk across affected shipments.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#5F6368] uppercase tracking-widest mb-2">Action</h4>
              <p className="text-[#0A0A0A] text-lg font-medium">Route optimization generated alternatives.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#5F6368] uppercase tracking-widest mb-2">Result</h4>
              <p className="text-[#2563EB] text-lg font-medium">Updated routes were pushed to affected vehicles.</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
