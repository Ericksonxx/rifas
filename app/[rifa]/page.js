'use client'
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
//comps
import Numeros from '../comps/Numeros'


function Rifa({params}) {

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPA_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPA_ANON
  const supabase = createClient(supabaseUrl, supabaseKey)

  const [session, setSession] = useState()
  const [rifa, setRifa] = useState()
  const [openNum, setOpenNum] = useState(false)
  const [view, setView] = useState('hidden')

  //view
  useEffect(() => {
    if(openNum == true){
      setView('hidden')
    }
    if(openNum == false) {
      setView('block')
    }
  },[openNum])

    //get user
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setSession(user)
    }
    useEffect(() => {
      getUser()
    }, []);


    //get rifa
    async function getRifa() {
      let { data: rifas, error } = await supabase
      .from('rifas')
      .select("*")
      .eq('id', params.rifa)
      if(error) {
        console.log(error)
      } else {
        setRifa(rifas)
      }
    }
    useEffect(() => {
      getRifa()
    },[])



  return (
    <div className='h-screen w-screen bg-[#f8f7ff]'>
      <div className={`w-[80%] m-auto pt-12`}>

        {!openNum ? (
          <div>

          </div>
        ) : (
          <div>
            <Numeros rifa={rifa} supabase={supabase} />
          </div>
        )}
        
      {rifa && 
        <div>
          <p className='font-semibold text-3xl text-[#9381ff]'>{rifa[0].titulo}</p>
          <p className='font-semibold text-xl text-[#9381ff]'>{rifa[0].owner_name}</p>
          <div className='grid grid-cols-2 my-8'>
          <div className='flex'>
          <img width="20" height="10" src="https://img.icons8.com/ios/9381ff/50/calendar.png" alt="calendar"/>
              <p className='pl-2'>{rifa[0].fecha_fin}</p>
            </div>
          <div className='flex'>
              <img width="15" height="15" src="https://img.icons8.com/ios/9381ff/50/coins--v1.png" alt="coins--v1"/>
              <p className='pl-2'>{rifa[0].precio}EUR</p>
          </div>
          
          </div>

          <div className='w-[80%] m-auto pt-6'>
            <img className='w-full h-full rounded shadow shadow-xl' src={rifa[0].foto_premio} />
            <div className='mt-8'>
              <p className='font-semibold text-xl text-[#9381ff]'>{rifa[0].premio} valorado en {rifa[0].valorado} euros</p>
              <p className='pb-12'>{rifa[0].descripcion}</p>
            </div>
            <div className='mt-6'>
              {rifa[0].finalizado ? (
                <div>
                  <button className='bg-[#9381ff] font-semibold text-[#f8f7ff] text-center px-4 py-4 w-full rounded shadow shadow-lg'>
                    La rifa ha finalizado
                  </button>
                </div>
              ) : (
                <div>
                  <button onClick={() => setOpenNum(!openNum)} className='bg-[#9381ff] font-semibold text-[#f8f7ff] text-center px-4 py-4 w-full rounded shadow shadow-lg'>
                    Participar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      }
      </div>
      </div>
  );
}

export default Rifa;
