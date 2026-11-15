'use client';

import { useState } from 'react';
import { Database, Server, Cpu, Globe, Layers } from 'lucide-react';

const archNodes = [
  { id: 'frontend', title: 'Next.js Frontend', icon: <Globe size={24}/>, type: 'Web Application', desc: 'Real-time dashboard and logistics control center with interactive maps.' },
  { id: 'api', title: 'NestJS API Core', icon: <Server size={24}/>, type: 'REST & WebSockets', desc: 'Handles authentication, shipment orchestration, and streams live telemetry via Socket.IO.' },
  { id: 'db', title: 'PostgreSQL', icon: <Database size={24}/>, type: 'Persistent Storage', desc: 'Maintains canonical state of shipments, fleet status, and historical route data.' },
  { id: 'queue', title: 'Redis + BullMQ', icon: <Layers size={24}/>, type: 'Event Queue', desc: 'Asynchronous event bus managing ETA recalculations, optimization jobs, and notifications.' },
  { id: 'ml', title: 'FastAPI ML Service', icon: <Cpu size={24}/>, type: 'Inference Engine', desc: 'Runs XGBoost models for predictive ETAs, risk scoring, and OR-Tools for dynamic route optimization.' }
];

export default function Architecture() {
  const [activeNode, setActiveNode] = useState(archNodes[1]);

  return (
    <section id="architecture" className="py-24 bg-[#151922] border-t border-[#272D38]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5F7FA] mb-4">Built for Real-Time Logistics</h2>
          <p className="text-[#9AA3B2]">A modern, scalable architecture designed for high-throughput telematics and machine learning inference.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Visual Diagram */}
          <div className="relative">
            <div className="flex flex-col items-center gap-6">
              
              <ArchNode node={archNodes[0]} active={activeNode.id === 'frontend'} onClick={() => setActiveNode(archNodes[0])} />
              
              <div className="h-6 w-px bg-[#272D38]" />
              
              <ArchNode node={archNodes[1]} active={activeNode.id === 'api'} onClick={() => setActiveNode(archNodes[1])} />
              
              <div className="flex gap-16 w-full justify-center">
                <div className="w-px h-6 bg-[#272D38] translate-x-[90px]" />
                <div className="w-px h-6 bg-[#272D38] -translate-x-[90px]" />
              </div>
              
              <div className="flex gap-8 w-full justify-center">
                <ArchNode node={archNodes[2]} active={activeNode.id === 'db'} onClick={() => setActiveNode(archNodes[2])} />
                <ArchNode node={archNodes[3]} active={activeNode.id === 'queue'} onClick={() => setActiveNode(archNodes[3])} />
              </div>

              <div className="h-6 w-px bg-[#272D38] translate-x-[110px]" />

              <div className="flex w-full justify-end pr-[40px]">
                <ArchNode node={archNodes[4]} active={activeNode.id === 'ml'} onClick={() => setActiveNode(archNodes[4])} />
              </div>

            </div>
          </div>

          {/* Details Panel */}
          <div className="bg-[#191E28] border border-[#272D38] rounded-2xl p-8 shadow-sm h-full flex flex-col justify-center transition-all">
            <div className="w-14 h-14 bg-[#4F8FF7]/10 text-[#4F8FF7] border border-[#4F8FF7]/20 rounded-xl flex items-center justify-center mb-6">
              {activeNode.icon}
            </div>
            
            <p className="text-[10px] font-bold text-[#9AA3B2] tracking-wider mb-2 uppercase">{activeNode.type}</p>
            <h3 className="text-2xl font-bold text-[#F5F7FA] mb-4">{activeNode.title}</h3>
            <p className="text-[#9AA3B2] text-lg leading-relaxed">
              {activeNode.desc}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

function ArchNode({ node, active, onClick }: { node: any, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-64 p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${
        active 
          ? 'bg-[#191E28] border-[#4F8FF7] shadow-sm' 
          : 'bg-[#0F1117] border-[#272D38] hover:border-[#4B5563]'
      }`}
    >
      <div className={`p-2 rounded-lg ${active ? 'bg-[#4F8FF7] text-[#F5F7FA]' : 'bg-[#191E28] border border-[#272D38] text-[#9AA3B2]'}`}>
        {node.icon}
      </div>
      <div className="text-left">
        <p className={`font-bold text-sm ${active ? 'text-[#F5F7FA]' : 'text-[#9AA3B2]'}`}>{node.title}</p>
        <p className="text-[10px] text-[#9AA3B2] uppercase tracking-wider">{node.type}</p>
      </div>
    </button>
  );
}
