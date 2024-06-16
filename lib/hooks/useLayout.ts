// lib\hooks\useLayout.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Layout = {
  theme: string
  drawerOpen: boolean
  toggleTheme: () => void
  toggleDrawer: () => void
}

const initialState: Layout = {
  theme: 'system',
  drawerOpen: false,
  toggleTheme: () => {},
  toggleDrawer: () => {},
}

export const layoutStore = create<Layout>(
  persist(
    (set, get) => ({
      ...initialState,
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      toggleDrawer: () => set({ drawerOpen: !get().drawerOpen }),
    }),
    {
      name: 'layoutStore',
    }
  )
)

export default function useLayoutService() {
  const { theme, drawerOpen, toggleTheme, toggleDrawer } = layoutStore()

  return {
    theme,
    drawerOpen,
    toggleTheme,
    toggleDrawer,
  }
}
