import Image from 'next/image';
import Link from 'next/link';
import { container, GithubIcon } from './ui';

const API_DOCS = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/docs`;
const GITHUB = 'https://github.com/danish975/ShipFlow-ML--based-Logistics-Route-Optimisation-Platform';

const columns: Array<{ title: string; links: Array<{ label: string; href: string; external?: boolean }> }> = [
  {
    title: 'Platform',
    links: [
      { label: 'Shipment management', href: '/dashboard/shipments' },
      { label: 'Fleet tracking', href: '/dashboard/fleet' },
      { label: 'Route intelligence', href: '/dashboard/routes' },
      { label: 'Analytics', href: '/dashboard/analytics' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Platform overview', href: '#platform' },
      { label: 'Intelligence', href: '#intelligence' },
      { label: 'Solutions', href: '#solutions' },
      { label: 'FAQ', href: '#resources' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'API documentation', href: API_DOCS, external: true },
      { label: 'GitHub repository', href: GITHUB, external: true },
      { label: 'Sign in', href: '/login' },
      { label: 'Create account', href: '/register' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#E4EEE7] bg-[#F5FAF6]">
      <div className={`${container} pb-10 pt-16`}>
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Link href="/" aria-label="ShipFlow home" className="inline-block w-[200px]">
              <Image src="/shipflow-logo.svg" alt="ShipFlow" width={482} height={146} className="h-auto w-full" />
            </Link>
            <p className="mt-4 max-w-[320px] text-[14.5px] leading-[1.6] text-[#59676A]">
              AI-powered logistics and route optimisation platform for modern delivery teams.
            </p>
            <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="ShipFlow on GitHub" className="mt-5 inline-grid h-10 w-10 place-items-center rounded-xl border border-[#DCE6DF] bg-white text-[#1F2D26] transition-colors hover:border-[#087D31] hover:text-[#087D31]">
              <GithubIcon size={18} />
            </a>
          </div>

          {columns.map(col => (
            <div key={col.title}>
              <h4 className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#101C20]">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    {l.external ? (
                      <a href={l.href} target="_blank" rel="noreferrer" className="text-[14.5px] text-[#59676A] transition-colors hover:text-[#087D31]">{l.label}</a>
                    ) : (
                      <Link href={l.href} className="text-[14.5px] text-[#59676A] transition-colors hover:text-[#087D31]">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-[#E0EAE3] pt-6 text-[13px] text-[#6B7A72] sm:flex-row">
          <span>© {new Date().getFullYear()} ShipFlow. All rights reserved.</span>
          <a href="#top" className="font-medium hover:text-[#087D31]">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
