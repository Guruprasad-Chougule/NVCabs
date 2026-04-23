'use client';
// src/components/home/StatsSection.tsx
import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 10000, label: 'Trips Completed', suffix: '+', icon: '🚗' },
  { value: 98,    label: 'Happy Customers', suffix: '%', icon: '😊' },
  { value: 50,    label: 'Cities Covered', suffix: '+', icon: '🗺️' },
  { value: 5,     label: 'Years of Service', suffix: '+', icon: '⭐' },
];

function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ value, label, suffix, icon }: { value: number; label: string; suffix: string; icon: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCounter(value, 2000, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center py-8 px-6">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-4xl font-bold text-white mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-blue-200 font-medium">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-[#1A237E] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 0%, transparent 50%), radial-gradient(circle at 75% 50%, white 0%, transparent 50%)' }} />
      <div className="container-custom relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10 divide-y lg:divide-y-0">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}
