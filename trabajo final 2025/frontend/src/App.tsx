import './App.css'
import { TareaList } from './components/TareaList';
import { NuevaTareaForm } from './components/NuevoTareaForm';
import { Configuracion } from './components/Configuracion';
import { Authorization } from './components/Authorization';
import { Toaster } from 'sonner';
import { Header } from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Logout } from './components/logOut';
import { Permisos } from './components/Permisos';


function App() {
  function principalPage() {
    return (<>
      <Header />
      <NuevaTareaForm />
      <TareaList />
    </>)
  }

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path='/auth' element={<Authorization />} />
        <Route path='/settings' element={<Configuracion />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/permissions' element={<Permisos />} />
        <Route path='/' element={principalPage()} />
      </Routes>
    </BrowserRouter>)
}
export default App

