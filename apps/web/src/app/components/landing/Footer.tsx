import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E5E5E5] pt-24 pb-12">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-24">
          
          <div className="col-span-2 md:col-span-2">
            <span className="text-2xl font-bold text-[#0A0A0A] tracking-tight block mb-4">ShipFlow</span>
            <p className="text-[#5F6368] max-w-xs">
              AI-Powered Intelligent Logistics & Route Optimization Platform.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#0A0A0A] mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[#5F6368] hover:text-[#0A0A0A] transition-colors">Shipment Management</Link></li>
              <li><Link href="#" className="text-[#5F6368] hover:text-[#0A0A0A] transition-colors">Fleet Tracking</Link></li>
              <li><Link href="#" className="text-[#5F6368] hover:text-[#0A0A0A] transition-colors">Route Intelligence</Link></li>
              <li><Link href="#" className="text-[#5F6368] hover:text-[#0A0A0A] transition-colors">Predictive ETA</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0A0A0A] mb-6">Technology</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[#5F6368] hover:text-[#0A0A0A] transition-colors">Event-Driven Architecture</Link></li>
              <li><Link href="#" className="text-[#5F6368] hover:text-[#0A0A0A] transition-colors">ML Intelligence</Link></li>
              <li><Link href="#" className="text-[#5F6368] hover:text-[#0A0A0A] transition-colors">Real-Time Tracking</Link></li>
              <li><Link href="#" className="text-[#5F6368] hover:text-[#0A0A0A] transition-colors">Optimization</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0A0A0A] mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[#5F6368] hover:text-[#0A0A0A] transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-[#5F6368] hover:text-[#0A0A0A] transition-colors">Architecture</Link></li>
              <li><Link href="#" className="text-[#5F6368] hover:text-[#0A0A0A] transition-colors">API</Link></li>
              <li><Link href="#" className="text-[#5F6368] hover:text-[#0A0A0A] transition-colors">GitHub</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-[#E5E5E5] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#5F6368]">
          <span>© 2026 ShipFlow</span>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#0A0A0A] transition-colors">About</Link>
            <Link href="#" className="hover:text-[#0A0A0A] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
