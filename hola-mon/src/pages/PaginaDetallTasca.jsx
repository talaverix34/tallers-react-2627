import { useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { TasquesContext } from '../context/TasquesContext.js'
import Targeta from '../components/Targeta.jsx'

function PaginaDetallTasca() {
  const { id } = useParams()
  const { tasques, toggleTasca, eliminaTasca } = useContext(TasquesContext)
  const navigate = useNavigate()

  const tasca = tasques.find((t) => t.id === id)

  if (!tasca) {
    return (
      <div className="flex flex-col items-center gap-4 mt-8">
        <Targeta titol="Tasca no trobada">
          <p className="text-slate-600 text-center mb-4">
            No s'ha trobat cap tasca amb l'identificador <strong>{id}</strong>.
          </p>
          <div className="flex justify-center">
            <Link to="/tasques" className="text-blue-600 hover:text-blue-800 font-semibold underline">
              ← Torna a la llista de tasques
            </Link>
          </div>
        </Targeta>
      </div>
    )
  }

  function handleElimina() {
    eliminaTasca(tasca.id)
    navigate('/tasques')
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Targeta titol="Detall de la tasca">
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Descripció</p>
            <p className={`text-lg font-medium ${tasca.feta ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {tasca.text}
            </p>
          </div>

          <div className="flex justify-between items-center text-sm text-slate-600 px-1">
            <span>
              Estat:{' '}
              <strong className={tasca.feta ? 'text-green-600' : 'text-amber-600'}>
                {tasca.feta ? 'Feta' : 'Pendent'}
              </strong>
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {tasca.id.slice(0, 8)}...</span>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => toggleTasca(tasca.id)}
              className="flex-1 py-2 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
            >
              {tasca.feta ? 'Marca com a pendent' : 'Marca com a feta'}
            </button>
            <button
              type="button"
              onClick={handleElimina}
              className="py-2 px-4 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition cursor-pointer"
            >
              Elimina
            </button>
          </div>
        </div>
      </Targeta>

      <Link to="/tasques" className="text-blue-600 hover:text-blue-800 font-semibold underline">
        ← Torna a les tasques
      </Link>
    </div>
  )
}

export default PaginaDetallTasca