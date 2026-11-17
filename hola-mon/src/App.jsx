import { useState } from 'react'
import Comptador from './components/Comptador.jsx'
import Targeta from './components/Targeta.jsx' 
import FormulariTasca from './components/FormulariTasca.jsx'
import LlistaTasques from './components/LlistaTasques.jsx'

//COMPTADOR
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

  //FITXA 3 TASQUES

  const [tasques, setTasques] =useState([])

  function afegeixTasca(textRebut) {
    const novaTasca = {
      id: crypto.randomUUID(),
      text: textRebut,
      feta: false,
    }
    setTasques((anteriors) => [...anteriors, novaTasca])
  }

  //MARCAR TASCA FETA

  function toggleTasca(id) {
    setTasques((anteriors) =>
      anteriors.map((tasca) =>
        tasca.id === id ? {...tasca, feta: !tasca.feta} : tasca
      )
    )
  }

  //ELIMINAR TASCA

  function eliminaTasca (id) {
    setTasques((anteriors) =>
      anteriors.filter((tasca) => tasca.id !== id)
    )
  }

  //COMPTADOR DE TASCQUES PENDENTS

  const tasquesPendents = tasques.filter((tasca) => !tasca.feta).length
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

        <div className='mt-4 text-center font-medium text-slate-600'>
          {tasquesPendents === 0
          ? "Totes les tasques completades!!"
          : `Et queden ${tasquesPendents} tasques pendents.`}

        </div>
        <LlistaTasques
        tasques={tasques}
        onToggle={toggleTasca}
        onElimina={eliminaTasca}
        />
        
      </Targeta>

    </main>
  )
}

export default App