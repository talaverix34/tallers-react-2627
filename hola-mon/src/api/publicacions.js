const URL_PLUBLICACIONS = 'https://jsonplaceholder.typicode.com/posts?_limit=6'

function adaptaPublicacio({id, title, body}) {
    return {
        id,
        titol: title,
        cos: body,
    }
} 

export async function obtePublicacions(signal) {
    const resposta = await fetch(URL_PLUBLICACIONS, {signal})

    if (!resposta) {
        throw new Error(`Error HTTP $(resposta.status)`)
    }

    const dades = await resposta.json()

    if (!Array.isArray(dades)) {
    throw new Error('Format de resposta inesperat de JSONPlaceholder')
    }

    return dades.map(adaptaPublicacio)
}