import { useState, useContext } from 'react'
import { TasquesContext } from './context/TasquesContext.js'
import Comptador from './components/Comptador.jsx'
import Targeta from './components/Targeta.jsx'
import FormulariTasca from './components/FormulariTasca.jsx'
import LlistaTasques from './components/LlistaTasques.jsx'
import FiltreTasques from './components/FiltreTasques.jsx'

function App() {
  // COMPTADOR
  const [comptador, setComptador] = useState(0)
  
  // FITXA 2
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

  // FITXA 3 i 4: TASQUES AMB CONTEXT
  const { tasques } = useContext(TasquesContext)

  // ESTAT DEL FILTRE (Això és el que faltava)
  const [filtre, setFiltre] = useState('totes')

  // COMPTADORS DE TASQUES PENDENTS I FETES
  const tasquesPendents = tasques.filter((tasca) => !tasca.feta).length
  const tasquesFetes = tasques.filter((tasca) => tasca.feta).length

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
        <FormulariTasca />

        <div className='mt-4 flex justify-center gap-4 text-sm font-medium text-slate-600'>
          <span>Pendents: {tasquesPendents}</span>
          <span>|</span>
          <span>Fetes: {tasquesFetes}</span>
        </div>

        <FiltreTasques filtre={filtre} onCanviaFiltre={setFiltre} />

        <LlistaTasques filtre={filtre} />
      </Targeta>
    </main>
  )
}

export default App