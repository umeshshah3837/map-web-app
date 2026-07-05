import { Route, Routes } from 'react-router-dom';
import { routes } from '@/routes/routes';
import './App.css';
function App() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

export default App;
