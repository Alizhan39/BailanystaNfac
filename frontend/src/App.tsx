import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from './store/auth'


export default function App() {
  const { token, username, clear } = useAuth()
  const nav = useNavigate()
  return (
   <div className="min-h-screen bg-gray-50 text-gray-900">
    <nav className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
     <div className="mx-auto max-w-3xl flex items-center justify-between p-3">
      <Link to="/" className="font-bold">Bailanysta</Link>
      <div className="flex gap-3 items-center">
       <Link to="/">Feed</Link>
       <Link to="/profile">Profile</Link>
       {token ? (
        <button className="text-sm text-red-600" onClick={() => { clear(); nav('/') }}>Logout</button>
       ) : null}
       {username ? <span className="text-sm opacity-70">@{username}</span> : null}
      </div>
     </div>
    </nav>
    <main className="mx-auto max-w-3xl p-4">
     <Outlet />
    </main>
   </div>
  )
}
