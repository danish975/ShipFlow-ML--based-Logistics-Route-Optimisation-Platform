import type { LucideIcon } from 'lucide-react';

/*
 * Shared building blocks for the landing page, matching the hero:
 * same 1280px container, green accent (#087d31), kicker pill, soft green tints.
 */

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/** Same width rule as .landing-hero-inner / .landing-nav-inner. */
export const container = 'mx-auto w-[min(1280px,calc(100%-48px))]';

export function Section({
  id,
  tone = 'white',
  className,
  children,
}: {
  id?: string;
  tone?: 'white' | 'tint';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cx(
        'scroll-mt-20 py-20 lg:py-24',
        tone === 'tint' ? 'bg-[#F5FAF6] border-y border-[#E4EEE7]' : 'bg-white',
        className,
      )}
    >
      <div className={container}>{children}</div>
    </section>
  );
}

export function Kicker({ icon: Icon, children }: { icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-[#EAF8EE] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#147838]">
      {Icon && <Icon size={13} strokeWidth={2.5} />}
      {children}
    </p>
  );
}

/**
 * Section heading. Pass `highlight` to render part of the title in green,
 * mirroring the hero's "Predict Every Delay." treatment.
 */
export function SectionHeading({
  kicker,
  kickerIcon,
  title,
  highlight,
  description,
  align = 'left',
  className,
}: {
  kicker?: string;
  kickerIcon?: LucideIcon;
  title: string;
  highlight?: string;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div className={cx(align === 'center' && 'mx-auto max-w-[720px] text-center', className)}>
      {kicker && <Kicker icon={kickerIcon}>{kicker}</Kicker>}
      <h2
        className={cx(
          'mt-4 text-[clamp(30px,3.3vw,46px)] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#101C20]',
          align === 'left' && 'max-w-[680px]',
        )}
      >
        {title}
        {highlight && (
          <>
            {' '}
            <span className="text-[#087D31]">{highlight}</span>
          </>
        )}
      </h2>
      {description && (
        <p className={cx('mt-4 text-[16.5px] leading-[1.65] text-[#59676A]', align === 'left' && 'max-w-[560px]')}>
          {description}
        </p>
      )}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cx(
        'rounded-[20px] border border-[#E3ECE6] bg-white shadow-[0_1px_2px_rgba(16,40,24,0.04),0_8px_24px_rgba(31,89,58,0.05)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function IconChip({ icon: Icon, size = 'md', tone = 'green' }: { icon: LucideIcon; size?: 'sm' | 'md'; tone?: 'green' | 'red' | 'amber' }) {
  const tones = {
    green: 'bg-[#E8F8E8] text-[#078F33]',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <span
      className={cx(
        'grid shrink-0 place-items-center',
        size === 'sm' ? 'h-8 w-8 rounded-[9px]' : 'h-11 w-11 rounded-xl',
        tones[tone],
      )}
    >
      <Icon size={size === 'sm' ? 16 : 20} strokeWidth={2} />
    </span>
  );
}

/** GitHub mark (lucide-react v1 no longer ships brand icons). */
export function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

/** A light, stylised city map used behind the product visuals. */
export function MapBackdrop({ className }: { className?: string }) {
  return (
    <svg
      className={cx('absolute inset-0 h-full w-full', className)}
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="600" height="400" fill="#F3F7F4" />
      {/* parks */}
      <path d="M-10 40 C60 20 120 60 150 30 L170 -10 L-10 -10Z" fill="#DCEFDF" />
      <path d="M420 300 C470 270 540 290 620 260 L620 420 L400 420Z" fill="#DCEFDF" />
      <ellipse cx="300" cy="190" rx="46" ry="30" fill="#E2F2E4" />
      {/* river */}
      <path d="M-10 300 C90 270 150 330 250 300 S420 230 610 250" fill="none" stroke="#D3E8F3" strokeWidth="18" strokeLinecap="round" />
      {/* minor streets */}
      <g stroke="#E3EAE5" strokeWidth="5" strokeLinecap="round">
        <path d="M0 110 H600" /><path d="M0 220 H600" /><path d="M0 350 H600" />
        <path d="M90 0 V400" /><path d="M210 0 V400" /><path d="M380 0 V400" /><path d="M510 0 V400" />
      </g>
      {/* arterial roads */}
      <g stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" fill="none">
        <path d="M-10 170 C120 150 220 200 330 160 S520 110 610 130" />
        <path d="M150 410 C170 300 250 250 300 190 S380 60 420 -10" />
      </g>
    </svg>
  );
}
