import "./globals.css";

export const metadata = {
  title: "Insta AI | Smart Analysis",
  description: "AI-powered Instagram growth insights",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="h-screen overflow-hidden antialiased">{children}</body>
    </html>
  );
}