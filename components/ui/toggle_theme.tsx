import { useTheme } from "@/components/theme-context"

export const ToggleTheme = () => {

    const { theme, toggleTheme } = useTheme()

    const handleThemeChange = () => {
        toggleTheme()
        document.documentElement.classList.toggle(theme)
    }

    return (
        <div className="flex items-center space-x-2">
        <button
            className="w-10 h-6 flex items-start justify-end dark:justify-start transition-all duration-100 bg-gray-300 dark:bg-gray-700 rounded-full p-1"
            onClick={handleThemeChange}
        >
            <div className="w-4 h-4 bg-black dark:bg-white rounded-full"></div>
        </button>
        </div>
    )
}