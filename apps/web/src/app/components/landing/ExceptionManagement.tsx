import { AlertTriangle, Clock, MapPin, AlertCircle } from 'lucide-react';

export default function ExceptionManagement() {
  return (
    <section className="py-32 bg-[#F7F7F5] border-y border-[#E5E5E5]">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Copy */}
        <div>
          <h2 className="text-[clamp(36px,4vw,56px)] font-bold text-[#0A0A0A] leading-[1.1] mb-6 tracking-tight">
            Detect problems before they become delays
          </h2>
          <p className="text-[20px] text-[#5F6368] leading-[1.6]">
            ShipFlow isn't simply tracking shipments — it actively helps operators respond to disruptions before they impact your customers.
          </p>
        </div>

        {/* Visual */}
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] h-[500px] p-8 flex flex-col justify-center">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E5E5]">
            <span className="text-xs font-bold text-[#5F6368] uppercase tracking-widest">Exception Center</span>
            <span className="bg-[#FEF2F2] text-[#EF4444] px-2 py-1 rounded text-xs font-bold border border-[#FCA5A5]">HIGH PRIORITY</span>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-1">SHP-2031</h3>
                <p className="text-sm font-semibold text-[#EF4444]">Potential 45 min delay</p>
              </div>
            </div>

            <div className="bg-[#F7F7F5] p-4 rounded-xl border border-[#E5E5E5]">
              <p className="text-xs font-bold text-[#5F6368] uppercase tracking-wider mb-3">Cause Indicators</p>
              <ul className="space-y-2 text-sm font-medium text-[#0A0A0A]">
                <li className="flex items-center gap-2"><AlertCircle size={14} className="text-[#EF4444]" /> Traffic congestion</li>
                <li className="flex items-center gap-2"><MapPin size={14} className="text-[#F59E0B]" /> Route deviation</li>
                <li className="flex items-center gap-2"><Clock size={14} className="text-[#F59E0B]" /> Schedule pressure</li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-[#5F6368] uppercase tracking-wider mb-2">Recommended Action</p>
              <div className="border border-[#E5E5E5] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#0A0A0A]">Alternative route available</p>
                  <p className="text-xs text-[#5F6368]">Saves ~22 mins</p>
                </div>
                <button className="px-4 py-2 bg-[#0A0A0A] text-[#FFFFFF] text-xs font-semibold rounded-lg hover:bg-[#222222] transition-colors">
                  Review Route
                </button>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </section>
  );
}
