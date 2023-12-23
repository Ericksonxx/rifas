'use client'
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

//comps
import Nav from './comps/Nav'

export default function Home() {

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPA_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPA_ANON
  const supabase = createClient(supabaseUrl, supabaseKey)

    // Router instance
    const router = useRouter();


  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //get user
  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setSession(user)
  }
  useEffect(() => {
    getUser()
  }, []);

  

  //login user
  async function logIn() {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    setSession(data.user)
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
            <button onClick={() => logIn()}  className='bg-[#9381ff] mt-8 text-[#f8f7ff] w-full py-4 rounded rounded-lg shadow shadow-lg font-semibold text-lg'>Entrar</button>
            <div className='text-center mt-4'>
              <a href='/registro' className='text-center'><u>No tienes cuenta? Registrate aqui</u></a>
            </div>
          </div>
        </div>
        </div>
        :
        <div className='w-screen h-screen bg-[#f8f7ff]'>
          <Nav superbase={supabase} session={session} />
          <div className='my-8 mx-4'>
            <button onClick={() => router.push('/crear-rifa')} className='bg-[#9381ff] px-4 py-2 rounded shadow shadow-md text-[#f8f7ff] text-sm font-semibold'>+ CREAR NUEVA RIFA</button>
          </div>
      </div>
      }
    </div>
  )
}
