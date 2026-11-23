


const URL_GOS = 'https://dog.ceo/api/breeds/image/random'

export async function obteGosAleatori(signal) {
  // 1. fetch amb { signal }
  const resposta = await fetch(URL_GOS,{ signal })
  // 2. comprova resposta.ok
  if (!resposta) {
    throw new Error(`Error HTTP ${resposta.status}`)
  }
  // 3. await resposta.json()
  const dades = await resposta.json()

  // 4. valida el format
  if (dades.status !== 'success' || typeof dades.message !== 'string') {
    throw new Error('Format de resposta inesperat de Dog CEO')
  }
  // 5. retorna dades.message
  return dades.message
  
 
  
}
