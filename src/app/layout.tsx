// /**
//  * @layout RootLayout
//  * @description THE REINFORCED ROOT SHELL (STERILIZED - V4.5 - ULTIMATE SEAL)
//  * [PROTOCOL 14]: Minimalist Proxy Layout to ensure clean inheritance by localized children.
//  * Eradicated all redundant scripts and font injections to fix chunk loading schism.
//  */
// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return children;
// }

/**
 * Root Layout — Minimal Shell
 * الـ <html> و <head> بيتعملوا في [locale]/layout.tsx
 * الملف ده بس بيعدي الـ children من غير ما يضيف حاجة
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}