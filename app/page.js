'use client'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function App() {

      // Router instance
      const router = useRouter();


  return(
    <div className='h-screen w-screen bg-[#f8f7ff] w-[80%]'>
      <div className='w-[80%] mx-auto text-center pt-16'>
        <h1 className='font-semibold text-5xl text-[#9381ff]'>Sorteo Live</h1>
        <h2 className='mt-4 font-semibold text-2xl text-gray-600 mb-12'>Organiza sorteos y rifas con tus amigos o clientes de forma facil y sencilla</h2>
        <Link href='/user'>
          <p className='mt-12 bg-[#9381ff] text-[#f8f7ff] w-full px-4 py-4 font-semibold text-xl text-center rounded shadow shadow-lg'>Entrar en tu perfil</p>
        </Link>
        <Link href='/registro'>
          <p className='mt-6 bg-[#9381ff] text-[#f8f7ff] w-full px-4 py-4 font-semibold text-xl text-center rounded shadow shadow-lg'>Registrate</p>
        </Link>
      </div>
    </div>
  )
}

export default App