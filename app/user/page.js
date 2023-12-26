'use client'
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
//comps
import Nav from '../comps/Nav'

export default function Home() {

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPA_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPA_ANON
  const supabase = createClient(supabaseUrl, supabaseKey)

    // Router instance
    const router = useRouter();


  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rifas, setRifas] = useState()
  const [errorLogin, setErrorLogin] = useState(false)
  const [deleteModal, setDeleteModal] = useState('hidden')

  //get user
  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setSession(user)
  }
  useEffect(() => {
    getUser()
  }, []);


  //get rifas
  async function getRifas() {
    let { data: rifas, error } = await supabase
    .from('rifas')
    .select('*')
    if(error) {
      console.log(error)
    } else {
      setRifas(rifas)
    }
  }
  useEffect(() => {
    getRifas()
  },[])


  

  //login user
  async function logIn() {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    if(error) {
        setErrorLogin(true)
    } else {
        setSession(data.user)
    }
  }

  
  return (
    <div>
      {!session ? 
          <div className='w-screen h-screen bg-[#f8f7ff]'>
          <div className="md:w-[50%] mx-auto">
          <h1 className='text-center pt-12 text-[#9381ff] font-semibold text-3xl'>Entrar como organizador</h1>
          <div className='mt-12 w-[80%] mx-auto text-[#9381ff] '>
            <input onChange={(e) => setEmail(e.target.value)} className='border-[#9381ff] border-2 w-full px-4 py-2 text-lg rounded-xl shadow shadow-lg' type='email' placeholder='Usuario Email' />
            <input onChange={(e) => setPassword(e.target.value)} className='border-[#9381ff] border-2 w-full px-4 py-2 text-lg rounded-xl shadow shadow-lg mt-4' type='password' placeholder='Usuario Email' />
            {errorLogin &&
                <div className='bg-red-400 px-4 py-2 rounded mt-4'>
                    <p className='text-center font-semibold text-gray-100'>Email o contrasena incorreectos, vuelve a intentarlo</p>
                </div>
            }
            <button onClick={() => logIn()}  className='bg-[#9381ff] mt-8 text-[#f8f7ff] w-full py-4 rounded rounded-lg shadow shadow-lg font-semibold text-lg'>Entrar</button>
            <div className='text-center mt-4'>
              <a href='/registro' className='text-center'><u>No tienes cuenta? Registrate aqui</u></a>
            </div>
          </div>
        </div>
        </div>
        :
        <div className='w-screen h-screen bg-[#f8f7ff]'>
          <Nav supabase={supabase} session={session} />
          <div className='my-8 mx-4'>
            <button onClick={() => router.push('/crear-rifa')} className='bg-[#9381ff] px-4 py-2 rounded shadow shadow-md text-[#f8f7ff] text-sm font-semibold'>+ CREAR NUEVA RIFA</button>
          </div>
          <div>
            {rifas &&
              <div className=''>
                  {rifas.map((rifa,i) => {
                      //delete
                      async function deleteRifa() {
                          const { error } = await supabase
                          .from('rifas')
                          .delete()
                          .eq('id', rifa.id)
                          if(error) {
                              console.log(error)
                          } else {
                            getRifas()
                            return
                          }
                        }

                    return(
                      <div key={i} className='my-4 border-[#9381ff] border-2 w-[80%] m-auto pt-4 rounded shadow shadow-xl'>
                          <Link key={rifa.id} href="[rifaId]" as={`${rifa.id}` }>
                              <p className='px-2 text-[#9381ff] font-semibold text-xl'>{rifa.titulo}</p>
                              <img className='px-2 my-2' src={rifa.foto_premio} /> 
                          </Link>
                          <div className={`${deleteModal} w-screen h-screen bg-[#f8f7ff] bg-opacity-80 absolute top-0 left-0`}>
                              <div className='fixed bg-[#9381ff] py-4 px-4 rounded shadow shadow-xl w-[90%] left-[5%] top-[30%]'>
                                <p className='text-[#f8f7ff] font-semibold mb-6'>Confirma que quieres eliminar para siempre la rifa <u>{rifa.titulo}</u></p>
                                <div className='grid grid-cols-2 gap-2'>
                                  <button onClick={() => setDeleteModal('hidden')} className='border-[#f8f7ff] border-2 text-[#f8f7ff] py-2 rounded font-semibold'>Cancelar</button>
                                  <button onClick={() => deleteRifa()} className='text-[#9381ff] bg-[#f8f7ff] py-2 rounded font-semibold'>Delete</button>
                                </div>
                              </div>
                            </div>
                          <div className='bg-[#9381ff] shadow py-2 py-2 rounded flex justify-end'>
                            <button onClick={() => setDeleteModal('block')}>
                              <img width="18" height="18" src="https://img.icons8.com/material-rounded/24/f8f7ff/filled-trash.png" alt="filled-trash"/>
                            </button>
                          </div>
                      </div>
                    )
                  })}
              </div>
            }
          </div>
      </div>
      }
    </div>
  )
}
