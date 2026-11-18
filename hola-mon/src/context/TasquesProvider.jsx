import { useState, useEffect } from 'react'
import { TasquesContext } from './TasquesContext'



const CLAU_TASQUES = 'hola-mon.tasques'

function llegeixTasques() {
  const guardades = localStorage.getItem(CLAU_TASQUES)

  if (!guardades) return []

  const dades = JSON.parse(guardades)
  return Array.isArray(dades) ? dades : []
}

function TasquesProvider({ children }) {
  const [tasques, setTasques] = useState(llegeixTasques)

  useEffect(() => {
    try {
      localStorage.setItem(CLAU_TASQUES, JSON.stringify(tasques))
    }catch{

    }
  }, [tasques])



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
