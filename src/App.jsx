import React from 'react';
import Router from './router';
import { CartProvider } from './hooks/useCart';
import './styles/global.scss';

function App() {
  return (
    <CartProvider>
      <Router />
    </CartProvider>
  );
}

export default App;

