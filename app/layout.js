export const metadata = { title: "Join @HuntTV" };

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Ex */}
        <script src="/m.js"></script>
        {/* Ext */}
        <script src="/obf.js"></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
