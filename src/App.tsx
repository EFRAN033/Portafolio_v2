// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tu página de inicio
import HomePage from './app/page.tsx'; // <-- ¡Quita la carpeta extra!

// Si ya no necesitas App.css porque usas Tailwind en index.css, puedes quitar esta línea
// import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Define la ruta para tu página de inicio */}
        <Route path="/" element={<HomePage />} />
        {/* Aquí es donde añadirás más rutas para AboutPage, ProjectsPage, etc., más adelante */}
      </Routes>
    </Router>
  );
};

export default App;