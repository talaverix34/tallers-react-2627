import { useContext } from 'react'
import { Link } from 'react-router'
import { TasquesContext } from '../context/TasquesContext.js'

function Tasca({ tasca }) {
  // Leemos 'enviant' para desactivar el botón mientras hay una petición en curso
  const { toggleTasca, eliminaTasca, enviant } = useContext(TasquesContext)

  function handleElimina() {
    // Repte opcional: pedir confirmación antes de lanzar el DELETE al servidor
    if (!window.confirm(`Vols eliminar la tasca "${tasca.text}"?`)) return
    eliminaTasca(tasca.id)
  }

  return (
    <li className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm mb-2">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={`tasca-${tasca.id}`}
          checked={tasca.feta}
          disabled={enviant}
          onChange={() => toggleTasca(tasca.id)}
          className="w-5 h-5 accent-cyan-500 cursor-pointer disabled:opacity-50"
        />
        <Link
          to={`/tasques/${tasca.id}`}
          className={`hover:underline hover:text-blue-600 transition-colors ${
            tasca.feta ? 'line-through text-slate-400' : 'text-slate-700 font-medium'
          }`}
        >
          {tasca.text}
        </Link>
      </div>

      <button
        type="button"
        onClick={handleElimina}
        disabled={enviant}
        className="px-3 py-1 text-sm text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Elimina
      </button>
    </li>
  )
}

export default Tasca