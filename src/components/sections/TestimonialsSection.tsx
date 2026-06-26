import Link from 'next/link';
import TestimonialCard from '@/components/ui/TestimonialCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import GoldDivider from '@/components/ui/GoldDivider';

export interface TestimonialItem {
  id: string;
  name: string;
  content: string;
  rating: number;
  createdAt: string;
  adminReply?: string | null;
  adminReplyAt?: string | null;
}

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section id="recenzie" className="testimonials">
      <ScrollReveal direction="up" className="section-header">
        <p className="section-label">Recenzie</p>
        <h2 className="section-title">Čo hovoria naši klienti</h2>
        <GoldDivider />
      </ScrollReveal>

      <div className="testimonials__grid">
        {testimonials.map((t, i) => (
          <ScrollReveal key={t.id} direction="up" delay={i * 120}>
            <TestimonialCard
              name={t.name}
              content={t.content}
              rating={t.rating}
              createdAt={t.createdAt}
              adminReply={t.adminReply}
              adminReplyAt={t.adminReplyAt}
            />
          </ScrollReveal>
        ))}
      </div>

      <div className="testimonials__footer">
        <Link href="/sk/testimonials" className="btn-outline">
          Zobraziť všetky recenzie →
        </Link>
        <Link href="/sk/testimonials/submit" className="btn-primary">
          Zanechať recenziu
        </Link>
      </div>
    </section>
  );
}
