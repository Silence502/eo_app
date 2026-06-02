import { ref } from "vue";

const isDark = ref(
  typeof document !== "undefined" &&
    (document.documentElement.classList.contains("eo-dark") ||
      localStorage.getItem("theme") === "dark"),
);

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value;
    if (isDark.value) {
      document.documentElement.classList.add("eo-dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("eo-dark");
      localStorage.setItem("theme", "light");
    }
  }

  return { isDark, toggleTheme };
}
