import Boto from "./Boto"

const FILTRES = [
    {id: 'totes', text: 'Totes'},
    {id: 'pendents', text: 'Pendents'},
    {id: 'fetes', text: 'Fetes'}
]

function FiltreTasques ({filtre, onCanviaFiltre}) {
    return(
        <div className="flex gap-2 justify-center m-6">
        {FILTRES.map((f) => 
        <Boto
        key={f.id}
        variant={filtre === f.id ? 'primari' : 'secundari'}
        aria-pressed={filtre === f.id}
        onClick={() => onCanviaFiltre(f.id)}
        >
            {f.text}
        </Boto>
        )}

    </div>

    )
    
}

export default FiltreTasques