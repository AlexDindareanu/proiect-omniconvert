import { useEffect, useState } from 'react';

const API = 'http://localhost:3000';

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: number;
}

interface Booking {
  id: string;
  studentName: string;
  studentEmail: string;
  slot: { id: string };
}

const defaultForm = { date: '', startTime: '', endTime: '', maxParticipants: 4 };

export default function TutorView() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [message, setMessage] = useState('');
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const [bookingsBySlot, setBookingsBySlot] = useState<Record<string, Booking[]>>({});

  async function loadSlots() {
    const data = await fetch(`${API}/slots`).then((r) => r.json());
    setSlots(data);
  }

  useEffect(() => { loadSlots(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${API}/slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage('Sedinta creata.');
      setForm(defaultForm);
      loadSlots();
    } else {
      setMessage('Eroare la crearea sedintei.');
    }
  }

  async function handleViewBookings(slotId: string) {
    if (expandedSlot === slotId) {
      setExpandedSlot(null);
      return;
    }
    const all: Booking[] = await fetch(`${API}/bookings`).then((r) => r.json());
    const filtered = all.filter((b) => b.slot?.id === slotId);
    setBookingsBySlot((prev) => ({ ...prev, [slotId]: filtered }));
    setExpandedSlot(slotId);
  }

  async function handleDelete(id: string) {
    await fetch(`${API}/slots/${id}`, { method: 'DELETE' });
    loadSlots();
  }

  return (
    <div style={{ maxWidth: 660, margin: '0 auto', padding: '0 1rem' }}>
      <h1>Gestionare sedinte</h1>

      <h2>Creeaza sedinta</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleCreate} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          Data
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          Ora inceput
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => {
              const startTime = e.target.value;
              let endTime = '';
              if (startTime) {
                const [h, m] = startTime.split(':').map(Number);
                const end = new Date();
                end.setHours(h + 2, m, 0, 0);
                endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
              }
              setForm({ ...form, startTime, endTime });
            }}
            required
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          Ora final
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            required
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          Nr maxim elevi
          <input
            type="number"
            min={2}
            max={4}
            value={form.maxParticipants}
            onChange={(e) => setForm({ ...form, maxParticipants: Number(e.target.value) })}
            required
          />
        </label>
        <button type="submit" style={{ alignSelf: 'flex-end' }}>Creeaza</button>
      </form>

      <h2>Toate sedintele</h2>
      {slots.length === 0 && <p>Nicio sedinta.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {slots.map((slot) => (
          <li key={slot.id} style={{ border: '1px solid #ccc', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <strong>{slot.date}</strong> &nbsp; {slot.startTime} – {slot.endTime}
                <span style={{ marginLeft: '1rem', color: '#555' }}>
                  {slot.currentParticipants}/{slot.maxParticipants} elevi
                </span>
              </span>
              <span style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleViewBookings(slot.id)}>
                  {expandedSlot === slot.id ? 'Ascunde elevi' : 'Vezi elevi'}
                </button>
                <button onClick={() => handleDelete(slot.id)} style={{ color: 'red' }}>Sterge</button>
              </span>
            </div>
            {expandedSlot === slot.id && (
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #eee' }}>
                {bookingsBySlot[slot.id]?.length === 0
                  ? <p style={{ margin: 0, color: '#888' }}>Nicio înscriere.</p>
                  : <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {bookingsBySlot[slot.id]?.map((b) => (
                        <li key={b.id}>{b.studentName} — {b.studentEmail}</li>
                      ))}
                    </ul>
                }
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
