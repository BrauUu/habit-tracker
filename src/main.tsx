import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import toast, { resolveValue, Toaster } from 'react-hot-toast'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position={window.screen.width >= 1024 ? "bottom-right" : 'top-right'}
    >
      {
        (t) => (
          <div
            onClick={() => toast.dismiss(t.id)}
            style={{
              backgroundColor: 'var(--color-primary-600)',
              color: 'var(--color-secondary-100)',
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              maxWidth: '350px',
              opacity: t.visible ? 1 : 0,
              transition: 'opacity 300ms ease-in-out',
            }}
          >
            {t.icon && <span style={{ fontSize: '20px' }}>{t.icon}</span>}
            <span style={{ flex: 1 }}>{resolveValue(t.message, t)}</span>
          </div>
        )}
    </Toaster>
  </StrictMode >,
)
