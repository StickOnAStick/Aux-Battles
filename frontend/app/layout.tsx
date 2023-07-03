import '../styles/dist.css';
import { Analytics } from '@vercel/analytics/react'
//Redux provider: import Providers from './providers';
//Needed for persistant redux store: import eventsource from 'eventsource';

export const metadata = {
  title: 'Aux-Battles',
  description: 'Aux-Battles the music battle game. Battle your friends for Aux, and compete by responding to unique prompts with your song choices.',
  icons: {
    rel: 'icon',
    icon: '/FinalRed.png'
  },
  other: {
    robots: "index, nofollow"
  }
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
          <Analytics />
      </body>
    </html>
  )
}