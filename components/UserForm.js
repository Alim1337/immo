import { useState } from 'react'
function UserForm({ onSubmit }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
  
    function handleSubmit(event) {
      event.preventDefault();
      onSubmit(name, email);
    }
  
    return (
      <div className='max-w-md mx-auto px-6 py-4'>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='name' className='block text-gray-700 font-bold mb-2'>
            Name:
          </label>
          <input
            type='text'
            id='name'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='email' className='block text-gray-700 font-bold mb-2'>
            Email:
          </label>
          <input
            type='text'
            id='email'
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
             leading-tight focus:outline-none focus:shadow-outline'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className='flex justify-center'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 
            px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
    
    )
  }
  

export default UserForm