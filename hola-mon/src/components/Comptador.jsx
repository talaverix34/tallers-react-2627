import Boto from './Boto.jsx'

function Comptador({ valor, missatge, pas = 1, onCanvia, onReinicia }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xl mb-2">
        Has fet clic <span className="font-bold text-blue-800">{valor}</span> vegades.
      </p>
      <p className="text-lg text-gray-600 mb-8">{missatge}</p>
      
      {/* Añadimos flex-col y sm:flex-row para que se apilen en móvil */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none px-4 sm:px-0">
        
        <Boto variant="primari" className="w-full sm:w-auto" onClick={() => onCanvia(pas)}>
          Incrementa
        </Boto>
        
        <Boto variant="secundari" className="w-full sm:w-auto" onClick={() => onCanvia(-pas)}>
          Decrementa
        </Boto>
        
        <Boto variant="perill" className="w-full sm:w-auto" onClick={onReinicia} disabled={valor === 0}>
          Reiniciar
        </Boto>
      </div>
    </div>
  )
}

export default Comptador