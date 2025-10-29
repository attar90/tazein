import './globals.css'

export const metadata = {
  title: 'Tazein Decor',
  description: 'پنل مدیریت تزئین دکور',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}