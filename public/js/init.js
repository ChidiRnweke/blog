
function initiateLocalStorage() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        localStorage.setItem("theme", "dark");
    }
    else {
        localStorage.setItem("theme", "light")
    }
}
function initializeDarkMode() {
    const noExistingTheme = localStorage.getItem('theme');

    if (!noExistingTheme) {
        initiateLocalStorage();
    }

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === "dark") {
        document.documentElement.classList.add("dark-theme");
    } else {
        document.documentElement.classList.remove("dark-theme");
    }
}

initializeDarkMode()