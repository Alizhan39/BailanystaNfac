import { useEffect, useState } from "react"
export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light'|'dark'>(() =>
    (typeof localStorage !== 'undefined' && (localStorage.getItem('theme') as any)) || 'light'
  )
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])
  return (
    <button
      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
