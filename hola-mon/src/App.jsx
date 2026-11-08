import { useState } from 'react'

function App() {
  const [comptador, setComptador] = useState(0)

  function incrementa() {
    setComptador((anterior) => anterior + 1)
  }

  function decrementar() {
    setComptador((anterior) => anterior -1)
  }

  function reiniciar() {
    setComptador(0)
  }

  //MENSAJE

  let missatge = `Encara no has començat.`
  if (comptador > 0) {
    missatge = `Vas per bon camí.`
  }else if ( comptador < 0) {
    missatge = `Compte, vas enrere!.`
  }


  return (
    <main>
      <h1>Hola món!</h1>
      <p>Has fet clic {comptador} vegades.</p>
      <p>{missatge}</p>
      <button onClick={incrementa}>Incrementa</button>
      <button onClick={decrementar}>Decrementa</button>
      <button onClick={reiniciar}>Reiniciar</button>
    </main>
  )
}

export default App