import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { ThemeProvider } from './hooks/useTheme';
import { MotionProvider } from './motion/MotionProvider';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MotionProvider>
          <App />
        </MotionProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
