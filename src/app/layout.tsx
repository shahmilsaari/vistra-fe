import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastContainer } from "@/components/ui/common/Toast";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Vistra",
  description: "Documents Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            <ToastContainer />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
