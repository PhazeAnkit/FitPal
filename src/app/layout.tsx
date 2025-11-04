import "./globals.css";
import { ThemeProvider } from "@/hooks/useTheme";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors">
        <ThemeProvider>
          <Navbar />
          <div className="min-h-[calc(100vh-8rem)]">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
