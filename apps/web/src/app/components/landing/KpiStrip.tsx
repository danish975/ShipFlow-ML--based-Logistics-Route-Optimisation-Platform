'use client';

import { useEffect, useState, useRef } from 'react';

export default function KpiStrip() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="border-y border-[#272D38] bg-[#0F1117]">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#272D38]">
          <KpiItem label="ACTIVE SHIPMENTS" targetValue={142} isVisible={isVisible} />
          <KpiItem label="FLEET UTILIZATION" targetValue={87} suffix="%" isVisible={isVisible} className="pl-8" />
          <KpiItem label="ON-TIME DELIVERY" targetValue={96.5} suffix="%" isVisible={isVisible} decimals={1} className="pl-8" />
          <KpiItem label="AT-RISK SHIPMENTS" targetValue={3} isVisible={isVisible} className="pl-8" />
        </div>
        <p className="text-center text-[10px] text-[#9AA3B2] mt-8 uppercase tracking-widest">Simulation Data</p>
      </div>
    </div>
  );
}

function KpiItem({ 
  label, targetValue, suffix = '', isVisible, decimals = 0, className = '' 
}: { 
  label: string, targetValue: number, suffix?: string, isVisible: boolean, decimals?: number, className?: string 
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const duration = 1500; // ms
    const increment = targetValue / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setValue(targetValue);
        clearInterval(timer);
      } else {
        setValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, targetValue]);

  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-xs font-semibold text-[#9AA3B2] tracking-wider mb-2">{label}</span>
      <span className="text-4xl md:text-5xl font-bold text-[#F5F7FA]">
        {value.toFixed(decimals)}{suffix}
      </span>
    </div>
  );
}
