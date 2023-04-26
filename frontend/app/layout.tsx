import '../styles/dist.css';
import Providers from './providers'; //Redux provider
import eventsource from 'eventsource';

export const metadata = {
  title: 'Aux-Battles',
  description: 'Prompt based music game',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en" data-theme="mytheme">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}