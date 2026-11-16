# Fitxa 05 — `localStorage` i persistència

> **Objectiu general:** conservar les tasques i el filtre entre recàrregues, aprendre a llegir i desar dades amb `localStorage` i protegir l’aplicació davant de dades corruptes o invàlides.

- **Temps estimat total:** 3 hores (2 h 30 min a classe; 15 min de lectura prèvia i 15 min de treball posterior).
- **Requisits previs:** haver completat la [Fitxa 04](Fitxa04.md) o tenir un `hola-mon` equivalent amb un únic `TasquesProvider`, consum directe amb `useContext` i el filtre local a `App`.
- **Projecte:** **no en crees un de nou**. Treballes dins de `hola-mon`.
- **Abans de classe (15 min):** llegeix els apartats 1.2–1.5.
- **Versions utilitzades:** React 19.3.1, Vite 8.3.4 i Tailwind CSS 4.3.3.

> La Fitxa 04 continua intacta: no afegirem cap context de filtre ni cap hook personalitzat. Mantindrem la persistència explícita perquè es vegi clarament què es llegeix, què es valida i què es desa.

## Continguts

1. Teoria
2. Activitat 1 — Desar i recuperar les tasques
3. Activitat 2 — Desar el filtre local
4. Activitat 3 — Validació i persistència robusta
5. Criteris de comprovació
6. Continua el projecte
7. Recursos

---

## 1. Teoria

### 1.1 On som i què persistirem

La Fitxa 04 ha deixat aquesta estructura:

```text
main.jsx
└── TasquesProvider        ← estat tasques
    └── App                ← estat filtre
        ├── FormulariTasca ← consumeix TasquesContext
        ├── FiltreTasques  ← rep filtre i callback
        └── LlistaTasques  ← rep filtre i consumeix TasquesContext
            └── Tasca      ← consumeix TasquesContext
```

En recarregar la pàgina, aquests dos estats es reinicien:

```jsx
// TasquesProvider
const [tasques, setTasques] = useState([])

// App
const [filtre, setFiltre] = useState('totes')
```

Persistirem només l’**estat font**:

| Dada | Clau | Propietari |
| --- | --- | --- |
| `tasques` | `hola-mon.tasques` | `TasquesProvider` |
| `filtre` | `hola-mon.filtre` | `App` |

No desarem `tasquesFiltrades`, `pendents`, `fetes`, `missatgeBuit` ni el comptador. Són valors derivats o una demostració independent.

### 1.2 Què és `localStorage`

`localStorage` és una API del navegador que guarda parells clau-valor en format de text:

```js
localStorage.setItem('hola-mon.tasques', '[]')
const valor = localStorage.getItem('hola-mon.tasques')
localStorage.removeItem('hola-mon.tasques')
```

Característiques principals:

- les dades sobreviuen a recàrregues i al tancament del navegador;
- només guarda strings;
- és síncron;
- les dades pertanyen a l’origen actual;
- no és adequat per guardar contrasenyes, tokens ni secrets.

Pots inspeccionar-lo a **Application → Storage → Local Storage**.

### 1.3 Convertir dades amb JSON

Per guardar arrays o objectes cal convertir-los a text:

```js
const tasques = [{ id: '1', text: 'Repassar', feta: false }]

const text = JSON.stringify(tasques)
const recuperades = JSON.parse(text)
```

- `JSON.stringify()` converteix un valor en text JSON.
- `JSON.parse()` recupera el valor.
- `JSON.parse()` llança un error si el text no és JSON vàlid.

### 1.4 Inicialitzador mandrós de `useState`

Per llegir només quan es crea l’estat, passa una funció a `useState`:

```jsx
const [tasques, setTasques] = useState(llegeixTasques)
```

Evita aquesta forma:

```jsx
const [tasques, setTasques] = useState(llegeixTasques())
```

Amb els parèntesis, `llegeixTasques()` s’avalua en cada render encara que React només utilitzi el resultat inicial. Sense parèntesis, React la fa servir com a **inicialitzador mandrós**.

En desenvolupament, `StrictMode` pot cridar l’inicialitzador dues vegades per comprovar que és pur. Llegir `localStorage` no modifica dades i és segur.

### 1.5 Desar amb `useEffect`

Desar a `localStorage` és un efecte secundari. No ho facis durant el render:

```jsx
// Incorrecte: modifica una API externa durant el render
localStorage.setItem(CLAU_TASQUES, JSON.stringify(tasques))
```

Fes-ho després del render:

```jsx
useEffect(() => {
  localStorage.setItem(CLAU_TASQUES, JSON.stringify(tasques))
}, [tasques])
```

L’efecte s’executa després del primer render i quan canvia la referència de `tasques`.

| Dependències | Comportament |
| --- | --- |
| `[tasques]` | En muntar i quan canvien les tasques. |
| `[]` | Només en muntar. |
| Sense array | Després de cada render. |

La seqüència correcta és:

```text
llegir valor inicial → useState
calcular interfície → render
desar quan canvia → useEffect
```

No facis servir efectes per calcular llistes filtrades o comptadors: deriva’ls directament durant el render.

### 1.6 Dos propietaris, una mateixa tècnica

Les tasques i el filtre viuen en llocs diferents:

```jsx
// TasquesProvider
const [tasques, setTasques] = useState(llegeixTasques)

// App
const [filtre, setFiltre] = useState(llegeixFiltre)
```

Això no obliga a crear un context nou. `App` ja és el propietari natural del filtre i el passa només un nivell per props.

Durant les activitats 1 i 2 escriurem dues vegades el mateix patró per entendre’l:

1. llegir amb un inicialitzador mandrós;
2. validar el valor;
3. desar-lo amb un efecte.

A l’Activitat 3 mantindrem el patró explícit i hi afegirem validació i tractament d’errors. La petita duplicació ens ajuda a veure que tasques i filtre tenen propietaris diferents.

### 1.7 Validar dades externes

Les dades de `localStorage` poden estar manipulades, corruptes o provenir d’una versió antiga. Per això les validarem.

```js
function esTascaValida(tasca) {
  return (
    tasca !== null &&
    typeof tasca === 'object' &&
    typeof tasca.id === 'string' &&
    typeof tasca.text === 'string' &&
    typeof tasca.feta === 'boolean'
  )
}

function esLlistaDeTasques(valor) {
  return Array.isArray(valor) && valor.every(esTascaValida)
}
```

El filtre només pot tenir tres valors:

```js
const FILTRES_VALIDS = ['totes', 'pendents', 'fetes']

function esFiltreValid(valor) {
  return FILTRES_VALIDS.includes(valor)
}
```

### 1.8 Persistència robusta sense amagar els passos

A l’activitat final millorarem les dues funcions de lectura amb `try/catch`:

```js
function llegeixFiltre() {
  try {
    const guardat = localStorage.getItem(CLAU_FILTRE)
    if (!guardat) return 'totes'

    const valor = JSON.parse(guardat)
    return FILTRES_VALIDS.includes(valor) ? valor : 'totes'
  } catch {
    return 'totes'
  }
}
```

També protegirem l’escriptura:

```jsx
useEffect(() => {
  try {
    localStorage.setItem(CLAU_FILTRE, JSON.stringify(filtre))
  } catch {
    // L’aplicació continua funcionant en memòria.
  }
}, [filtre])
```

El mateix patró s’aplica a les tasques dins de `TasquesProvider`. No l’extraurem encara a un hook: en aquesta fitxa prioritzem entendre bé `useState`, `useEffect`, JSON i la validació.

> **Ampliació opcional:** quan aquests passos siguin familiars, pots provar d’extreure’ls a un hook `useLocalStorage`. No és un requisit ni forma part de la solució base.

### 1.9 Estructura final

```text
src/
├── context/
│   ├── TasquesContext.js
│   └── TasquesProvider.jsx
├── components/
│   ├── FiltreTasques.jsx
│   ├── FormulariTasca.jsx
│   ├── LlistaTasques.jsx
│   └── Tasca.jsx
├── App.jsx
└── main.jsx
```

---

## 2. Activitat 1 — Desar i recuperar les tasques

**Objectiu:** fer que `TasquesProvider` recuperi les tasques guardades i les desi quan canviïn.

**Temps estimat:** 50 minuts.

### Esglaó 1 — Llegir les tasques

A `TasquesProvider.jsx`, importa `useEffect` i defineix:

```js
const CLAU_TASQUES = 'hola-mon.tasques'

function llegeixTasques() {
  const guardades = localStorage.getItem(CLAU_TASQUES)

  if (!guardades) return []

  const dades = JSON.parse(guardades)
  return Array.isArray(dades) ? dades : []
}
```

En aquesta primera activitat encara no capturem JSON corrupte; ho farem a l’Activitat 3.

### Esglaó 2 — Inicialitzar mandrosament

Substitueix:

```jsx
const [tasques, setTasques] = useState([])
```

per:

```jsx
const [tasques, setTasques] = useState(llegeixTasques)
```

### Esglaó 3 — Desar els canvis

```jsx
useEffect(() => {
  localStorage.setItem(CLAU_TASQUES, JSON.stringify(tasques))
}, [tasques])
```

Comprova que afegir, completar i eliminar actualitza `hola-mon.tasques`.

### Esglaó 4 — Provar les dependències

1. Afegeix temporalment un `console.log` dins de l’efecte.
2. Afegeix una tasca: ha d’aparèixer.
3. Canvia el comptador o el filtre: no ha d’aparèixer.
4. Elimina el log.

**Comprovació final:** les tasques sobreviuen a una recàrrega, però el filtre encara torna a «Totes».

---

## 3. Activitat 2 — Desar el filtre local

**Objectiu:** persistir el filtre dins d’`App` sense crear cap context ni provider nou.

**Temps estimat:** 40 minuts.

### Esglaó 1 — Preparar la lectura

A `App.jsx`, importa `useEffect` i defineix fora del component:

```js
const CLAU_FILTRE = 'hola-mon.filtre'
const FILTRES_VALIDS = ['totes', 'pendents', 'fetes']

function llegeixFiltre() {
  const guardat = localStorage.getItem(CLAU_FILTRE)

  if (!guardat) return 'totes'

  const valor = JSON.parse(guardat)
  return FILTRES_VALIDS.includes(valor) ? valor : 'totes'
}
```

### Esglaó 2 — Recuperar i desar

Canvia l’estat:

```jsx
const [filtre, setFiltre] = useState(llegeixFiltre)
```

I afegeix l’efecte:

```jsx
useEffect(() => {
  localStorage.setItem(CLAU_FILTRE, JSON.stringify(filtre))
}, [filtre])
```

### Esglaó 3 — Mantenir les props

No canviïs l’arquitectura de la Fitxa 04:

```jsx
<FiltreTasques filtre={filtre} onCanviaFiltre={setFiltre} />
<LlistaTasques filtre={filtre} />
```

La persistència pertany al component que posseeix l’estat. Els components fills no necessiten conèixer `localStorage`.

### Esglaó 4 — Provar el filtre

1. Selecciona «Pendents» i recarrega.
2. Selecciona «Fetes» i recarrega.
3. Escriu manualment `"inventat"` a `hola-mon.filtre`: ha de tornar a «Totes».
4. Comprova que la llista filtrada i els comptadors no es desen.

**Comprovació final:** tasques i filtre sobreviuen, però continuen tenint propietaris diferents.

---

## 4. Activitat 3 — Validació i persistència robusta

**Objectiu:** resistir JSON corrupte, dades invàlides i errors d’accés a `localStorage`, mantenint visibles tots els passos.

**Temps estimat:** 45 minuts a classe i 15 minuts de treball posterior.

### Esglaó 1 — Validar les tasques

A `TasquesProvider`:

1. defineix `esTascaValida` i `esLlistaDeTasques` com a l’apartat 1.7;
2. envolta la lectura amb `try/catch`;
3. retorna `[]` si el JSON falla o les dades no són una llista de tasques vàlides.

```js
function llegeixTasques() {
  try {
    const guardades = localStorage.getItem(CLAU_TASQUES)
    if (!guardades) return []

    const dades = JSON.parse(guardades)
    return esLlistaDeTasques(dades) ? dades : []
  } catch {
    return []
  }
}
```

### Esglaó 2 — Protegir l’escriptura de tasques

Envolta `setItem` amb `try/catch` sense canviar la dependència `[tasques]`.

```jsx
useEffect(() => {
  try {
    localStorage.setItem(CLAU_TASQUES, JSON.stringify(tasques))
  } catch {
    // L’aplicació continua funcionant en memòria.
  }
}, [tasques])
```

### Esglaó 3 — Fer robust el filtre

A `App`, afegeix `try/catch` a `llegeixFiltre` i a l’efecte que desa `filtre`, seguint l’exemple de l’apartat 1.8. Mantén:

```jsx
const [filtre, setFiltre] = useState(llegeixFiltre)
```

`App` continua sent el propietari del filtre i no apareix cap context ni hook nou.

### Esglaó 4 — Treball posterior: dades corruptes

Prova manualment:

1. text que no sigui JSON a `hola-mon.tasques`;
2. una tasca amb `id` numèric;
3. una tasca amb `feta: "sí"`;
4. un filtre `"inventat"`.

En tots els casos, l’aplicació ha de continuar funcionant i recuperar el valor inicial.

### Esglaó 5 — Reptes opcionals

- extreu la lògica repetida a un hook `useLocalStorage`;
- afegeix una acció per reiniciar les tasques;
- escolta l’esdeveniment `storage` per sincronitzar pestanyes;
- versiona la clau com `hola-mon.tasques.v1`.

---

## 5. Criteris de comprovació

- [ ] Has continuat dins de `hola-mon`.
- [ ] Només existeixen `TasquesContext` i `TasquesProvider`.
- [ ] Els components consumeixen `TasquesContext` directament amb `useContext`.
- [ ] `TasquesProvider` persisteix `tasques` a `hola-mon.tasques`.
- [ ] `App` és el propietari de `filtre` i el persisteix a `hola-mon.filtre`.
- [ ] `FiltreTasques` i `LlistaTasques` continuen rebent el filtre per props.
- [ ] La lectura inicial fa servir un inicialitzador mandrós.
- [ ] L’escriptura es fa després del render amb `useEffect`.
- [ ] La lectura i l’escriptura capturen errors.
- [ ] Les tasques i el filtre es validen.
- [ ] L’estat derivat i el comptador no es persisteixen.
- [ ] No existeixen `FiltreTasquesContext`, `FiltreTasquesProvider`, `useTasques` ni `useFiltreTasques`.
- [ ] La consola no mostra errors ni avisos.

---

## 6. Continua el projecte

Guarda `hola-mon`. A la [Fitxa 06](Fitxa06.md) afegirem React Router. `TasquesProvider` embolcallarà les rutes i el filtre persistent passarà d’`App` a la pàgina de tasques, sense necessitat de crear cap context nou.

---

## 7. Recursos

- `localStorage`: <https://developer.mozilla.org/ca/docs/Web/API/Window/localStorage>
- `JSON.stringify()`: <https://developer.mozilla.org/ca/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify>
- `JSON.parse()`: <https://developer.mozilla.org/ca/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse>
- Inicialitzador mandrós: <https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state>
- `useEffect`: <https://react.dev/reference/react/useEffect>
- Esdeveniment `storage`: <https://developer.mozilla.org/ca/docs/Web/API/Window/storage_event>
