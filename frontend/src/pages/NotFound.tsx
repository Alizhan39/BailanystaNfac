import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 — Страница не найдена</h1>
      <p>Упс! Такой страницы нет.</p>
      <p><Link to="/">← Вернуться на главную</Link></p>
    </div>
  );
}
