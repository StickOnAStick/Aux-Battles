import '../styles/dist.css';
//Redux provider: import Providers from './providers';
//Needed for persistant redux store: import eventsource from 'eventsource';

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
          {children}
      </body>
    </html>
  )
}