export default function CompletePlatform() {
  return (
    <section className="py-32 bg-[#F7F7F5] border-y border-[#E5E5E5]">
      <div className="max-w-[1280px] mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[clamp(36px,4vw,56px)] font-bold text-[#0A0A0A] leading-[1.1] mb-6 tracking-tight">
            One platform for the entire delivery operation
          </h2>
          <p className="text-[20px] text-[#5F6368] leading-[1.6]">
            ShipFlow connects shipment management, fleet operations, route intelligence, real-time tracking, and analytics in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[20px] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">Shipment Operations</h3>
            <p className="text-[#5F6368] text-lg">Create and manage shipments.</p>
          </div>
          
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[20px] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">Fleet Management</h3>
            <p className="text-[#5F6368] text-lg">Manage vehicles and drivers.</p>
          </div>
          
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[20px] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">Route Intelligence</h3>
            <p className="text-[#5F6368] text-lg">Optimize routes and dynamically reroute.</p>
          </div>
          
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[20px] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">Operations Intelligence</h3>
            <p className="text-[#5F6368] text-lg">Monitor risk, ETA, performance, and exceptions.</p>
          </div>

        </div>

      </div>
    </section>
  );
}
