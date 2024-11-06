// index.tsx or App.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './Pages/AñadirProducto/CardContext';  // Make sure this path is correct
import { UserProvider } from './Pages/PaginaPrincipal/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <CartProvider>  {/* Wrap with CartProvider */}
    <UserProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </UserProvider>
  </CartProvider>
);
