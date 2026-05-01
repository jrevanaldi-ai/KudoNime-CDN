import "./globals.css";

export const metadata = {
  title: "KudoNime CDN Manager",
  description: "Manual Upload Center for KudoNime",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
