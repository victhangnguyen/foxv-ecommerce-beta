import { RouterProvider } from 'react-router-dom';
import '../bootstrap.css'
import '../main.css'

//! imp router
import router from './router';
// import logo from './logo.svg';
// import './App.css';

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
