import { useState } from 'react'

function App() {
  const [comptador, setComptador] = useState(0)

  function incrementa() {
    setComptador((anterior) => anterior + 1)
  }

  function decrementar() {
    setComptador((anterior) => anterior -1)
  }

  function reiniciar() {
    setComptador(0)
  }

  //MENSAJE

  let missatge = `Encara no has començat.`
  if (comptador > 0) {
    missatge = `Vas per bon camí.`
  }else if ( comptador < 0) {
    missatge = `Compte, vas enrere!.`
  }


  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-slate-100'>
      <h1 className='text-4xl font-bold text-blue-600 mb-4'>Hola món!</h1>
      <p className='text-xl mb-2'>Has fet clic <span className='font-bold text-blue-800'>{comptador}</span> vegades.</p>
      <p className='text-lg text-gray-600 mbs-8'>{missatge}</p>
      <div className='flex gap-4'>
        <button className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer' 
        onClick={incrementa}>Incrementa</button>
        <button className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer'
        onClick={decrementar}>Decrementa</button>
        <button className='px-4 py-2 bg-gray-400 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
        onClick={reiniciar}>Reiniciar</button>

      </div>
      
    </main>
  )
}

export default App