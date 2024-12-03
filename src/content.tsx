import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Sidebar from './components/Sidebar/Sidebar'

// Create root element
const root = document.createElement('div')
root.id = 'chrome-copilot-root'
document.body.appendChild(root)

// Render the app
ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <Sidebar />
    </React.StrictMode>
)
