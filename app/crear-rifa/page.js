'use client'
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { uuid } from 'uuidv4';

import Link from 'next/link';
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
      const [fecha, setFecha] = useState('')
      const [precio, setPrecio] = useState('')
      const [descripcion, setDescripcion] = useState('')
      const [referencia, setReferencia] = useState('')
      const [premio, setPremio] = useState('')
      const [valor, setValor] = useState('')
      const [dbImage, setDbImage] = useState('')
      const [imageUrl, setImageUrl] = useState('');
      const [numeros, setNumeros] = useState('')
      const [screenCreada, setScreenCreada] = useState(false)
      const [newRifaId, setNewRifaId] = useState('')

      const [imageId, setImageId] = useState('');
    
      //nueva rifa
      async function nuevaRifa() {

      }







      let storedImageUrl

        // Local storage setup
  const defaultImageUrl = 'https://media.istockphoto.com/id/1248723171/vector/camera-photo-upload-icon-on-isolated-white-background-eps-10-vector.jpg?s=612x612&w=0&k=20&c=e-OBJ2jbB-W_vfEwNCip4PW4DqhHGXYMtC3K_mzOac0=';
  if (typeof window !== 'undefined') {
    storedImageUrl =  localStorage.getItem('uploadedFoto') 
    console.log()
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
            console.log('subido: ', data)
            if (typeof window !== 'undefined') {
                localStorage.setItem('uploadedFoto', `https://ujcygzxrfutcztvtxlki.supabase.co/storage/v1/object/public/avatar/${data.path}`);
            }
            
            setImageId(data.id);
            setImageUrl(`https://ujcygzxrfutcztvtxlki.supabase.co/storage/v1/object/public/avatar/${data.path}`);
            console.log('IMAGEURL: ',imageUrl)
          }
        } else {
          console.error('No file selected for upload.');
        }
      };


  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    // Format the date to "dd-mm-yyyy"
    const formattedDate = formatDate(selectedDate);
    setFecha(formattedDate);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };


      //crear rifa
      async function crearRifa() {
        if(titulo && fecha && precio && premio && referencia && numeros != '') {
            const { data, error } = await supabase
            .from('rifas')
            .insert([{ 
                titulo: titulo, 
                premio: premio,
                foto_premio: imageUrl,
                valorado: valor,
                descripcion: descripcion,
                fecha_fin: fecha,
                referencia: referencia,
                owner: session.id,
                precio: precio,
                owner_name: session.user_metadata.nombre,
                numeros: numeros

            },])
            .select()
            if(error) {
                console.log(error)
            } else {
                const domain = window.location.origin
                const id = data[0].id
                setNewRifaId(domain+'/'+id)
                setScreenCreada(true)
            }
        } else {
            alert('falta info')
        }
      }

      //copy url
      const handleCopyClick = () => {
        const string = newRifaId.toString()
          string.select();
          document.execCommand('copy');
          window.getSelection().removeAllRanges();
          alert('Text copied to clipboard!');
      };




  if(supabase && session) {
    return (
        <div>
            {screenCreada ?
                (
                    <div className='bg-[#9381ff] w-screen h-screen px-12 py-24'>
                        <div>
                            <p className='text-center mb-12 text-5xl'>✅</p>
                            <p className='text-center text-[#f8f7ff] font-semibold text-3xl mb-4'>Comparte tu rifa para que los demas puedan participar</p>
                            <p className='text-center  text-xl text-[#f8f7ff] font-light mb-12'>Copia esta URL o compartelo por redes sociales</p>
                        </div>
                        <div className='bg-gray-100 m-auto rounded shadow font-semibold text-gray-700'>
                            <p className='px-4 py-2'>{newRifaId}</p>
                            <button 
                                className='bg-green-500 w-full font-semibold text-xl py-2 rounded shadow text-[#f8f7ff]'
                                onClick={() => navigator.clipboard.writeText(newRifaId)}
                            >
                                COPIAR ENLACE
                            </button>
                        </div>
                    </div>
                )
            :
            (
                <div>
                                <Nav supabase={supabase} session={session} />
            <div className='w-[80%] mx-auto'>
                <div className='my-6'>
                    <p className='font-semibold text-2xl text-[#9381ff]'>Nueva rifa en {session.user_metadata.nombre}</p>
                </div>
                <div className=''>
                    <input
                        onChange={(e) => setTitulo(e.target.value)}
                        className='font-semibold border-b-[#9381ff] border-b-2 w-full px-2 py-2 text-lg mt-4'
                        type='text'
                        placeholder='Titulo de la rifa'
                    />
                    <div className='grid grid-cols-2 my-4'>
                        <p className=' flex items-end mb-[10px] text-[#9381ff]  text-xl'>Fecha de la rifa:</p>
                    <input
                        onChange={(e) => setFecha(e.target.value)}
                        className='w-full px-2 py-2 text-lg mt-4 text-gray-400'
                        type='date'
                        placeholder='Fecha'
                    />
                    </div>
                    <div className='grid grid-cols-2 my-4'>
                        <p className='flex items-end mb-[10px] text-[#9381ff]  text-xl'>Precio:</p>
                        <div className='relative w-full'>
                            <div className='relative w-full flex items-center'>
                                <input
                                    onChange={(e) => setPrecio(e.target.value)}
                                    className='w-full px-10 py-2 text-lg border-b-[#9381ff] border-b-2 text-[#9381ff] focus:outline-none'
                                    type='number'
                                    placeholder='0'
                                    value={precio}
                                />
                                <span className='ml-2 text-[#9381ff]'>EUR</span>
                            </div>
                        </div>
                    </div>
                    <div className='my-4'>
                        <p className='flex items-end mb-[10px] text-[#9381ff]  text-xl'>Cuantos numeros se sortean:</p>
                        <div className='relative w-full'>
                            <div className='relative w-full flex items-center'>
                                <input
                                    onChange={(e) => setNumeros(e.target.value)}
                                    className='w-full px-10 py-2 text-lg border-b-[#9381ff] border-b-2 text-[#9381ff] focus:outline-none'
                                    type='number'
                                    placeholder='0'
                                />
                            </div>
                        </div>
                    </div>
                    <textarea
                        rows='3'
                        onChange={(e) => setDescripcion(e.target.value)}
                        className='border-[#9381ff] border-2 rounded w-full px-2 py-2 text-md mt-4'
                        type='text'
                        placeholder='Descripcion'
                    />
                    <p className=' text-xl text-[#9381ff] mt-12'>Como se elegira al ganador?</p>
                    <input
                        onChange={(e) => setReferencia(e.target.value)}
                        className='border-b-[#9381ff] border-b-2 w-full px-2 pb-2 text-lg mt-4'
                        type='text'
                        placeholder='Cupon ONCE, Sorteo en directo...'
                    />

                    <input
                        onChange={(e) => setPremio(e.target.value)}
                        className='mb-4 border-b-[#9381ff] border-b-2 w-full px-2 py-2 text-lg mt-4'
                        type='text'
                        placeholder='Que se rifa?'
                    />
                    <input
                        onChange={(e) => setValor(e.target.value)}
                        className='mb-4 border-b-[#9381ff] border-b-2 w-full px-2 py-2 text-lg mt-4'
                        type='numerical'
                        placeholder='En cuanto esta valorado el premio?'
                    />
                    {imageUrl && 
                                        <img
                                         className='border-2 rounded border-[#9381ff]'
                                        style={{ margin: 'auto', width: '100%', height: '200px', objectFit: 'cover' }}
                                        src={imageUrl}
                                        alt='Foto Premio'
                                    />
                    }
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
                    <button onClick={crearRifa} className='mt-4 mb-36 text-center bg-[#9381ff] w-full text-[#f8f7ff] py-4 rounded shadow font-semibold text-xl'>Crear Rifa</button>
                </div>
            </div>
                </div>
            )
            }

        </div>
    );
  } else {
    return(
        <p>Error</p>
    )
  }
}

export default CrearRifa;
