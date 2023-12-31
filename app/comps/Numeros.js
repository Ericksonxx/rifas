import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

function Numeros({ rifa, supabase, setOpenNum, openNum}) {

        // Router instance
        const router = useRouter();


  const totalNumbers = 50; // Change this to the desired total number of buttons
  
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [details, setDetails] = useState(false)
  const [name, setName] = useState('')
  const [tel, setTel] = useState('')
  const [visible, setVisible] = useState('block')

  const [taken, setTaken] = useState([])

  const handleNumberClick = (number) => {
    // Check if the number is already selected
    if (selectedNumbers.includes(number)) {
      // If selected, remove it from the list (deselect)
      setSelectedNumbers((prevSelected) => prevSelected.filter((num) => num !== number));
    } else {
      // If not selected, add it to the list (select)
      setSelectedNumbers((prevSelected) => [...prevSelected, number]);
    }
  };
  

  //participacion nueva
  async function participar() {
const { data, error } = await supabase
.from('participaciones')
.insert([
  { 
    rifa: rifa[0].id, 
    nombre: name,
    tel: tel,
    numeros: selectedNumbers, 
},
])
.select()
if(error) { 
    console.log(error)
} else {
    getTaken()
    setDetails(false)
    setSelectedNumbers([]);
    console.log('added')
}

  }


//get numbers already taken
async function getTaken() {
    let { data: participaciones, error } = await supabase
      .from('participaciones')
      .select('numeros')
      .eq('rifa', rifa[0].id);
  
    if (error) {
      console.log(error);
    } else {
      const takenNumbers = participaciones.map((p) => p.numeros).flat();
      setTaken(takenNumbers);
    }
  }
  
  useEffect(() => {
    getTaken();
  }, []);
  
  useEffect(() => {
    console.log(taken);
  }, [taken]);



  //open details
  function openDetails() {
    setDetails(!details)
  }

  return (
    <div>
      <div className={`${visible} absolute h-screen w-screen bg-[#f8f7ff] top-0 left-0`}>
        <div className='w-[90%] m-auto pt-12'>
        <button onClick={() => setVisible('hidden')}>
        <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/9381ff/back.png" alt="back"/>
        </button>
          <p className='font-semibold text-3xl text-[#9381ff] mb-4 text-center'>{rifa[0].titulo}</p>
          {details && (
            <div className='h-screen bg-[#f8f7ff] w-screen absolute top-0 left-0'>
                <div className='w-[80%] m-auto pt-12'>
                <p className='font-semibold text-3xl text-[#9381ff]'>{rifa[0].titulo}</p>
                <p className='py-12 font-semibold text-2xl text-[#9381ff]'> Numeros: 
                    {selectedNumbers.map((n,i) => {
                        return(
                            <span> {n},</span>
                        )
                    })}
                </p>
                <input
                    onChange={(e) => setName(e.target.value)}
                    className='font-semibold border-b-[#9381ff] border-b-2 w-full px-2 py-2 text-lg mt-4'
                    type='text'
                    placeholder='Nombre'
                />
                <input
                    onChange={(e) => setTel(e.target.value)}
                    className='font-semibold border-b-[#9381ff] border-b-2 w-full px-2 py-2 text-lg mt-4'
                    type='text'
                    placeholder='Telefono'
                />
                <button className='mt-12 bg-[#9381ff] text-[#f8f7ff] w-full px-4 py-4 font-semibold text-xl text-center rounded shadow shadow-lg tex' onClick={() => participar()}>Reservar</button>
                </div>
                <div className='text-center'>
                  <button onClick={() => setOpenNum(false)} className='mt-8 text-center w-fit'>
                    <p className='text-[#9381ff] font-semibold'><u>Cancelar</u></p>
                  </button>
                </div>
            </div>
          )}
          {/* Create buttons dynamically */}
          <div className='border-4 rounded shadow-xl border-[#9381ff] h-[70vh] overflow-y-scroll'>
          <div className='flex flex-wrap mt-4 pb-[50px]'>
            {Array.from({ length: totalNumbers }, (_, index) => index + 1).map((number) => (
              <button
              key={number}
              className={`${
                selectedNumbers.includes(number)
                  ? 'bg-gray-400 text-gray-500 cursor-pointer'
                  : 'bg-[#9381ff] text-white cursor-pointer'
              } px-4 py-2 m-2 rounded
              ${taken.includes(number) && 'bg-red-400 text-gray-300 cursor-not-allowed '}`}
              onClick={() => handleNumberClick(number)}
              disabled={taken.includes(number)}
            >
              {number}
            </button>
            
          ))}
          {selectedNumbers.length > 0 && (
            <div>
              {!details && 
                <div className='w-full mt-6 fixed bottom-0 left-0'>
                  <button className='bg-[#9381ff] text-[#f8f7ff] w-full px-4 py-6 font-semibold text-xl text-center shadow shadow-lg tex' onClick={() => openDetails()}>
                    Reservar
                  </button>
                </div>
              }
            </div>
          )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Numeros;
