export const metadata = { title: "HuntTV" };

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* External CSS (hidden content, not inline in view-source) */}
        <link rel="stylesheet" href="/styles.css" />
        {/* External DevTool blocker script */}
        <script src="/m.js" defer></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
