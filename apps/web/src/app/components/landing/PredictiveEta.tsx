export default function PredictiveEta() {
  return (
    <section className="py-32 bg-[#FFFFFF]">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Visual */}
        <div className="bg-[#F7F7F5] border border-[#E5E5E5] rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] h-[500px] p-8 flex items-center justify-center order-2 lg:order-1">
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
            <div className="p-6 border-b border-[#E5E5E5]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-[#0A0A0A]">SHP-2031</span>
                <span className="text-xs font-semibold text-[#5F6368]">Delhi → Jaipur</span>
              </div>
              
              <div className="mb-6">
                <p className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider mb-1">Predicted Arrival</p>
                <p className="text-4xl font-bold text-[#0A0A0A]">4:32 PM</p>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider mb-1">Delivery Window</p>
                  <p className="text-sm font-medium text-[#0A0A0A]">4:30 – 5:00 PM</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider mb-1">Risk</p>
                  <span className="bg-[#ECFDF5] text-[#10B981] px-2 py-0.5 rounded text-xs font-bold border border-[#A7F3D0]">LOW</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-[#F7F7F5]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-[#5F6368] uppercase tracking-wider">Prediction Confidence</span>
                <span className="text-sm font-bold text-[#0A0A0A]">87%</span>
              </div>
              
              {/* Chart */}
              <div className="flex items-end h-16 gap-1 w-full mt-2">
                {[12, 14, 9, 6, 4, 3, 2].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#E5E5E5] rounded-t relative transition-colors" style={{ height: `${(h/15)*100}%` }}>
                    {i === 4 && <div className="absolute -top-1 w-full h-0.5 bg-[#2563EB]" />}
                    {i === 6 && <div className="absolute inset-0 bg-[#0A0A0A] rounded-t" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <h2 className="text-[clamp(36px,4vw,56px)] font-bold text-[#0A0A0A] leading-[1.1] mb-6 tracking-tight">
            Know when every shipment will arrive
          </h2>
          <p className="text-[20px] text-[#5F6368] leading-[1.6]">
            ShipFlow continuously estimates delivery times and identifies shipments that may miss their delivery windows.
          </p>
        </div>

      </div>
    </section>
  );
}
