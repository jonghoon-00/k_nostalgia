'use client';
import { useScrollTopStore } from '@/zustand/useScrollTopStore';
import { useEffect, useRef } from 'react';

export function TopSentinel() {
  const setIsAtTop = useScrollTopStore((s) => s.setIsAtTop);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setIsAtTop(entry.isIntersecting), // 보이면 최상단(true), 안 보이면 false
      { root: null, threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [setIsAtTop]);

  return (
    // 문서 최상단 바로 아래에 두기
    <div
      ref={ref}
      aria-hidden
      className="h-px w-px opacity-0 pointer-events-none"
    />
  );
}
