import { useState, useEffect } from 'react'
import { TasquesContext } from './TasquesContext'
import {
  obteTasques,
  creaTasca,
  actualitzaTasca,
  eliminaTascaApi,
} from '../api/tasques.js'

function TasquesProvider({ children }) {
  const [tasques, setTasques] = useState([])
  const [carregant, setCarregant] = useState(true)
  const [error, setError] = useState('')
  const [recarregar, setRecarregar] = useState(0)

  const [enviant, setEnviant] = useState(false)
  const [errorAccio, setErrorAccio] = useState('')

  useEffect(() => {
    const controlador = new AbortController()

    async function carrega() {
      setCarregant(true)
      setError('')

      try {
        const dades = await obteTasques(controlador.signal)
        setTasques(dades)
      } catch (err) {
        if (err.name === 'AbortError') return
        if (err.name === 'TypeError') {
          setError(
            "No s'ha pogut connectar amb l'API. Comprova que `npm run api` estigui en marxa.",
          )
        } else {
          setError(err.message)
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCarregant(false)
        }
      }
    }

    carrega()

    return () => controlador.abort()
  }, [recarregar])

  function recarregaTasques() {
    setRecarregar((n) => n + 1)
  }

  async function afegeixTasca(text) {
    setEnviant(true)
    setErrorAccio('')

    try {
      const novaTasca = await creaTasca(text)
      setTasques((anteriors) => [...anteriors, novaTasca])
      return true
    } catch (err) {
      if (err.name === 'TypeError') {
        setErrorAccio("No s'ha pogut connectar amb l'API per crear la tasca.")
      } else {
        setErrorAccio(err.message)
      }
      return false
    } finally {
      setEnviant(false)
    }
  }

  async function toggleTasca(id) {
    const tascaActual = tasques.find((t) => t.id === id)
    if (!tascaActual) return false

    setEnviant(true)
    setErrorAccio('')

    try {
      const tascaActualitzada = await actualitzaTasca(id, {
        feta: !tascaActual.feta,
      })
      setTasques((anteriors) =>
        anteriors.map((tasca) => (tasca.id === id ? tascaActualitzada : tasca)),
      )
      return true
    } catch (err) {
      if (err.name === 'TypeError') {
        setErrorAccio(
          "No s'ha pogut connectar amb l'API per actualitzar la tasca.",
        )
      } else {
        setErrorAccio(err.message)
      }
      return false
    } finally {
      setEnviant(false)
    }
  }

  async function editaTasca(id, nouText) {
    setEnviant(true)
    setErrorAccio('')

    try {
      const tascaActualitzada = await actualitzaTasca(id, { text: nouText })
      setTasques((anteriors) =>
        anteriors.map((tasca) => (tasca.id === id ? tascaActualitzada : tasca)),
      )
      return true
    } catch (err) {
      if (err.name === 'TypeError') {
        setErrorAccio("No s'ha pogut connectar amb l'API per editar la tasca.")
      } else {
        setErrorAccio(err.message)
      }
      return false
    } finally {
      setEnviant(false)
    }
  }

  async function eliminaTasca(id) {
    setEnviant(true)
    setErrorAccio('')

    try {
      await eliminaTascaApi(id)
      setTasques((anteriors) => anteriors.filter((tasca) => tasca.id !== id))
      return true
    } catch (err) {
      if (err.name === 'TypeError') {
        setErrorAccio(
          "No s'ha pogut connectar amb l'API per eliminar la tasca.",
        )
      } else {
        setErrorAccio(err.message)
      }
      return false
    } finally {
      setEnviant(false)
    }
  }

  const value = {
    tasques,
    carregant,
    error,
    enviant,
    errorAccio,
    recarregaTasques,
    afegeixTasca,
    toggleTasca,
    editaTasca,
    eliminaTasca,
  }

  return (
    <TasquesContext.Provider value={value}>{children}</TasquesContext.Provider>
  )
}

export default TasquesProvider