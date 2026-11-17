import { useState } from 'react'
import { TasquesContext } from './TasquesContext'

function TasquesProvider({ children }) {
  const [tasques, setTasques] = useState([])

  function afegeixTasca(text) {
    const novaTasca = {
      id: crypto.randomUUID(),
      text,
      feta: false,
    }

    setTasques((anteriors) => [...anteriors, novaTasca])
  }

  function toggleTasca(id) {
    setTasques((anteriors) =>
      anteriors.map((tasca) =>
        tasca.id === id ? { ...tasca, feta: !tasca.feta } : tasca,
      ),
    )
  }

  function eliminaTasca(id) {
    setTasques((anteriors) => anteriors.filter((tasca) => tasca.id !== id))
  }

  const value = { tasques, afegeixTasca, toggleTasca, eliminaTasca }

  return (
    <TasquesContext.Provider value={value}>
      {children}
    </TasquesContext.Provider>
  )
}

export default TasquesProvider
