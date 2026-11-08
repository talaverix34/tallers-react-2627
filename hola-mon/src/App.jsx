import { useState } from 'react'
import Comptador from './components/Comptador.jsx'

function App() {
  const [comptador, setComptador] = useState(0)

  function canvia(delta) {
    setComptador((anterior) => anterior + delta)
  }

  function reiniciar() {
    setComptador(0)
  }

  let missatge = 'Encara no has començat.'
  if (comptador > 0) {
    missatge = 'Vas per bon camí.'
  } else if (comptador < 0) {
    missatge = 'Compte, vas enrere!.'
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Hola món!</h1>
      
      <Comptador 
        valor={comptador} 
        missatge={missatge}
        pas={1} 
        onCanvia={canvia} 
        onReinicia={reiniciar} 
      />
    </main>
  )
}

export default App