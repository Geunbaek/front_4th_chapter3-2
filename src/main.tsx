import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';

async function prepare() {
  if (import.meta.env.MODE === 'production') return;
  const { setupWorker } = await import('msw/browser');
  const { handlers } = await import('./__mocks__/handlers.ts');
  const worker = setupWorker(...handlers);
  return worker.start();
}

prepare().then(() =>
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  )
);
