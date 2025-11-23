export const metadata = { title: "HuntTV" };

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Ex */}
        <script src="/obf.js"></script>
        {/* Ext */}
        <script src="/m.js" defer></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
