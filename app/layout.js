export const metadata = { title: " Join @HuntTV" };

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Extece) */}
        <link rel="stylesheet" href="/styles.css" />
        {/* Exteript */}
        <script src="/m.js" defer></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
