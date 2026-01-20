import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// 1. IMPORT THIS
import { BrowserRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. WRAP EVERYTHING INSIDE BROWSERROUTER */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)