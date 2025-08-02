import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './utils/createTestUser.ts';
import './utils/fixUserProfile'; // Import user profile fix utilities
import './utils/clearNotifications'; // Import notification utilities

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
