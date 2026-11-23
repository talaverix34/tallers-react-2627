import Targeta from '../components/Targeta.jsx'
import GosAleatori from '../components/api/GosAleatori.jsx'
import LlistaPublicacions from '../components/api/LlistaPublicacions.jsx'
import LlistaPersonatges from '../components/api/LlistaPersonatges.jsx'

function PaginaDescobreix() {
  return (
    <div className="flex flex-col gap-6">
      <Targeta titol="Un gos aleatori">
        <GosAleatori />
      </Targeta>

      <Targeta titol="Publicacions">
        <LlistaPublicacions/>
      </Targeta>

      <Targeta titol="Personatges de Rick i Morty">
        <LlistaPersonatges />
      </Targeta>
      
    </div>
  )
}

export default PaginaDescobreix