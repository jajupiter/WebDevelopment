import listo from '../assets/task.png'


export function Permisos() {
    return (<>
        <header className="bg-[#b1e4e4]">
            <div id="title" className="h-24 flex justify-center items-center">
                <h1 className="flex justify-center items-center text-2xl font-bold w-9/10">
                    tasking.com
                    <img src={listo} alt="imagen de tareas" className="h-8" />
                </h1>
            </div>
        </header>

        <section className='h-8'></section>

        <section>
            <div className=" bg-[#b1e4e4] rounded-xl mx-auto w-3/5 p-3 gap-2">
                <div className="items-center flex justify-center p-1">
                    <h1 className="text-white font-bold text-2xl">Permisos</h1>
                </div>

                <div className="items-center flex justify-center" >
                    <form action="">
                        <ul>
                            <li className='p-2'>
                                Permisos sobre este tablero:
                            </li>
                            <li className='p-2'>
                                Compartir con: <input type="text"/>
                            </li>
                            <li className='p-2'>
                                Dar los siguientes permisos: <input type="text" name="" id="" />
                            </li>
                            <button className='bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm flex justify-center'> Compartir </button>
                        </ul>
                    </form>
                </div>
            </div>
        </section>
    </>)
}