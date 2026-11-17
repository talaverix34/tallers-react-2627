import Tasca from "./Tasca";

function LlistaTasques({tasques, onToggle, onElimina}) {
    //Sin tareas vacio
    if (tasques.length === 0) {
        return <p className="text-slate-500 text-center mt-6 italic">
            No hi ha tasques pendents. Afegeix-ne una!</p>
    }

    //Contareas ponemos el componente Taca
    return (
        <ul className="w-full mt-6">
            {tasques.map((tasca) =>(
                <Tasca
                key={tasca.id}
                tasca={tasca}
                onToggle={onToggle}
                onElimina={onElimina}
                />
            ))}

        </ul>
    )
}

export default LlistaTasques