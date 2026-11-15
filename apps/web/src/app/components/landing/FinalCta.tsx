import Link from 'next/link';
import { ArrowRight, CircleCheck } from 'lucide-react';
import { container } from './ui';

export default function FinalCta() {
  return (
    <section className="bg-white pb-20 lg:pb-24">
      <div className={container}>
        <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#0B5F2A_0%,#087D31_45%,#13A04A_100%)] px-6 py-14 text-center shadow-[0_30px_80px_-24px_rgba(8,90,40,0.55)] sm:px-12 lg:py-20">
          {/* soft highlights */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#4ADE80]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#BBF7D0]/20 blur-3xl" />
          <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full opacity-25" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden>
            <path d="M0 80 C200 40 400 90 600 60 S1000 20 1200 50" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="14 12" />
          </svg>

          <div className="relative mx-auto max-w-[720px]">
            <h2 className="text-[clamp(32px,4vw,54px)] font-extrabold leading-[1.06] tracking-[-0.045em] text-white">
              Make every delivery more predictable.
            </h2>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-[1.65] text-white/85">
              Bring shipment management, fleet intelligence, predictive ETA and route optimisation into one operational platform.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-[15px] font-bold text-[#087D31] shadow-lg transition-colors hover:bg-[#F0FDF4] sm:w-auto">
                Get started free <ArrowRight size={17} />
              </Link>
              <Link href="/dashboard" className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/40 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto">
                View dashboard
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13.5px] text-white/85">
              {['Live fleet tracking', 'ML delay prediction', 'Route optimisation'].map(t => (
                <li key={t} className="inline-flex items-center gap-1.5"><CircleCheck size={15} /> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
