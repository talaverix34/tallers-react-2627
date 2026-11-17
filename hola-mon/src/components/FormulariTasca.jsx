
import Boto from './Boto.jsx'
import Missatge from './Missatge.jsx'
import { useState, useContext } from 'react'
import { TasquesContext } from '../context/TasquesContext.js'

function FormulariTasca({}) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const { afegeixTasca } = useContext(TasquesContext)

  function envia(e) {
    e.preventDefault()

    const net = text.trim()
    if (!net) {
        setError('La tasca no pot estar buida!!')
    return
    }
    afegeixTasca(net)
    setText('')
    setError('')
  }

  function gestionarCanvi(e) {
    setText(e.target.value)
    if (error) setError('')
  }

  return (
    <form onSubmit={envia} noValidate>
        <label htmlFor='tasca'>Nova tasca</label>
        <input id='tasca' type='text' value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Escriu una tasca..."
          autoComplete="off"
          className="border border-slate-300 rounded-lg px-4 py-2 my-4 mx-2
          focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
          <p className="text-right text-sm text-slate-500 mb-2">
          {text.length}/80
        </p>

        {error && (
          <div id="error-tasca" className="mb-4 text-red-600">
            <Missatge text={error} tipus="error" />
          </div>
        )}
        <div className="flex justify-center mt-2">
          <Boto type='submit'>Afegeix</Boto>
        </div>

    </form>
    
  )
}

export default FormulariTasca