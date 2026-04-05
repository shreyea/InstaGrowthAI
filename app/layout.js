import "./globals.css";

export const metadata = {
  title: "Insta AI | Smart Analysis",
  description: "AI-powered Instagram growth insights",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden antialiased">{children}</body>
    </html>
  );
}