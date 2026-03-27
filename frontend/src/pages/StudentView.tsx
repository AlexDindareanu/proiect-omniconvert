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

export default function StudentView() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API}/slots`)
      .then((r) => r.json())
      .then(setSlots);
  }, []);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentName, studentEmail, slotId: bookingSlotId }),
    });
    if (res.ok) {
      setMessage('Sedinta confirmata!');
      setBookingSlotId(null);
      setStudentName('');
      setStudentEmail('');
      const updated = await fetch(`${API}/slots`).then((r) => r.json());
      setSlots(updated);
    } else {
      const err = await res.json();
      setMessage(err.message ?? 'Rezervare esuata.');
    }
  }

  const available = slots.filter((s) => s.currentParticipants < s.maxParticipants);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 1rem' }}>
      <h1>Sedinte Disponibile</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {available.length === 0 && <p>Nicio sedinta disponibila.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {available.map((slot) => (
          <li key={slot.id} style={{ border: '1px solid #ccc', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
            <strong>{slot.date}</strong> &nbsp; {slot.startTime} – {slot.endTime}
            <span style={{ marginLeft: '1rem', color: '#555' }}>
              {slot.currentParticipants}/{slot.maxParticipants} elevi
            </span>
            <button
              style={{ marginLeft: '1rem' }}
              onClick={() => { setBookingSlotId(slot.id); setMessage(''); }}
            >
              Rezerva
            </button>

            {bookingSlotId === slot.id && (
              <form onSubmit={handleBook} style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  placeholder="Numele tau"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email-ul tau"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit">Confirma</button>
                  <button type="button" onClick={() => setBookingSlotId(null)}>Anuleaza</button>
                </div>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
