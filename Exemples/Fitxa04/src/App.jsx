import { useContext } from 'react'
import { TasquesContext } from './context/TasquesContext.js'

function ResumTasques() {
  const { tasques } = useContext(TasquesContext)

  return <p role="status">Total de tasques: {tasques.length}</p>
}

function LlistaTasques() {
  const { tasques, afegeixTasca } = useContext(TasquesContext)

  return (
    <section>
      <h2>LlistaTasques: un descendent que consumeix el context</h2>
      <button onClick={afegeixTasca}>Afegeix una tasca</button>
      {tasques.length === 0 ? (
        <p>Encara no hi ha tasques.</p>
      ) : (
        <ul>
          {tasques.map((tasca) => <li key={tasca.id}>{tasca.text}</li>)}
        </ul>
      )}
    </section>
  )
}

function Panell() {
  return (
    <section>
      <h2>Panell: un intermediari sense props de tasques</h2>
      <LlistaTasques />
    </section>
  )
}

export function ForaDelProvider() {
  const valor = useContext(TasquesContext)

  return (
    <aside>
      <h2>Fora del provider</h2>
      <p>Valor del context: {valor === null ? 'null' : 'hi ha un provider per sobre'}</p>
      <p>Aquest component és germà del provider, no descendent seu.</p>
    </aside>
  )
}

export default function App() {
  return (
    <main>
      <h1>El provider ofereix dades; useContext les llegeix</h1>
      <p>App és el contingut children que TasquesProvider col·loca dins del provider.</p>
      <ResumTasques />
      <Panell />
    </main>
  )
}
