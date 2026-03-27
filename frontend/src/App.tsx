import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import StudentView from './pages/StudentView';
import TutorView from './pages/TutorView';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <Link to="/">Rezerva sedinta</Link>
        <Link to="/admin">Gestionare sedinte</Link>
      </nav>
      <Routes>
        <Route path="/" element={<StudentView />} />
        <Route path="/admin" element={<TutorView />} />
      </Routes>
    </BrowserRouter>
  );
}
