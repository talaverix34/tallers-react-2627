import Boto from './Boto.jsx'
import Missatge from './Missatge.jsx'

function Comptador({ valor, missatge, tipus, pas = 1, onCanvia, onReinicia }) {
  
  const accions = [
    { id: 'incrementa', text: 'Incrementa', variant: 'primari' },
    { id: 'decrementa', text: 'Decrementa', variant: 'secundari' },
    { id: 'reinicia', text: 'Reinicia', variant: 'perill' },
  ]

  function executaAccio(id) {
    if (id === 'incrementa') onCanvia(pas)
    if (id === 'decrementa') onCanvia(-pas)
    if (id === 'reinicia') onReinicia()
  }

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-xl mb-4">
        Has fet clic <span className="font-bold text-blue-800">{valor}</span> vegades.
      </p>
      
      <Missatge text={missatge} tipus={tipus} />
      
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        
        {accions.map(({ id, text, variant }) => (
          <Boto 
            key={id} 
            variant={variant} 
            className="w-full sm:w-auto" 
            onClick={() => executaAccio(id)}
            disabled={id === 'reinicia' ? valor === 0 : false}
          >
            {text}
          </Boto>
        ))}

      </div>
    </div>
  )
}

export default Comptador