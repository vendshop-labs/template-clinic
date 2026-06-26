import { Fragment } from 'react';
import { CONTACT, HOURS, WHATSAPP_LINKS } from '@/lib/constants';
import GoldDivider from '@/components/ui/GoldDivider';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import ScrollReveal from '@/components/ui/ScrollReveal';

// ─── Working hours types & helpers ───────────────────────────────────────
type DayHours = { open: string; close: string } | null;
type WorkingHours = Record<string, DayHours>;

const DAYS_SK: Record<string, string> = {
  mon: 'Pondelok',
  tue: 'Utorok',
  wed: 'Streda',
  thu: 'Štvrtok',
  fri: 'Piatok',
  sat: 'Sobota',
  sun: 'Nedeľa',
};
const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function formatHours(wh: WorkingHours | null | undefined): { label: string; hours: string }[] {
  if (!wh || typeof wh !== 'object') return [];

  const result: { label: string; hours: string }[] = [];
  let i = 0;

  while (i < DAY_ORDER.length) {
    const day = DAY_ORDER[i];
    const hours = wh[day];

    if (!hours) {
      result.push({ label: DAYS_SK[day] ?? day, hours: 'Zatvorené' });
      i++;
      continue;
    }

    // Find consecutive days with identical hours
    let j = i + 1;
    while (
      j < DAY_ORDER.length &&
      wh[DAY_ORDER[j]] &&
      wh[DAY_ORDER[j]]?.open === hours.open &&
      wh[DAY_ORDER[j]]?.close === hours.close
    ) j++;

    const label =
      j - i > 1
        ? `${DAYS_SK[day]} – ${DAYS_SK[DAY_ORDER[j - 1]]}`
        : DAYS_SK[day] ?? day;

    result.push({ label, hours: `${hours.open} – ${hours.close}` });
    i = j;
  }

  return result;
}

// ─── Props ────────────────────────────────────────────────────────────────
interface ContactSectionProps {
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  mapLat?: number | null;
  mapLng?: number | null;
  workingHours?: unknown;
}

export default function ContactSection({
  address,
  city,
  phone,
  email,
  mapLat,
  mapLng,
  workingHours,
}: ContactSectionProps) {
  // Contact values — DB first, constants as fallback
  const displayAddress = address ?? CONTACT.address;
  const displayCity    = city    ?? CONTACT.city;
  const displayPhone   = phone   ?? CONTACT.phone;
  const displayEmail   = email   ?? CONTACT.email;

  const phoneHref = displayPhone ? `tel:${displayPhone.replace(/\s/g, '')}` : CONTACT.phoneHref;
  const emailHref = displayEmail ? `mailto:${displayEmail}`                  : CONTACT.emailHref;

  // Map embed — construct from lat/lng if available
  const mapSrc =
    mapLat && mapLng
      ? `https://maps.google.com/maps?q=${mapLat},${mapLng}&z=15&output=embed`
      : CONTACT.mapSrc;

  // Hours — DB first, static HOURS as fallback
  const hoursData = formatHours(workingHours as WorkingHours);

  return (
    <section id="kontakt" className="contact">
      <ScrollReveal direction="up" className="section-header">
        <p className="section-label">Kontakt</p>
        <h2 className="section-title">Kde nás nájdete</h2>
        <GoldDivider />
      </ScrollReveal>

      <div className="contact-grid">
        <ScrollReveal direction="left" delay={100}>
          <div className="contact-info">
            <div>
              <p className="contact-item-label">Adresa</p>
              <p className="contact-item-value contact-item-value--pre">
                {displayCity ? `${displayAddress}\n${displayCity}` : displayAddress}
              </p>
            </div>

            <div>
              <p className="contact-item-label">Kontakt</p>
              <p className="contact-item-value">
                <a href={phoneHref} className="contact-link">{displayPhone}</a>
                <br />
                <a href={emailHref} className="contact-link">{displayEmail}</a>
              </p>
            </div>

            <div>
              <p className="contact-item-label">Otváracie hodiny</p>
              <div className="contact-hours-grid">
                {hoursData.length > 0
                  ? hoursData.map((row, idx) => (
                      <Fragment key={idx}>
                        <span className="contact-hours-day">{row.label}</span>
                        <span className="contact-hours-time"
                          style={{ fontWeight: row.hours === 'Zatvorené' ? 400 : undefined }}>
                          {row.hours}
                        </span>
                      </Fragment>
                    ))
                  : HOURS.map((row) => (
                      <Fragment key={row.day}>
                        <span className="contact-hours-day">{row.day}</span>
                        <span className="contact-hours-time">{row.time}</span>
                      </Fragment>
                    ))}
              </div>
            </div>

            <a
              href={WHATSAPP_LINKS.location}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-wa-btn"
            >
              <WhatsAppIcon size={18} />
              Napíšte nám
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={200}>
          <iframe
            src={mapSrc}
            className="contact-map"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa ${displayCity ?? 'Kate Barber Studio'}`}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
