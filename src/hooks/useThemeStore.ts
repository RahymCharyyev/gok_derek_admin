import { create } from 'zustand';

interface ThemeStore {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  darkMode: localStorage.getItem('theme') === 'dark',
  setDarkMode: (value: boolean) =>
    set(() => {
      localStorage.setItem('theme', value ? 'dark' : 'light');
      return { darkMode: value };
    }),
  toggleDarkMode: () =>
    set((state) => {
      const newValue = !state.darkMode;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return { darkMode: newValue };
    }),
}));
