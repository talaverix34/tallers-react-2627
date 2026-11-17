import { useState } from 'react'
import Comptador from './components/Comptador.jsx'
import Targeta from './components/Targeta.jsx' 
import FormulariTasca from './components/FormulariTasca.jsx'

function App() {
  const [comptador, setComptador] = useState(0)
 //FITXA 2
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

  //FITXA 3

  const [tasques, setTasques] =useState([])

  function afegeixTasca(textRebut) {
    const novaTasca = {
      id: crypto.randomUUID(),
      text: textRebut,
      feta: false,
    }
    setTasques((anteriors) => [...anteriors, novaTasca])
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
      <Targeta titol="Les meves tasques">
        <FormulariTasca onAfegir={afegeixTasca}/>
        <ul className='w-full mt-6 space-y-2'>
          {tasques.map((tasca) => (
            <li key="{tasca.id}" className='p-3 bg-white border border-slate-200 rounded-lg shadow-sm'>
              {tasca.text}
            </li>
          ))}

        </ul>
        
      </Targeta>

    </main>
  )
}

export default App