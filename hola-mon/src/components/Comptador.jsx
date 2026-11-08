function Comptador({ valor, missatge, pas = 1, onCanvia, onReinicia }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xl mb-2">
        Has fet clic <span className="font-bold text-blue-800">{valor}</span> vegades.
      </p>
      <p className="text-lg text-gray-600 mb-8">{missatge}</p>
      
      <div className="flex gap-4">
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer" 
          onClick={() => onCanvia(pas)}>
          Incrementa
        </button>
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer" 
          onClick={() => onCanvia(-pas)}>
          Decrementa
        </button>
        <button 
          className="px-4 py-2 bg-gray-400 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={onReinicia} 
          disabled={valor === 0}>
          Reiniciar
        </button>
      </div>
    </div>
  )
}

export default Comptador