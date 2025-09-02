import { create } from 'zustand'

type State = { token: string | null; username: string | null }
type Actions = { setAuth: (t: string, u: string) => void; clear: () => void }

export const useAuth = create<State & Actions>((set) => ({
  token: typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null,
  username: typeof localStorage !== 'undefined' ? localStorage.getItem('username') : null,
  setAuth: (token, username) => {
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
    set({ token, username })
  },
  clear: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    set({ token: null, username: null })
  },
}))
