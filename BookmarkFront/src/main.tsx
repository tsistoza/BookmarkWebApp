import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserProvider from './Components/UserProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </UserProvider>,
)
