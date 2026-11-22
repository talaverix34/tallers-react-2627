import { useState } from 'react'
import { Link } from 'react-router'
import Comptador from '../components/Comptador.jsx'
import Targeta from '../components/Targeta.jsx'

function PaginaInici() {
  const [comptador, setComptador] = useState(0)

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

  return (
    <div className="flex flex-col items-center gap-8">
      <Targeta titol="El meu Comptador">
        <Comptador
          valor={comptador}
          missatge={missatge}
          tipus={tipus}
          pas={1}
          onCanvia={canvia}
          onReinicia={reiniciar}
        />
      </Targeta>

      <Link to="/tasques" className="text-blue-600 hover:text-blue-800 font-semibold underline decoration-2 underline-offset-4">
        Ves a les tasques →
      </Link>
    </div>
  )
}

export default PaginaInici