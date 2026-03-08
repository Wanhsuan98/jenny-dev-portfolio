import { ref } from 'vue'

const isDark = ref(false)

export function useTheme() {
  const toggleDark = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const initTheme = () => {
    const userTheme = localStorage.getItem('theme')
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = userTheme === 'dark' || (!userTheme && systemDark)
    applyTheme()
  }

  return {
    isDark,
    toggleDark,
    initTheme,
  }
}
