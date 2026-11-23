const URL_PERSONATGES = 'https://rickandmortyapi.com/api/character'

// 1. Función adaptadora: convierte los datos crudos de la API al formato de nuestra app
function adaptaPersonatge({ id, name, status, species, image, origin }) {
  return {
    id,
    nom: name,
    estat: status,
    especie: species,
    imatge: image,
    // Accedemos al objeto anidado 'origin'. Si viniera vacío o nulo, ponemos 'Desconegut'
    origen: origin?.name ?? 'Desconegut',
  }
}

// 2. Función asíncrona que realiza la petición HTTP
export async function obtePersonatges(signal) {
  // Pasamos 'signal' a fetch para poder cancelar la petición desde fuera si hace falta
  const resposta = await fetch(URL_PERSONATGES, { signal })

  // fetch NO falla automáticamente en errores 404 o 500; debemos comprobar 'resposta.ok'
  if (!resposta.ok) {
    throw new Error(`Error HTTP ${resposta.status}`)
  }

  // Convertimos el cuerpo de la respuesta a objeto JavaScript (también es asíncrono)
  const dades = await resposta.json()

  // A diferencia de JSONPlaceholder, esta API devuelve un objeto { info, results }.
  // Validamos que 'results' exista y sea una lista antes de intentar recorrerla.
  if (!Array.isArray(dades.results)) {
    throw new Error('Format de resposta inesperat de Rick and Morty')
  }

  // Transformamos cada personaje de la lista usando nuestro adaptador
  return dades.results.map(adaptaPersonatge)
}