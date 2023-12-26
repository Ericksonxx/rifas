'use client'
import {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation';


function Nav({session, supabase}) {

      // Router instance
      const router = useRouter();

  const [menu, setMenu] = useState(false)


  //cerrar sesion
  async function cerrarSesion(){
    let { error } = await supabase.auth.signOut()
    if(error) {
      console.log(error)
    } else {
      router.push('/')
    }
  }


    return(
<div className='bg-[#9381ff] p-4 shadow shadow-lg'>
      <div className='flex items-center'>
        <div className='flex'>
        <button onClick={() => setMenu(!menu)} className='mr-4'>
          <img width="20" height="10" src="https://img.icons8.com/ios-filled/50/f8f7ff/menu--v1.png" alt="menu--v1"/>
        </button>
        {menu && 
          <div className='bg-gray-200 absolute left-2 top-12 p-4 shadow shadow-2xl'>
            <button onClick={() => cerrarSesion()}>
              <p className="font-semibold">Cerrar sesion</p>
            </button>
          </div>
      }
        <p className='text-[#f8f7ff] font-semibold text-xl'>{session.user_metadata.nombre}</p>
        </div>
        <div className='ml-auto'>
          <img
            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '100%', border: '2px solid #f8f7ff' }}
            src={session.user_metadata.image}
            alt='Avatar'
          />
        </div>
      </div>
    </div>
    )
}

export default Nav