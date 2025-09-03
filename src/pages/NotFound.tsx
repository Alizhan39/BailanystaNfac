import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h1>404 — Не найдено</h1>
      <p>Такой страницы нет.</p>
      <p><Link to="/">← На главную</Link></p>
    </div>
  );
}
