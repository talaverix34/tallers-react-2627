import { useState } from 'react'
import Comptador from './components/Comptador.jsx'
import Targeta from './components/Targeta.jsx' // <-- 1. Importamos la Targeta

function App() {
  const [comptador, setComptador] = useState(0)

  function canvia(delta) {
    setComptador((anterior) => anterior + delta)
  }

  function reiniciar() {
    setComptador(0)
  }

  let missatge = 'Encara no has començat.'
  let tipus = 'info'

  if (comptador > 0) {
    missatge = 'Vas per bon camí.'
    tipus = 'exit'
  } else if (comptador < 0) {
    missatge = 'Compte, vas enrere!.'
    tipus = 'error'
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <Targeta titol="El meu Comptador">
        <Comptador 
          valor={comptador} 
          missatge={missatge}
          pas={1} 
          onCanvia={canvia} 
          onReinicia={reiniciar} 
        />
      </Targeta>

    </main>
  )
}

export default App