function Tasca({ tasca, onToggle, onElimina }) {
  return (
    <li className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm mb-2">
      <div className="flex items-center gap-3">
        {/* El checkbox avisa al componente padre cuando se hace clic */}
        <input
          type="checkbox"
          id={`tasca-${tasca.id}`}
          checked={tasca.feta}
          onChange={() => onToggle(tasca.id)}
          className="w-5 h-5 accent-cyan-500 cursor-pointer"
        />
        {/* Si esta hecha 'true'*/}
        <label
          htmlFor={`tasca-${tasca.id}`}
          className={`cursor-pointer select-none ${
            tasca.feta ? 'line-through text-slate-400' : 'text-slate-700 font-medium'
          }`}
        >
          {tasca.text}
        </label>
      </div>
      
      {/* Eliminar*/}
      <button 
        onClick={() => onElimina(tasca.id)}
        className="px-3 py-1 text-sm text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
      >
        Elimina
      </button>
    </li>
  )
}

export default Tasca