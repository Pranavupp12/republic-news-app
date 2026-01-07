'use client';

import dynamic from 'next/dynamic';

// This is the same optimization code, but now valid inside a Client Component
const MobileNav = dynamic(
  () => import('./MobileNav').then((mod) => mod.MobileNav),
  { ssr: false }
);

export default function DynamicMobileNav() {
  return <MobileNav />;
}