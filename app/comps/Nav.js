



function Nav({session, supabase}) {
    return(
<div className='bg-[#9381ff] p-4 shadow shadow-lg'>
      <div className='flex items-center'>
        <div>
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