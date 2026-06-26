'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { SERVICE_OPTIONS, BARBERS, WHATSAPP_NUMBER } from '@/lib/constants';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import GoldDivider from '@/components/ui/GoldDivider';
import DateTimePicker from '@/components/ui/DateTimePicker';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function BookingSection() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots,  setBookedSlots]  = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [submitError,  setSubmitError]  = useState('');

  const currentDateRef = useRef<string>(new Date().toISOString().split('T')[0]);

  const fetchSlots = useCallback(async (date: string) => {
    currentDateRef.current = date;
    setBookedSlots([]);
    setLoadingSlots(true);
    try {
      const res  = await fetch(`/api/availability?date=${date}`);
      const data = (await res.json()) as { slots: { time: string; available: boolean }[] };
      const booked = (data.slots ?? []).filter((s) => !s.available).map((s) => s.time);
      setBookedSlots(booked);
    } catch {
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    void fetchSlots(today.toISOString().split('T')[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDayChange = useCallback((date: string) => {
    setSelectedTime('');
    void fetchSlots(date);
  }, [fetchSlots]);

  const handleBarberChange = useCallback(() => {
    if (currentDateRef.current) void fetchSlots(currentDateRef.current);
  }, [fetchSlots]);

  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSubmitError('');
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name    = String(data.get('name')    ?? '').trim();
    const phone   = String(data.get('phone')   ?? '').trim();
    const service = String(data.get('service') ?? '').trim();
    const barber  = String(data.get('barber')  ?? '').trim();
    const note    = String(data.get('note')    ?? '').trim();

    if (!selectedDate || !selectedTime) {
      setSubmitError('Please select a date and time.');
      return;
    }
    if (!name || !phone) {
      setSubmitError('Please fill in your name and phone number.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName:  name,
          clientPhone: phone,
          date:        selectedDate,
          time:        selectedTime,
          notes:       note || null,
        }),
      });

      if (res.status === 409) {
        await fetchSlots(selectedDate);
        setSelectedTime('');
        setSubmitError('This slot was just taken. Please choose another time.');
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        setSubmitError('Error saving appointment. Please try again.');
        setSubmitting(false);
        return;
      }

      setBookedSlots((prev) => [...prev, selectedTime]);

      const lines = [
        `📅 *Appointment — DentCare Clinic*`,
        `━━━━━━━━━━━━━━━━━━`,
        `👤 ${name}  📞 ${phone}`,
        service ? `🦷 ${service}` : '',
        barber  ? `👨‍⚕️ ${barber}` : '',
        `📆 ${selectedDate}  🕐 ${selectedTime}`,
        note    ? `💬 ${note}` : '',
        `━━━━━━━━━━━━━━━━━━`,
      ].filter(Boolean).join('\n');

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`,
        '_blank',
        'noopener,noreferrer',
      );

      form.reset();
      setSelectedDate('');
      setSelectedTime('');
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="rezervacia" className="booking">
      <ScrollReveal direction="up" className="section-header">
        <p className="section-label">Booking</p>
        <h2 className="section-title">Schedule Your Appointment</h2>
        <GoldDivider />
        <p className="section-subtitle">
          Fill in the form — we&apos;ll save your appointment and open WhatsApp for confirmation.
        </p>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={200}>
        <div className="booking__container">
          <form onSubmit={handleSubmit} className="booking__form">

            <div className="booking__form-row">
              <div>
                <label className="booking__label">Service</label>
                <select name="service" required className="booking__select">
                  <option value="">Select service...</option>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="booking__label">Doctor</label>
                <select
                  name="barber"
                  className="booking__select"
                  onChange={handleBarberChange}
                >
                  <option value="">No preference</option>
                  {BARBERS.map((barber) => (
                    <option key={barber} value={barber}>{barber}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="booking__label">Select Date &amp; Time</label>
              <div className="booking__picker-wrap">
                <DateTimePicker
                  onSelect={handleDateTimeSelect}
                  onDayChange={handleDayChange}
                  bookedSlots={bookedSlots}
                  loading={loadingSlots}
                />
              </div>
            </div>

            <div className="booking__form-row">
              <div>
                <label className="booking__label">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  className="booking__input"
                />
              </div>
              <div>
                <label className="booking__label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+421 9XX XXX XXX"
                  required
                  className="booking__input"
                />
              </div>
            </div>

            <div>
              <label className="booking__label">Notes (optional)</label>
              <textarea
                name="note"
                placeholder="Special requests or notes..."
                className="booking__textarea"
              />
            </div>

            {submitError && (
              <p style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                ⚠️ {submitError}
              </p>
            )}

            <div className="booking__actions">
              <button
                type="submit"
                className="booking__btn-wa booking__btn-full"
                disabled={submitting || loadingSlots}
              >
                <WhatsAppIcon size={18} />
                {submitting ? 'Saving...' : 'Send via WhatsApp'}
              </button>
            </div>
          </form>

          <p className="booking__note">
            Appointment will be saved to the system. WhatsApp will open for confirmation. We respond within 30 minutes.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
