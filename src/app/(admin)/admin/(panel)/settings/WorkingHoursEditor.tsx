'use client';

const DAYS = [
  { key: 'mon', label: 'Pondelok' },
  { key: 'tue', label: 'Utorok' },
  { key: 'wed', label: 'Streda' },
  { key: 'thu', label: 'Štvrtok' },
  { key: 'fri', label: 'Piatok' },
  { key: 'sat', label: 'Sobota' },
  { key: 'sun', label: 'Nedeľa' },
] as const;

type DayKey = (typeof DAYS)[number]['key'];
type DayHours = { open: string; close: string } | null;
export type HoursMap = Record<DayKey, DayHours>;

export const DEFAULT_HOURS: HoursMap = {
  mon: { open: '09:00', close: '18:00' },
  tue: { open: '09:00', close: '18:00' },
  wed: { open: '09:00', close: '18:00' },
  thu: { open: '09:00', close: '18:00' },
  fri: { open: '09:00', close: '18:00' },
  sat: { open: '09:00', close: '17:00' },
  sun: null,
};

interface Props {
  value: HoursMap;
  onChange: (hours: HoursMap) => void;
}

const inputStyle: React.CSSProperties = {
  background: '#0a0a0a',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#F5F0E8',
  borderRadius: '6px',
  padding: '0.3rem 0.5rem',
  fontSize: '0.875rem',
  colorScheme: 'dark',
  fontFamily: 'inherit',
};

export default function WorkingHoursEditor({ value, onChange }: Props) {
  function toggleDay(key: DayKey, enabled: boolean) {
    onChange({
      ...value,
      [key]: enabled ? { open: '09:00', close: '18:00' } : null,
    });
  }

  function updateTime(key: DayKey, field: 'open' | 'close', time: string) {
    const current = value[key];
    if (!current) return;
    onChange({ ...value, [key]: { ...current, [field]: time } });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {DAYS.map(({ key, label }) => {
        const hours = value[key];
        const isOpen = hours !== null;
        return (
          <div
            key={key}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 48px 1fr',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.75rem',
              background: '#111',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
            }}
          >
            {/* Day label */}
            <span
              style={{
                color: isOpen ? '#F5F0E8' : '#666',
                fontWeight: isOpen ? 500 : 400,
                fontSize: '0.9rem',
              }}
            >
              {label}
            </span>

            {/* Toggle */}
            <label
              style={{
                position: 'relative',
                display: 'inline-block',
                width: '40px',
                height: '22px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <input
                type="checkbox"
                checked={isOpen}
                onChange={(e) => toggleDay(key, e.target.checked)}
                style={{ display: 'none' }}
              />
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: isOpen ? '#B87333' : '#333',
                  borderRadius: '11px',
                  transition: 'background 0.2s',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: isOpen ? '21px' : '3px',
                  width: '16px',
                  height: '16px',
                  background: '#fff',
                  borderRadius: '50%',
                  transition: 'left 0.2s',
                }}
              />
            </label>

            {/* Time inputs or "Zatvorené" */}
            {isOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="time"
                  value={hours!.open}
                  onChange={(e) => updateTime(key, 'open', e.target.value)}
                  style={inputStyle}
                />
                <span style={{ color: '#666' }}>—</span>
                <input
                  type="time"
                  value={hours!.close}
                  onChange={(e) => updateTime(key, 'close', e.target.value)}
                  style={inputStyle}
                />
              </div>
            ) : (
              <span style={{ color: '#555', fontSize: '0.85rem' }}>Zatvorené</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
