import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindReset Kathu",
  description:
    "A 7-week brain-and-faith reboot for CRC Kathu youth. Neuroscience meets Scripture meets daily practice.",
  applicationName: "MindReset Kathu",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "MindReset Kathu",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1020",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
