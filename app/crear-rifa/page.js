'use client'
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { uuid } from 'uuidv4';

//comps
import Nav from '../comps/Nav'

function CrearRifa() {

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPA_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPA_ANON
    const supabase = createClient(supabaseUrl, supabaseKey)
  
      // Router instance
      const router = useRouter();

      const [session, setSession] = useState(null);
      //fields
      const [titulo, setTitulo] = useState('')
      const [descripcion, setDescripcion] = useState('')
      const [imageId, setImageId] = useState('');
      const [imageUrl, setImageUrl] = useState('');
      let storedImageUrl

        // Local storage setup
  const defaultImageUrl = 'https://media.istockphoto.com/id/1248723171/vector/camera-photo-upload-icon-on-isolated-white-background-eps-10-vector.jpg?s=612x612&w=0&k=20&c=e-OBJ2jbB-W_vfEwNCip4PW4DqhHGXYMtC3K_mzOac0=';
  if (typeof window !== 'undefined') {
    storedImageUrl =  localStorage.getItem('uploadedFoto') 
 } else { defaultImageUrl}


  
  //get user
  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setSession(user)
  }
  useEffect(() => {
    getUser()
  }, []);


    // Function to handle image upload
    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
          const id = uuid();
          const { data, error } = await supabase.storage
            .from('avatar')
            .upload(`images/${id}`, file, {
              contentType: file.type,
            });
    
          if (error) {
            console.error('Error uploading file:', error.message);
          } else {
            if (typeof window !== 'undefined') {
                localStorage.setItem('uploadedFoto', data.fullPath);
            }
            
            setImageId(data.id);
            setImageUrl(data.fullPath);
          }
        } else {
          console.error('No file selected for upload.');
        }
      };




  if(supabase && session) {
    return (
        <div>
            <Nav supabase={supabase} session={session} />
            <div className='w-[80%] mx-auto'>
                <div className='my-6'>
                    <p className='font-semibold text-2xl text-[#9381ff]'>Nueva rifa en {session.user_metadata.nombre}</p>
                </div>
                <div className='border-2 border-[#9381ff] p-2'>
                    <input
                        onChange={(e) => setTitulo(e.target.value)}
                        className='font-semibold border-b-[#9381ff] border-b-2 w-full px-2 py-2 text-lg mt-4'
                        type='text'
                        placeholder='Titulo de la rifa'
                    />
                    <input
                        onChange={(e) => setTitulo(e.target.value)}
                        className='border-b-[#9381ff] border-b-2 w-full px-2 py-2 text-lg mt-4'
                        type='text'
                        placeholder='Fecha del sorteo (04-12-23)'
                    />
                    <textarea
                        rows='3'
                        onChange={(e) => setBio(e.target.value)}
                        className='border-[#9381ff] border-2 rounded w-full px-2 py-2 text-md mt-4'
                        type='text'
                        placeholder='Descripcion'
                    />
                    <p className='font-semibold text-xl text-[#9381ff] mt-12'>Como se elegira al ganador?</p>
                    <input
                        onChange={(e) => setTitulo(e.target.value)}
                        className='border-b-[#9381ff] border-b-2 w-full px-2 py-2 text-lg mt-4'
                        type='text'
                        placeholder='Cupon ONCE, Sorteo en directo...'
                    />
                    <div className='my-4'>
                        <p className='font-semibold text-xl text-[#9381ff] mt-12'>El Premio</p>
                        <hr />
                    </div>
                    <input
                        onChange={(e) => setTitulo(e.target.value)}
                        className='mb-4 border-b-[#9381ff] border-b-2 w-full px-2 py-2 text-lg mt-4'
                        type='text'
                        placeholder='Que se rifa?'
                    />
                    <input
                        onChange={(e) => setTitulo(e.target.value)}
                        className='mb-4 border-b-[#9381ff] border-b-2 w-full px-2 py-2 text-lg mt-4'
                        type='numerical'
                        placeholder='En cuanto esta valorado el premio?'
                    />
                    <img
                        className='border-2 rounded border-[#9381ff]'
                        style={{ margin: 'auto', width: '100%', height: '200px', objectFit: 'cover' }}
                        src={imageUrl || storedImageUrl}
                        alt='Foto Premio'
                    />
                    <label htmlFor="myImage" className="mt-4 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full inline-block">
                        Anadir foto del premio
                    </label>
                    <input
                        id="myImage"
                        onChange={(e) => handleUpload(e)}
                        type="file"
                        name="myImage"
                        accept="image/png, image/gif, image/jpeg"
                        className="hidden"
                    />
                    
                </div>
                <div className='mt-5 mb-32'>
                    <button className='mt-4 mb-36 text-center bg-[#9381ff] w-full text-[#f8f7ff] py-4 rounded shadow font-semibold text-xl'>Crear Rifa</button>
                </div>
            </div>
        </div>
    );
  } else {
    return(
        <p>Error</p>
    )
  }
}

export default CrearRifa;
