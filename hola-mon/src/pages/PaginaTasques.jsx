import { useState, useContext, useEffect } from 'react'
import { TasquesContext } from '../context/TasquesContext.js'
import Targeta from '../components/Targeta.jsx'
import FormulariTasca from '../components/FormulariTasca.jsx'
import LlistaTasques from '../components/LlistaTasques.jsx'
import FiltreTasques from '../components/FiltreTasques.jsx'
import Missatge from '../components/Missatge.jsx'

// LÒGICA DEL FILTRE LOCAL (es manté a localStorage)
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
  const { tasques, carregant, error, errorAccio, recarregaTasques } =
    useContext(TasquesContext)

  const [filtre, setFiltre] = useState(llegeixFiltre)

  useEffect(() => {
    try {
      localStorage.setItem(CLAU_FILTRE, JSON.stringify(filtre))
    } catch {
      // Ignora l'error si falla
    }
  }, [filtre])

  const totalTasques = tasques.length
  const tasquesPendents = tasques.filter((tasca) => !tasca.feta).length
  const tasquesFetes = tasques.filter((tasca) => tasca.feta).length

  return (
    <div className="flex flex-col items-center">
      <Targeta titol="Les meves tasques">
        {carregant && <Missatge text="Carregant tasques..." />}

        {!carregant && error && (
          <div className="flex flex-col items-center gap-3">
            <Missatge text={error} tipus="error" />
            <button
              type="button"
              onClick={recarregaTasques}
              className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
            >
              Torna a provar
            </button>
          </div>
        )}

        {!carregant && !error && (
          <>
            <FormulariTasca />

            {errorAccio && (
              <div className="mt-3">
                <Missatge text={errorAccio} tipus="error" />
              </div>
            )}

            <div className="mt-4 flex justify-center gap-4 text-sm font-medium text-slate-600">
              <span>Total: {totalTasques}</span>
              <span>|</span>
              <span>Pendents: {tasquesPendents}</span>
              <span>|</span>
              <span>Fetes: {tasquesFetes}</span>
            </div>

            <FiltreTasques filtre={filtre} onCanviaFiltre={setFiltre} />

            <LlistaTasques filtre={filtre} />
          </>
        )}
      </Targeta>
    </div>
  )
}

export default PaginaTasques