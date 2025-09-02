import { create } from 'zustand'


type State = { token: string | null; username: string | null }


type Actions = {
  setAuth: (token: string, username: string) => void
  clear: () => void
}


export const useAuth = create<State & Actions>((set) => ({
  token: localStorage.getItem('token'),
  username: localStorage.getItem('username'),
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
