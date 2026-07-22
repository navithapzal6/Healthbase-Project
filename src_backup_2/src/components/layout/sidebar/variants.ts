// src/components/layout/sidebar/variants.ts
export const sidebarVariants = {
  base: "bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300",
  expanded: "w-64",
  collapsed: "w-20",
  logo: "flex items-center gap-3 px-4 py-6 border-b border-gray-200",
  logoText: "text-xl font-bold text-gray-800",
  nav: "flex-1 overflow-y-auto py-4 px-3",
  item: {
    base: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer",
    active: "bg-blue-50 text-blue-600",
    collapsed: "justify-center",
    expanded: "justify-start",
  },
  icon: "w-5 h-5 flex-shrink-0",
  label: "text-sm font-medium truncate",
  submenu: {
    base: "ml-9 mt-1 space-y-1",
    item: "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer",
    active: "bg-blue-50 text-blue-600",
  },
  footer: "border-t border-gray-200 p-4",
  toggle:
    "w-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors",
};
