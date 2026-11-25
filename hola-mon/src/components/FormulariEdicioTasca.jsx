import { useState, useContext, useEffect } from 'react'
import { TasquesContext } from '../context/TasquesContext.js'
import Boto from './Boto.jsx'
import Missatge from './Missatge.jsx'

function FormulariEdicioTasca({ tasca }) {
  const [text, setText] = useState(tasca.text)
  const [error, setError] = useState('')
  const [desat, setDesat] = useState(false)
  const { editaTasca, enviant } = useContext(TasquesContext)

  useEffect(() => {
    setText(tasca.text)
  }, [tasca.text])

  useEffect(() => {
    if (!desat) return
    const timer = setTimeout(() => setDesat(false), 3000)
    return () => clearTimeout(timer)
  }, [desat])

  const net = text.trim()
  const senseCanvis = net === tasca.text

  async function envia(e) {
    e.preventDefault()
    setDesat(false)

    if (!net) {
      setError('El text de la tasca no pot estar buit.')
      return
    }

    if (senseCanvis) {
      setError("No s'ha fet cap canvi al text.")
      return
    }

    setError('')
    const ok = await editaTasca(tasca.id, net)
    if (ok) {
      setDesat(true)
    }
  }

  function gestionarCanvi(e) {
    setText(e.target.value)
    if (error) setError('')
    if (desat) setDesat(false)
  }

  return (
    <form
      onSubmit={envia}
      className="flex flex-col gap-3 border-t border-slate-200 pt-4 mt-2"
      noValidate
    >
      <label
        htmlFor="edita-tasca"
        className="text-xs text-slate-500 uppercase font-semibold"
      >
        Edita el text de la tasca
      </label>

      <input
        id="edita-tasca"
        type="text"
        value={text}
        onChange={gestionarCanvi}
        disabled={enviant}
        maxLength={80}
        className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-slate-100 disabled:text-slate-400"
      />

      {error && <Missatge text={error} tipus="error" />}

      {desat && (
        <p className="text-sm font-medium text-green-600 text-center">
          Canvis desats
        </p>
      )}

      <div className="flex justify-end">
        <Boto type="submit" disabled={enviant || senseCanvis}>
          {enviant ? 'Desant...' : 'Desa els canvis'}
        </Boto>
      </div>
    </form>
  )
}

export default FormulariEdicioTasca