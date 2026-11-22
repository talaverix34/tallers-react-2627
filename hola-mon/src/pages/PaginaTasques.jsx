import { useState, useContext, useEffect } from 'react'
import { TasquesContext } from '../context/TasquesContext.js'
import Targeta from '../components/Targeta.jsx'
import FormulariTasca from '../components/FormulariTasca.jsx'
import LlistaTasques from '../components/LlistaTasques.jsx'
import FiltreTasques from '../components/FiltreTasques.jsx'

// LÒGICA DEL FILTRE LOCAL
const CLAU_FILTRE = 'hola-mon.filtre'
const FILTRES_VALIDS = ['totes', 'pendents', 'fetes']

function llegeixFiltre() {
  try {
    const guardat = localStorage.getItem(CLAU_FILTRE)
    if (!guardat) return 'totes'
    const valor = JSON.parse(guardat)
    return FILTRES_VALIDS.includes(valor) ? valor : 'totes'
  } catch {
    return 'totes'
  }
}

function PaginaTasques() {
  // Llegeix les tasques del Context
  const { tasques } = useContext(TasquesContext)
  
  // Estat del filtre local d'aquesta pàgina
  const [filtre, setFiltre] = useState(llegeixFiltre)

  // Guarda el filtre al LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CLAU_FILTRE, JSON.stringify(filtre))
    } catch {
      // Ignora l'error si falla
    }
  }, [filtre])

  // Càlcul de pendents i fetes
  const tasquesPendents = tasques.filter((tasca) => !tasca.feta).length
  const tasquesFetes = tasques.filter((tasca) => tasca.feta).length

  return (
    <div className="flex flex-col items-center">
      <Targeta titol="Les meves tasques">
        <FormulariTasca />

        <div className="mt-4 flex justify-center gap-4 text-sm font-medium text-slate-600">
          <span>Pendents: {tasquesPendents}</span>
          <span>|</span>
          <span>Fetes: {tasquesFetes}</span>
        </div>

        <FiltreTasques filtre={filtre} onCanviaFiltre={setFiltre} />

        <LlistaTasques filtre={filtre} />
      </Targeta>
    </div>
  )
}

export default PaginaTasques