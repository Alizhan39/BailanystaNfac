import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export default function RootError() {
  const err = useRouteError();
  if (isRouteErrorResponse(err)) {
    return (
      <div style={{ padding: 24 }}>
        <h1>{err.status} {err.statusText}</h1>
        <p>{err.data || "Страница не найдена или произошла ошибка."}</p>
        <p><Link to="/">← На главную</Link></p>
      </div>
    );
  }
  return (
    <div style={{ padding: 24 }}>
      <h1>Unexpected Application Error</h1>
      <p>Что-то пошло не так. Попробуйте обновить страницу.</p>
      <p><Link to="/">← На главную</Link></p>
    </div>
  );
}
