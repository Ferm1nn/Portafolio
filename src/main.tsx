import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/tokens/tokens.css';
import './styles/style.css';
import './index.css';
import { ThemeProvider } from './hooks/useTheme';
import { ResponsiveProvider } from './context/ResponsiveContext';
import { MotionProvider } from './motion/MotionProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <ResponsiveProvider>
            <MotionProvider>
              <App />
            </MotionProvider>
          </ResponsiveProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
