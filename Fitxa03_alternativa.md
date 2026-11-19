# Fitxa 03 — Formularis controlats i llista de tasques

> **Proposta alternativa:** aquesta versió reorganitza la Fitxa 03 perquè cada concepte teòric aparegui just abans de l’activitat on s’utilitza. No feu aquestes activitats, ja que són un pel diferents i afectarien a les següents fitxes. Únicament llegiu-la si la "normal" us sembla molt confusa.

> **Objectiu general:** continuar el projecte `hola-mon` de la Fitxa 02, afegir un formulari controlat per crear tasques, gestionar una llista amb estat, completar i eliminar elements, validar les dades i filtrar-les.

- **Temps estimat:** 3 sessions de 60 minuts.
- **Requisits previs:** haver completat la [Fitxa 02](Fitxa02.md) o tenir un `hola-mon` equivalent amb `App`, `Comptador`, `Boto`, `Targeta` i `Missatge`.
- **Projecte:** **no en crees un de nou**. Treballes dins de `hola-mon`.
- **Versions utilitzades:** React 19.3.1, Vite 8.3.4 i Tailwind CSS 4.3.3.

> **Projecte acumulatiu:** el comptador continuarà funcionant. En aquesta fitxa afegirem una segona targeta per crear, completar, eliminar i filtrar tasques.

## Continguts

1. Punt de partida i model de dades
2. Bloc 1 — Formulari i primera tasca
   - Teoria: input controlat, formulari, estat local i callback
   - Activitat 1 — Crear i mostrar tasques
3. Bloc 2 — Completar i eliminar
   - Teoria: checkbox, actualització immutable i components
   - Activitat 2 — Completar, eliminar i extreure components
4. Bloc 3 — Validar i filtrar
   - Teoria: validació, filtre i estat derivat
   - Activitat 3 — Validació, filtre i missatges
5. Arquitectura final
6. Criteris de comprovació
7. Continua el projecte
8. Recursos

---

## 1. Punt de partida i model de dades

A la Fitxa 02 has construït aquesta part del projecte:

```text
App
└── Targeta (Comptador)
    └── Comptador
        ├── Missatge
        └── Boto
```

Ara hi afegirem una segona targeta:

```text
App
├── Targeta (Comptador)
│   └── Comptador
└── Targeta (Tasques)
    ├── FormulariTasca
    └── Llista de tasques
```

Cada tasca serà un objecte amb tres propietats:

```js
{
  id: 'identificador-únic',
  text: 'Repassar props',
  feta: false,
}
```

- `id` permet identificar la tasca.
- `text` és el contingut que ha escrit l’usuari.
- `feta` indica si està completada.

La llista de tasques viurà a `App`, perquè diferents components l’hauran de consultar o modificar.

> **Conveni:** cada component viu en un fitxer propi dins de `src/components/` i s’exporta amb `export default`. `App` continua a `src/App.jsx`.

---

## 2. Bloc 1 — Formulari i primera tasca

### 2.1 Un input controlat

Un input HTML pot guardar el seu valor al DOM. En un formulari React, normalment volem guardar-lo en una variable d’estat:

```jsx
const [text, setText] = useState('')
```

Connectem l’estat amb el camp mitjançant `value` i `onChange`:

```jsx
<input
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
```

El flux és:

```text
L’usuari prem una tecla
        ↓
onChange rep l’esdeveniment
        ↓
setText(e.target.value)
        ↓
React renderitza l’input amb el nou value
```

Les dues parts són necessàries:

- `value={text}` mostra el valor de l’estat;
- `onChange` permet actualitzar-lo.

Si poses `value` sense `onChange`, el camp queda bloquejat.

Associa també una etiqueta al camp:

```jsx
<label htmlFor="tasca">Nova tasca</label>
<input id="tasca" type="text" ... />
```

### 2.2 Enviar el formulari

L’acció s’ha de gestionar des de `onSubmit` del formulari, no només des del clic del botó. Així també funcionarà quan l’usuari premi Enter.

```jsx
function envia(e) {
  e.preventDefault()
  // Processar el text.
}

<form onSubmit={envia}>
  {/* camp i botó */}
</form>
```

`e.preventDefault()` evita que el navegador recarregui la pàgina.

El component `Boto` té `type="button"` per defecte. Per enviar el formulari cal indicar:

```jsx
<Boto type="submit">Afegeix</Boto>
```

### 2.3 Qui guarda cada estat?

El text només és necessari mentre l’usuari escriu. Per això viu a `FormulariTasca`.

La llista completa la necessitaran diversos components. Per això viu a `App`.

| Estat | Propietari | Motiu |
| --- | --- | --- |
| `text` | `FormulariTasca` | Només afecta el camp. |
| `tasques` | `App` | La llista, els comptadors i els filtres la necessitaran. |

El formulari no modifica directament la llista. Avisa `App` mitjançant un callback:

```jsx
<FormulariTasca onAfegir={afegeixTasca} />
```

Quan s’envia:

```jsx
onAfegir(textNet)
```

### 2.4 Afegir sense mutar l’array

A `App`, l’estat comença amb un array buit:

```jsx
const [tasques, setTasques] = useState([])
```

Per afegir una tasca, crea un objecte i un array nous:

```jsx
const novaTasca = {
  id: crypto.randomUUID(),
  text,
  feta: false,
}

setTasques((anteriors) => [...anteriors, novaTasca])
```

No utilitzis `push()`: modificaria l’array existent.

`crypto.randomUUID()` genera un identificador estable. El farem servir per identificar la tasca i com a `key`.

### 2.5 Mostrar la llista

Per convertir les dades en JSX, utilitza `.map()`:

```jsx
{tasques.map((tasca) => (
  <li key={tasca.id}>{tasca.text}</li>
))}
```

La `key` ha de ser única i estable. No facis servir l’índex si després eliminaràs elements.

### 2.6 Activitat 1 — Formulari controlat i primera tasca

**Objectiu:** crear un formulari controlat, afegir tasques a l’estat d’`App` i mostrar-les.

**Temps estimat:** 45 minuts.

#### Esglaó 1 — Crear `FormulariTasca`

1. Crea `src/components/FormulariTasca.jsx`.
2. Importa `useState` i `Boto`.
3. Crea l’estat local `text` amb una cadena buida.
4. Afegeix un `<form>` amb `onSubmit`.
5. Afegeix una etiqueta i un input controlat amb:
   - `id="tasca"`;
   - `value={text}`;
   - `onChange`;
   - `placeholder`;
   - `autoComplete="off"`.
6. Afegeix `<Boto type="submit">Afegeix</Boto>`.
7. Rep el callback `onAfegir` com a prop.

**Comprovació:** el camp mostra el que escrius i l’estat `text` canvia a cada tecla.

#### Esglaó 2 — Enviar el text

1. Crea `envia(e)` dins de `FormulariTasca`.
2. Crida `e.preventDefault()`.
3. Neteja el text amb `trim()`.
4. Si el resultat és buit, no afegeixis res.
5. Crida `onAfegir(textNet)`.
6. Buida el camp amb `setText('')`.

**Comprovació:** Enter i el botó envien el formulari sense recarregar la pàgina.

#### Esglaó 3 — Guardar i mostrar les tasques

1. A `App`, crea `const [tasques, setTasques] = useState([])`.
2. Crea `afegeixTasca(text)`.
3. Genera un `id` amb `crypto.randomUUID()`.
4. Afegeix l’objecte nou amb spread, sense `push()`.
5. Passa `onAfegir={afegeixTasca}` a `FormulariTasca`.
6. Renderitza les tasques amb `.map()` i `key={tasca.id}`.
7. Si no hi ha tasques, mostra «Encara no hi ha tasques. Afegeix-ne una.».

**Comprovació:** les tasques apareixen, el camp es buida i la consola no mostra avisos de `key`.

**Ampliacions opcionals:**

- mostra temporalment el nombre total de tasques;
- desactiva el botó quan el text sigui buit;
- comprova amb React DevTools que cada tasca té un `id` diferent.

---

## 3. Bloc 2 — Completar i eliminar

### 3.1 Checkbox controlat

Un checkbox controlat utilitza `checked` en lloc de `value`:

```jsx
<input
  type="checkbox"
  checked={tasca.feta}
  onChange={() => onToggle(tasca.id)}
/>
```

El checkbox no canvia directament `tasca.feta`. Envia l’`id` al pare i `App` actualitza l’estat.

### 3.2 Actualitzar una tasca amb `.map()`

Per canviar només la tasca seleccionada, crea un array nou:

```jsx
setTasques((anteriors) =>
  anteriors.map((tasca) =>
    tasca.id === id ? { ...tasca, feta: !tasca.feta } : tasca,
  ),
)
```

Per a cada element:

- si l’`id` coincideix, crea un objecte nou amb `feta` invertida;
- si no coincideix, conserva l’objecte existent.

No facis `tasca.feta = true`: mutaria l’estat.

### 3.3 Eliminar amb `.filter()`

Per eliminar una tasca, crea un array que contingui totes les altres:

```jsx
setTasques((anteriors) =>
  anteriors.filter((tasca) => tasca.id !== id),
)
```

`.filter()` no modifica l’array original.

### 3.4 Separar la llista en components

Ara la llista ja té prou responsabilitats per separar-la:

```text
App
└── LlistaTasques
    └── Tasca
```

- `App` guarda l’estat i defineix les funcions.
- `LlistaTasques` renderitza l’array.
- `Tasca` mostra una fila concreta.

Els callbacks viatgen així:

```text
App (toggleTasca)
       │ onToggle
       ▼
LlistaTasques
       │ onToggle
       ▼
Tasca → onToggle(tasca.id)
```

`onToggle` no és una funció especial de React. És el nom del prop que transporta `toggleTasca`.

> Observa que `LlistaTasques` només transporta alguns callbacks. A la Fitxa 04 veurem com evitar aquest prop drilling amb context.

### 3.5 Comptadors derivats

El nombre de pendents es pot calcular a partir de les tasques:

```jsx
const pendents = tasques.filter((tasca) => !tasca.feta).length
const fetes = tasques.length - pendents
```

No necessites un altre `useState`: si canvien les tasques, React torna a calcular els comptadors.

### 3.6 Activitat 2 — Completar, eliminar i extreure components

**Objectiu:** completar i eliminar tasques, i separar la llista en components.

**Temps estimat:** 55 minuts.

#### Esglaó 1 — Crear `Tasca.jsx`

1. Crea `src/components/Tasca.jsx`.
2. Rep `tasca`, `onToggle` i `onElimina`.
3. Mostra un checkbox controlat amb:
   - `checked={tasca.feta}`;
   - `onChange={() => onToggle(tasca.id)}`.
4. Associa el checkbox i el text amb `id` i `htmlFor`.
5. Ratlla i apaga el text quan `tasca.feta` sigui cert.
6. Afegeix un `Boto variant="perill"` que cridi `onElimina(tasca.id)`.
7. Afegeix un `aria-label` que inclogui el text de la tasca.

#### Esglaó 2 — Crear `LlistaTasques.jsx`

1. Crea `src/components/LlistaTasques.jsx`.
2. Rep `tasques`, `onToggle` i `onElimina`.
3. Mostra el missatge buit si l’array no conté elements.
4. Renderitza una `<ul>` amb `.map()`.
5. Passa `key`, `tasca` i els callbacks a cada `Tasca`.
6. Substitueix la llista inline d’`App` per `LlistaTasques`.

#### Esglaó 3 — Actualitzar l’estat des d’`App`

1. Crea `toggleTasca(id)` amb `.map()` i spread.
2. Crea `eliminaTasca(id)` amb `.filter()`.
3. Passa les dues funcions a `LlistaTasques`.
4. Calcula `pendents` i `fetes` durant el render.
5. Mostra els dos comptadors a la targeta de tasques.

**Comprovació:** pots completar, tornar a obrir i eliminar tasques. Els comptadors s’actualitzen i la consola no mostra avisos.

**Ampliació opcional:** afegeix «Neteja les fetes» amb `.filter()`.

---

## 4. Bloc 3 — Validar i filtrar

### 4.1 Validar abans d’afegir

El formulari ha de comprovar el text abans de cridar `onAfegir`:

```jsx
const [error, setError] = useState('')

function envia(e) {
  e.preventDefault()

  const net = text.trim()

  if (!net) {
    setError("Escriu una tasca abans d'afegir-la.")
    return
  }

  onAfegir(net)
  setText('')
  setError('')
}
```

Quan l’usuari torni a escriure, elimina l’error anterior:

```jsx
function canviaText(e) {
  setText(e.target.value)
  if (error) setError('')
}
```

El límit de longitud es pot aplicar amb `maxLength={80}`.

Per comunicar l’error:

```jsx
<input
  aria-invalid={error ? 'true' : 'false'}
  aria-describedby={error ? 'error-tasca' : 'ajuda-tasca'}
/>
```

Mostra el text amb el component `Missatge` de la Fitxa 02.

### 4.2 El filtre és estat font

El filtre seleccionat sí que és estat:

```jsx
const [filtre, setFiltre] = useState('totes')
```

Pot tenir tres valors:

- `totes`;
- `pendents`;
- `fetes`.

`FiltreTasques` rep el valor i un callback:

```jsx
<FiltreTasques
  filtre={filtre}
  onCanviaFiltre={setFiltre}
/>
```

### 4.3 La llista visible és estat derivat

No creïs un segon `useState` per a les tasques filtrades. Calcula-les a partir de `tasques` i `filtre`:

```jsx
const tasquesFiltrades = tasques.filter((tasca) => {
  if (filtre === 'pendents') return !tasca.feta
  if (filtre === 'fetes') return tasca.feta
  return true
})
```

També són derivats:

- `pendents`;
- `fetes`;
- `missatgeBuit`.

```text
Estat font                 Estat derivat
-----------                --------------
tasques ────────────────► pendents i fetes
   │
   └── + filtre ─────────► tasquesFiltrades
                           missatgeBuit
```

Si guardessis aquests resultats en un altre estat, hauries de sincronitzar diverses fonts de veritat.

### 4.4 Botons del filtre

Els botons es poden generar a partir de dades:

```jsx
const FILTRES = [
  { id: 'totes', etiqueta: 'Totes' },
  { id: 'pendents', etiqueta: 'Pendents' },
  { id: 'fetes', etiqueta: 'Fetes' },
]
```

Cada botó necessita `key={id}`. El filtre actiu pot mostrar-se amb una variant diferent i `aria-pressed`:

```jsx
<Boto
  variant={filtre === id ? 'primari' : 'secundari'}
  onClick={() => onCanviaFiltre(id)}
  aria-pressed={filtre === id}
>
  {etiqueta}
</Boto>
```

### 4.5 Activitat 3 — Validació, filtre i estat derivat

**Objectiu:** validar el formulari, filtrar la llista i calcular els valors derivats sense duplicar estat.

**Temps estimat:** 55 minuts.

#### Esglaó 1 — Validar el formulari

1. Afegeix l’estat local `error` a `FormulariTasca`.
2. Valida el text net abans de cridar `onAfegir`.
3. Mostra l’error amb `Missatge`.
4. Neteja l’error quan l’usuari torni a escriure.
5. Afegeix `maxLength={80}`.
6. Mostra el recompte de caràcters.
7. Afegeix `aria-invalid` i `aria-describedby`.
8. Posa `noValidate` al formulari per mostrar la validació pròpia.

**Comprovació:** el text buit mostra un error, l’error desapareix en escriure i una tasca vàlida s’afegeix.

#### Esglaó 2 — Crear `FiltreTasques.jsx`

1. Crea `src/components/FiltreTasques.jsx`.
2. Defineix `FILTRES` amb els tres valors.
3. Rep `filtre` i `onCanviaFiltre`.
4. Genera els botons amb `.map()` i `key`.
5. Mostra el filtre actiu amb `variant` i `aria-pressed`.
6. A `App`, crea l’estat `filtre` amb el valor inicial `'totes'`.
7. Calcula `tasquesFiltrades`.
8. Passa la llista filtrada a `LlistaTasques`.

#### Esglaó 3 — Completar l’estat derivat

1. Calcula `pendents` i `fetes` amb la llista completa, no amb la filtrada.
2. Calcula `missatgeBuit` segons el filtre:
   - sense tasques: «Encara no hi ha tasques. Afegeix-ne una.»;
   - sense pendents: «No hi ha tasques pendents. Bona feina!»;
   - sense fetes: «Encara no has marcat cap tasca com a feta.».
3. Passa `missatgeBuit` a `LlistaTasques`.
4. Comprova que canviar el filtre no modifica els comptadors totals.

**Comprovació:** els tres filtres funcionen, el missatge buit és correcte i no hi ha cap estat duplicat.

**Ampliació opcional:** afegeix «Marca totes com a fetes» actualitzant l’array amb `.map()`.

---

## 5. Arquitectura final

```text
App
├── Targeta (Comptador)
│   └── Comptador
│       ├── Missatge
│       └── Boto
└── Targeta (Tasques)
    ├── FormulariTasca
    ├── FiltreTasques
    └── LlistaTasques
        └── Tasca
```

```text
src/
├── components/
│   ├── Boto.jsx
│   ├── Comptador.jsx
│   ├── FiltreTasques.jsx
│   ├── FormulariTasca.jsx
│   ├── LlistaTasques.jsx
│   ├── Missatge.jsx
│   ├── Targeta.jsx
│   └── Tasca.jsx
├── App.jsx
├── index.css
└── main.jsx
```

Contracte principal:

| Component | Props | Responsabilitat |
| --- | --- | --- |
| `App` | — | Guarda tasques i filtre; defineix handlers i valors derivats. |
| `FormulariTasca` | `onAfegir` | Controla text i error; envia el text net. |
| `FiltreTasques` | `filtre`, `onCanviaFiltre` | Mostra i canvia el filtre. |
| `LlistaTasques` | `tasques`, `missatgeBuit`, `onToggle`, `onElimina` | Renderitza la llista o l’estat buit. |
| `Tasca` | `tasca`, `onToggle`, `onElimina` | Mostra una tasca i notifica accions. |

## 6. Criteris de comprovació

- [ ] Has continuat dins de `hola-mon`.
- [ ] El comptador de la Fitxa 02 continua funcionant.
- [ ] L’input és controlat amb `value` i `onChange`.
- [ ] El formulari fa servir `onSubmit` i `preventDefault()`.
- [ ] El text i l’error viuen a `FormulariTasca`.
- [ ] Les tasques i el filtre viuen a `App`.
- [ ] Cada tasca té un `id` estable.
- [ ] La llista fa servir `.map()` i `key={tasca.id}`.
- [ ] Afegir, completar i eliminar crea arrays nous.
- [ ] `FormulariTasca`, `LlistaTasques`, `Tasca` i `FiltreTasques` viuen en fitxers propis.
- [ ] El formulari valida el text buit i mostra un error.
- [ ] Els filtres `totes`, `pendents` i `fetes` funcionen.
- [ ] La llista filtrada, els comptadors i el missatge buit són valors derivats.
- [ ] No hi ha estat duplicat ni mutacions d’arrays.
- [ ] La consola no mostra errors ni avisos.

Les accions «Neteja les fetes» i «Marca totes com a fetes» són ampliacions opcionals.

## 7. Continua el projecte

Guarda `hola-mon`. A la [Fitxa 04](Fitxa04.md) compartirem les tasques amb un únic `TasquesContext` per evitar que `LlistaTasques` transporti callbacks que només necessita `Tasca`.

El filtre continuarà sent estat local d’`App`, perquè només baixa un nivell per props.

No cal tornar a executar `npm create vite`.

## 8. Recursos

- Formularis: <https://react.dev/reference/react-dom/components/form>
- Inputs controlats: <https://react.dev/reference/react-dom/components/input>
- Gestió de l’estat: <https://react.dev/learn/managing-state>
- Actualitzar arrays: <https://react.dev/learn/updating-arrays-in-state>
- Renderitzar llistes: <https://react.dev/learn/rendering-lists>
- Renderització condicional: <https://react.dev/learn/conditional-rendering>
- `crypto.randomUUID()`: <https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID>
- Accessibilitat dels formularis: <https://developer.mozilla.org/en-US/docs/Learn/Forms/HTML_forms_and_accessibility>
