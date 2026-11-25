import { useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { TasquesContext } from '../context/TasquesContext.js'
import Targeta from '../components/Targeta.jsx'
import Missatge from '../components/Missatge.jsx'
import FormulariEdicioTasca from '../components/FormulariEdicioTasca.jsx'

function PaginaDetallTasca() {
  const { id } = useParams()
  const {
    tasques,
    carregant,
    error,
    enviant,
    errorAccio,
    recarregaTasques,
    toggleTasca,
    eliminaTasca,
  } = useContext(TasquesContext)
  const navigate = useNavigate()

  if (carregant) {
    return (
      <div className="flex flex-col items-center mt-8">
        <Targeta titol="Detall de la tasca">
          <Missatge text="Carregant tasca..." />
        </Targeta>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 mt-8">
        <Targeta titol="Error de connexió">
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
        </Targeta>
      </div>
    )
  }

  const tasca = tasques.find((t) => t.id === id)

  if (!tasca) {
    return (
      <div className="flex flex-col items-center gap-4 mt-8">
        <Targeta titol="Tasca no trobada">
          <p className="text-slate-600 text-center mb-4">
            No s'ha trobat cap tasca amb l'identificador <strong>{id}</strong>.
          </p>
          <div className="flex justify-center">
            <Link
              to="/tasques"
              className="text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              ← Torna a la llista de tasques
            </Link>
          </div>
        </Targeta>
      </div>
    )
  }

  async function handleElimina() {
    if (!window.confirm(`Vols eliminar la tasca "${tasca.text}"?`)) return
    const ok = await eliminaTasca(tasca.id)
    if (ok) {
      navigate('/tasques')
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Targeta titol="Detall de la tasca">
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">
              Descripció
            </p>
            <p
              className={`text-lg font-medium ${
                tasca.feta ? 'line-through text-slate-400' : 'text-slate-800'
              }`}
            >
              {tasca.text}
            </p>
          </div>

          <FormulariEdicioTasca tasca={tasca} />

          <div className="flex justify-between items-center text-sm text-slate-600 px-1">
            <span>
              Estat:{' '}
              <strong
                className={tasca.feta ? 'text-green-600' : 'text-amber-600'}
              >
                {tasca.feta ? 'Feta' : 'Pendent'}
              </strong>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: {tasca.id}
            </span>
          </div>

          {errorAccio && <Missatge text={errorAccio} tipus="error" />}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              disabled={enviant}
              onClick={() => toggleTasca(tasca.id)}
              className="flex-1 py-2 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tasca.feta ? 'Marca com a pendent' : 'Marca com a feta'}
            </button>
            <button
              type="button"
              disabled={enviant}
              onClick={handleElimina}
              className="py-2 px-4 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enviant ? 'Eliminant...' : 'Elimina'}
            </button>
          </div>
        </div>
      </Targeta>

      <Link
        to="/tasques"
        className="text-blue-600 hover:text-blue-800 font-semibold underline"
      >
        ← Torna a les tasques
      </Link>
    </div>
  )
}

export default PaginaDetallTasca