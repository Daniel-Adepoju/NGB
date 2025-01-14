import './styles/css/style.css'

import ReactQueryProvider from './utils/reactQueryProvider'
import AuthProvider from './utils/sessionProvider'
import Nav from './components/Nav'
import User from './utils/user'
import Main from './components/Main'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
export const metadata = {
  title: "NGB",
  description: "A hub for Nigerian pop culture enthusiats",
};

export default function RootLayout({children}) {
  
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <User>
            <Nav/>
            <Main>
              <ReactQueryDevtools />
          {children}
            </Main>
              
              </User>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
