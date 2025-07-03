import listo from '../assets/task.png'
import config from '../assets/config.png'
import logout from '../assets/logout.svg'
import { Tableros } from './TableroList';
import { useNavigate } from 'react-router-dom';
import { tokenAtom } from './store/tareasStore';
import { toast } from 'sonner';
import { useAtom } from 'jotai';

export function Logout() { 
  const [token, setToken] = useAtom(tokenAtom);
  const nav = useNavigate();

  function handleLogout()
  {
    setToken("");
    nav('/', {replace: true})
    toast.success("Exitazo!", { description: "Saliste de tu sesion." });
  }

  function handleBack()
  {
    nav('/auth', {replace: true});
  }
  
  
  return (    
    <>
      <header className="bg-[#b1e4e4]" >
        <div id="title" className="h-24 flex justify-center items-center">
          <h1 className="flex justify-center items-center text-2xl font-bold w-9/10">
            tasking.com
            <img src={listo} alt="imagen de tareas" className="h-8" />
          </h1>
        </div>
      </header>

      <section className='h-10'></section>

      <section>
        <div className=" bg-[#b1e4e4] rounded-xl mx-auto w-3/5 p-3 gap-2">
            <div className="items-center flex justify-center p-10">
                <h1 className="text-white font-bold text-5xl">Gracias por preferirnos!</h1>
            </div>

            <div className="items-center flex justify-center" >
                <button onClick={() => handleBack()} className="w-40 h-6 rounded flex justify-center items-center text-sm bg-[#f0f8ff] hover:bg-[#b1dbff] transition-colors"
                >Iniciar Sesion</button>
            </div>
        </div>
      </section>
    </>
  )
}