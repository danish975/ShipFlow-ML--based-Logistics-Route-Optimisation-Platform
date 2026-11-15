'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const EVENTS_DATA = [
  { time: '13:42:10', type: 'SHIPMENT_CREATED', id: 'SHP-2031', color: 'text-[#9AA3B2]' },
  { time: '13:42:11', type: 'VEHICLE_ASSIGNED', id: 'VH-102', color: 'text-[#4F8FF7]' },
  { time: '13:42:15', type: 'LOCATION_UPDATED', id: 'VH-102', color: 'text-[#F5F7FA]' },
  { time: '13:42:18', type: 'ETA_RECALCULATED', id: 'SHP-2031', color: 'text-[#F59E0B]' },
  { time: '13:42:22', type: 'TRAFFIC_DETECTED', id: 'NH-48', color: 'text-[#EF4444]' },
  { time: '13:42:24', type: 'DELAY_RISK_DETECTED', id: 'SHP-2031', color: 'text-[#EF4444] font-bold' },
  { time: '13:42:27', type: 'OPTIMIZATION_STARTED', id: 'SYS', color: 'text-[#4F8FF7]' },
  { time: '13:42:31', type: 'ROUTE_UPDATED', id: 'SHP-2031', color: 'text-[#22C55E] font-bold' },
  { time: '13:42:33', type: 'DRIVER_NOTIFIED', id: 'VH-102', color: 'text-[#22C55E]' },
];

export default function EventStream() {
  const [events, setEvents] = useState<typeof EVENTS_DATA>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentIndex < EVENTS_DATA.length) {
      timer = setTimeout(() => {
        setEvents(prev => [...prev, EVENTS_DATA[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, Math.random() * 800 + 400); // Random delay between 400ms and 1200ms
    } else if (currentIndex >= EVENTS_DATA.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex]);

  const handlePlayPause = () => {
    if (currentIndex >= EVENTS_DATA.length) {
      setEvents([]);
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    setEvents([]);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  return (
    <section className="py-24 bg-[#0F1117] border-t border-[#272D38]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#F5F7FA] mb-4">Watch ShipFlow React in Real Time</h2>
          <p className="text-[#9AA3B2]">The entire lifecycle of a disrupted shipment, handled autonomously.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#151922] rounded-xl border border-[#272D38] shadow-lg overflow-hidden font-mono text-sm">
          {/* Mac-like header */}
          <div className="bg-[#191E28] border-b border-[#272D38] px-4 py-3 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#272D38]" />
              <div className="w-3 h-3 rounded-full bg-[#272D38]" />
              <div className="w-3 h-3 rounded-full bg-[#272D38]" />
            </div>
            <p className="text-[10px] text-[#9AA3B2] font-sans tracking-widest uppercase">Event Stream Simulation</p>
            
            <div className="flex gap-3">
              <button onClick={handlePlayPause} className="text-[#9AA3B2] hover:text-[#F5F7FA] transition-colors">
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button onClick={handleRestart} className="text-[#9AA3B2] hover:text-[#F5F7FA] transition-colors">
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 h-[320px] overflow-y-auto flex flex-col justify-end bg-[#0F1117]/50">
            {events.length === 0 && !isPlaying && (
              <div className="text-center text-[#9AA3B2] mb-auto mt-auto font-sans">
                <p>Click Play to start the simulation.</p>
              </div>
            )}
            
            {events.map((event, i) => (
              <div key={i} className="flex gap-4 py-1.5 animate-fade-in-up">
                <span className="text-[#9AA3B2] shrink-0">{event.time}</span>
                <span className={`${event.color} w-48 shrink-0`}>{event.type}</span>
                <span className="text-[#F5F7FA]">{event.id}</span>
              </div>
            ))}
            
            {isPlaying && currentIndex < EVENTS_DATA.length && (
              <div className="flex gap-4 py-1.5 opacity-50">
                <span className="w-2 h-4 bg-[#9AA3B2] animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
