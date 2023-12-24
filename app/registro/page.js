'use client'

// Import statements
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { uuid } from 'uuidv4';
import { useRouter } from 'next/navigation';

// Component function
export default function App() {
  // Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPA_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPA_ANON;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // State variables
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [imageId, setImageId] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedFlag, setSelectedFlag] = useState('+34');
  const [imageUrl, setImageUrl] = useState('');

  // Router instance
  const router = useRouter();
  let storedImageUrl 

  // Local storage setup
  const defaultImageUrl = 'https://media.istockphoto.com/id/1248723171/vector/camera-photo-upload-icon-on-isolated-white-background-eps-10-vector.jpg?s=612x612&w=0&k=20&c=e-OBJ2jbB-W_vfEwNCip4PW4DqhHGXYMtC3K_mzOac0=';
  if (typeof window !== 'undefined') {
    storedImageUrl = localStorage.getItem('uploadedImage') || defaultImageUrl;
    console.log(storedImageUrl)
  }

  useState(() => {
    console.log(storedImageUrl)
  },[storedImageUrl])
  
  // Function to fetch user details
  async function getUser() {
    try {
      const user = supabase.auth.user();
      setSession(user);
    } catch (error) {
      console.error('Error fetching user:', error.message);
    }
  }

  // Fetch user details on component mount
  useEffect(() => {
    getUser();
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
          localStorage.setItem('uploadedImage', data.fullPath);
        }
        setImageId(data.id);
        setImageUrl(data.fullPath);
        console.log('FULL PATH: ', data.fullPath)
      }
    } else {
      console.error('No file selected for upload.');
    }
  };

  // Function to add user
  const addUser = async () => {
    let { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    if(error) {
      console.log(error)
    } else {
      if (typeof window !== 'undefined') {
        let { data, error } = await supabase.auth.updateUser({
          data : {
            image: localStorage.getItem('uploadedImage'),
            nombre: nombre,
            prefix: selectedFlag,
            tel: phone,
            bio: bio,
          }
        })
        router.push('/')
      }
      }
      
  };
  

  // JSX content
  return (
    <div className='w-[90%] md:w-[50%] mx-auto my-12'>
      {session == null ? (
        <div>
          <div style={{ width: '100px', height: '100px', overflow: 'hidden', borderRadius: '50%', margin: 'auto' }}>
            <img
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              src={imageUrl || storedImageUrl}
              alt='Uploaded Avatar'
            />
          </div>
          <div className='flex justify-center mt-4'>
            <label htmlFor="myImage" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full inline-block">
              {imageId ? 'Subit foto de perfil' : 'Cambiar foto'}
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
          <div className='mt-12 text-center flex justify-center'>
            <input
              onChange={(e) => setNombre(e.target.value)}
              className='border-[#9381ff] border-2 w-full px-4 py-2 text-lg rounded-xl shadow shadow-lg mt-4'
              type='text'
              placeholder='Nombre'
            />
          </div>
          <div>
            <textarea
              rows='3'
              onChange={(e) => setBio(e.target.value)}
              className='border-[#9381ff] border-2 w-full px-4 py-2 text-lg rounded-xl shadow shadow-lg mt-4'
              type='text'
              placeholder='Descripcion'
            />
          </div>
          <div className='md:flex mt-4'>
            <div className='flex border-[#9381ff] border-2 rounded rounded-xl'>
              <select
                className='boder-red-500 border-r-2 px-2 py-2'
                id='flagSelect'
                value={selectedFlag}
                onChange={(e) => setSelectedFlag(e.target.value)}
              >
                <option className='text-xl' value='🇪+34'>
                  🇪🇸
                </option>
                <option className='text-xl' value='🇬+350'>
                  🇬🇮
                </option>
              </select>
              <input
                onChange={(e) => setPhone(e.target.value)}
                placeholder='Telefono'
                className='px-4 w-full'
                type='tel'
              />
            </div>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className='mt-4 border-[#9381ff] border-2 w-full py-2 px-4 rounded rounded-lg'
              type='email'
              placeholder='Email'
            />
          </div>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className='mt-4 border-[#9381ff] border-2 w-full py-2 px-4 rounded rounded-lg'
            type='password'
            placeholder='Password'
          />
          <button
            onClick={addUser}
            className='mb-36 bg-[#9381ff] mt-8 text-[#f8f7ff] w-full py-4 rounded rounded-lg shadow shadow-lg font-semibold text-lg'
          >
            Enviar
          </button>
        </div>
      ) : (
        router.push('/')
      )}
    </div>
  );
}
