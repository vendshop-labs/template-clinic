import { WHATSAPP_LINKS, CONTACT } from '@/lib/constants';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function CtaSection() {
  return (
    <section className="cta-section">
      <ScrollReveal direction="up">
        <div className="cta-inner">
          <h2 className="cta-title">Ready for a Fresh Look?</h2>
          <p className="cta-subtitle">
            Book your appointment today. Located in {CONTACT.city ?? 'the city centre'}.
          </p>
          <div className="cta-buttons">
            <a href="#booking" className="btn-primary">Book Now</a>
            <a
              href={WHATSAPP_LINKS.general}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Contact Us
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
