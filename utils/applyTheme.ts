export default function applyTheme(theme?: string) {
  if (!theme) return

  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', theme)
  }

  document.documentElement.style.setProperty('--primary', theme)
  document.documentElement.style.setProperty('--ring', theme)
}