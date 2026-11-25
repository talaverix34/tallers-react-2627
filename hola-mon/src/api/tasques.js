const URL_TASQUES = 'http://localhost:3001/tasques'

// 1. LLEGIR TASQUES (GET)
export async function obteTasques(signal) {
  const resposta = await fetch(URL_TASQUES, { signal })

  if (!resposta.ok) {
    throw new Error(`No s'han pogut carregar les tasques (${resposta.status}).`)
  }

  const dades = await resposta.json()

  if (!Array.isArray(dades)) {
    throw new Error("La resposta de l'API no té el format esperat.")
  }

  return dades
}

// 2. CREAR TASCA (POST)
export async function creaTasca(text) {
  const resposta = await fetch(URL_TASQUES, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, feta: false }),
  })

  if (!resposta.ok) {
    throw new Error(`No s'ha pogut crear la tasca (${resposta.status}).`)
  }

  return resposta.json()
}

// 3. ACTUALITZAR TASCA (PATCH)
export async function actualitzaTasca(id, canvis) {
  const resposta = await fetch(`${URL_TASQUES}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(canvis),
  })

  if (!resposta.ok) {
    throw new Error(`No s'ha pogut actualitzar la tasca (${resposta.status}).`)
  }

  const dades = await resposta.json()

  if (
    !dades ||
    typeof dades.id !== 'string' ||
    typeof dades.text !== 'string' ||
    typeof dades.feta !== 'boolean'
  ) {
    throw new Error("La resposta de l'API en actualitzar no té el format esperat.")
  }

  return dades
}

// 4. ELIMINAR TASCA (DELETE)
export async function eliminaTascaApi(id) {
  const resposta = await fetch(`${URL_TASQUES}/${id}`, {
    method: 'DELETE',
  })

  if (!resposta.ok) {
    throw new Error(`No s'ha pogut eliminar la tasca (${resposta.status}).`)
  }
}