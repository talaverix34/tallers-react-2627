import { useState } from 'react'
import { TasquesContext } from './TasquesContext.js'

export default function TasquesProvider({ children }) {
  const [tasques, setTasques] = useState([])

  function afegeixTasca() {
    setTasques((anteriors) => [
      ...anteriors,
      { id: crypto.randomUUID(), text: `Tasca ${anteriors.length + 1}` },
    ])
  }

  const dadesCompartides = { tasques, afegeixTasca }

  return (
    <TasquesContext.Provider value={dadesCompartides}>
      {children}
    </TasquesContext.Provider>
  )
}
