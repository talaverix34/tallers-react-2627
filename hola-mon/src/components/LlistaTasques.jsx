import { useContext } from 'react'
import { TasquesContext } from '../context/TasquesContext.js'
import Tasca from "./Tasca"

// Ahora solo recibe el filtro como prop
function LlistaTasques({ filtre }) {
    // 1. Coge TODAS las tareas directamente de la caja
    const { tasques } = useContext(TasquesContext)

    // 2. Filtra las tareas aquí mismo
    const tasquesFiltrades = tasques.filter((tasca) => {
        if (filtre === 'pendents') return !tasca.feta
        if (filtre === 'fetes') return tasca.feta
        return true 
    })

    // 3. Calcula el mensaje dinámico
    let missatgeBuit = 'Encara no hi ha tasques. Afegeix-ne una.'
    if (tasques.length > 0) {
        if (filtre === 'pendents') {
            missatgeBuit = 'No hi ha tasques pendents. Bona feina!'
        } else if (filtre === 'fetes') {
            missatgeBuit = 'Encara no has marcat cap tasca com a feta.'
        }
    }

    // 4. Muestra el mensaje si la lista FILTRADA está vacía
    if (tasquesFiltrades.length === 0) {
        return (
            <p className="text-slate-500 text-center mt-6 italic">
                {missatgeBuit}
            </p>
        )
    }

    return (
        <ul className="mt-4">
            {/* Hacemos el .map sobre las tareas filtradas */}
            {tasquesFiltrades.map((tasca) => (
                <Tasca key={tasca.id} tasca={tasca} />
            ))}
        </ul>
    )
}

export default LlistaTasques