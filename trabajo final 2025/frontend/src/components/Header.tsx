import listo from '../assets/task.png'
import config from '../assets/config.png'
import logout from '../assets/logout.svg'
import { Tableros } from './TableroList';
import { useNavigate } from 'react-router-dom';
import { colorsAtom, tokenAtom } from './store/tareasStore';
import { toast } from 'sonner';
import { useAtom } from 'jotai';

export function Header() { 
  const [, setToken] = useAtom(tokenAtom);
  const [color] = useAtom(colorsAtom)
  const nav = useNavigate();

  function handleConfig()
  {
    nav('/settings', { replace: true })
  }

  async function handleLogout()
  {
    setToken("");
    nav('/logout', {replace: true})
    toast.success("Exitazo!", { description: "Saliste de tu sesion." });
    
  }
  
  
  return (    
    <>
      <header style={{backgroundColor: color.celeste}}>
        <div id="title" className="h-24 flex justify-center items-center">
          <h1 className="flex justify-center items-center text-2xl font-bold w-9/10">
            tasking.com
            <img src={listo} alt="imagen de tareas" className="h-8" />

          </h1>

          <button onClick={() => handleConfig()} className=' flex justify-end'>
            <img src={config} className='h-6' />
          </button>
          <button onClick={() => handleLogout()}>
            <img src={logout} className='h-6' />
          </button>
        </div>
      </header>
      <Tableros/>
    </>
  )
}