import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import DashboardPreview from './components/landing/DashboardPreview';
import Capabilities from './components/landing/Capabilities';
import Metrics from './components/landing/Metrics';
import SimplifyLogistics from './components/landing/SimplifyLogistics';
import RouteOptimizationDemo from './components/landing/RouteOptimizationDemo';
import PredictiveEta from './components/landing/PredictiveEta';
import ExceptionManagement from './components/landing/ExceptionManagement';
import FleetTracking from './components/landing/FleetTracking';
import EventDriven from './components/landing/EventDriven';
import IntelligenceLayer from './components/landing/IntelligenceLayer';
import CompletePlatform from './components/landing/CompletePlatform';
import InteractiveDemo from './components/landing/InteractiveDemo';
import Faq from './components/landing/Faq';
import FinalCta from './components/landing/FinalCta';
import Footer from './components/landing/Footer';

export const metadata = {
  title: 'ShipFlow | Enterprise Logistics Platform',
  description: 'ShipFlow combines real-time fleet intelligence, predictive ETA, and intelligent route optimization to help logistics teams deliver faster.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0A0A0A] selection:bg-[#2563EB]/20 font-sans">
      <Navbar />
      
      <main>
        <Hero />
        <DashboardPreview />
        <Capabilities />
        <Metrics />
        <SimplifyLogistics />
        <RouteOptimizationDemo />
        <PredictiveEta />
        <ExceptionManagement />
        <FleetTracking />
        <EventDriven />
        <IntelligenceLayer />
        <CompletePlatform />
        <InteractiveDemo />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}
