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

> **Com llegir-la:** abans de l’Activitat 1, centra’t en els apartats 1.1–1.5 (què es desa, JSON i lectura/escriptura); per a l’Activitat 2, recupera l’1.6 (qui és propietari de cada estat); abans de l’Activitat 3, llegeix 1.7–1.8 (validació i errors). Els fragments són exemples: fes els canvis quan t’ho demanin els esglaons.

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

### 1.4 *Lazy initialization* (inicialització diferida) de `useState`

`llegeixTasques` és una funció que definirem a l’Activitat 1. Consulta `localStorage` i retorna una llista de tasques, o `[]` si no n’hi ha cap. Per exemple:

```js
const CLAU_TASQUES = 'hola-mon.tasques'

function llegeixTasques() {
  const guardades = localStorage.getItem(CLAU_TASQUES)
  if (!guardades) return []

  const dades = JSON.parse(guardades)
  return Array.isArray(dades) ? dades : []
}
```

`CLAU_TASQUES` és el nom de la clau on desem la llista. En aquesta primera versió, un JSON corrupte encara pot provocar un error; hi afegirem `try/catch` a l’Activitat 3.

Per llegir el valor inicial sense tornar a consultar `localStorage` en cada render, passa **la funció**, sense cridar-la, a `useState`:

```jsx
const [tasques, setTasques] = useState(llegeixTasques)
```

Evita aquesta forma:

```jsx
const [tasques, setTasques] = useState(llegeixTasques())
```

Amb els parèntesis, `llegeixTasques()` s’avalua en cada render encara que React només utilitzi el resultat inicial. Sense parèntesis, React rep la funció com a **lazy initializer** (funció inicialitzadora diferida) i la crida per obtenir l’estat inicial.

En desenvolupament, `StrictMode` pot cridar l’inicialitzador dues vegades per comprovar que és pur. Llegir `localStorage` no modifica dades i és segur.

### 1.5 Desar amb `useEffect`

React mostra les tasques a la pantalla. `localStorage`, en canvi, en guarda una còpia perquè no desapareguin en recarregar la pàgina. **Mostrar** i **desar** són dues feines diferents.

Desar dades amb localStorage.setItem() modifica un sistema extern a React; això s’anomena un efecte secundari. No posis aquesta instrucció directament al cos del component o de TasquesProvider, perquè s’executaria cada vegada que React el renderitzés —per exemple, quan canviés qualsevol variable d’estat—, encara que les tasques no haguessin canviat.

```jsx
// Incorrecte dins de TasquesProvider: s'escriu cada cop que React el processa
localStorage.setItem(CLAU_TASQUES, JSON.stringify(tasques))
```

Per separar les dues feines, fes servir `useEffect` dins de `TasquesProvider` (important-lo de `react`). Així React mostrarà les tasques i **després** en desarà una còpia:

```jsx
useEffect(() => {
  localStorage.setItem(CLAU_TASQUES, JSON.stringify(tasques))
}, [tasques])
```

Aquí `JSON.stringify(tasques)` converteix la llista en text i `setItem` la desa a la clau definida a l’apartat 1.4. L’array `[tasques]` indica a React quan ha de tornar a executar l’efecte: **després del primer render** i, després, cada vegada que canviï `tasques`. Per això també es desa l’estat inicial encara que l’usuari no hagi fet cap acció.

| Dependències de `useEffect` | Quan s’executa |
| --- | --- |
| `[tasques]` | Després del primer render i quan canvien les tasques: és l’opció que necessitem. |
| `[]` | Després del primer render, però no quan canviïn les tasques. |
| Sense array | Després de cada render. |

En desenvolupament, `StrictMode` pot executar l’efecte més d’un cop en muntar el component. Desar dues vegades el **mateix valor** a la mateixa clau no duplica les tasques.

La seqüència queda així:

```text
llegir valor inicial → useState(llegeixTasques)
mostrar les tasques → React
desar-ne una còpia → useEffect (després de mostrar-les i quan canvien)
```

**Recorda:** React mostra les tasques; `useEffect` en desa una còpia a `localStorage`. Les llistes filtrades i els comptadors no s’han de desar ni calcular amb efectes: calcula’ls directament a partir de les tasques.

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

1. llegir amb *lazy initialization*;
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

**Abans de començar:** si ja hi ha un valor malmès a `hola-mon.tasques`, la lectura d’aquesta activitat pot fallar perquè encara no incorpora `try/catch`. Esborra només aquesta clau des de les eines del navegador i recarrega; la protecció contra dades corruptes arribarà a l’Activitat 3.

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

### Esglaó 2 — Aplicar *lazy initialization*

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

1. Obre **Application → Storage → Local Storage** a les eines del navegador i selecciona l’origen on s’executa `hola-mon`.
2. Afegeix una tasca i comprova que apareix la clau `hola-mon.tasques` amb el seu text. Recarrega la pàgina: la tasca ha de continuar visible.
3. Afegeix temporalment un `console.log` dins de l’efecte i torna a afegir una tasca: el log ha d’aparèixer. En desenvolupament, `StrictMode` pot repetir l’efecte en muntar el component.
4. Canvia el comptador o el filtre: el log de les tasques no hauria d’aparèixer.
5. Elimina el log.

**Comprovació final:** les tasques sobreviuen a una recàrrega, però el filtre encara torna a «Totes».

---

## 3. Activitat 2 — Desar el filtre local

**Objectiu:** persistir el filtre dins d’`App` sense crear cap context ni provider nou.

**Temps estimat:** 40 minuts.

**Recorda:** aquí es valida un valor JSON que existeix, però encara no es captura un `JSON.parse` que falli. Si has introduït text que no és JSON a `hola-mon.filtre` i la pàgina no carrega, esborra només aquesta clau i recarrega. Ho protegiràs a l’Activitat 3.

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
3. A **Application → Storage → Local Storage**, escriu manualment `"inventat"` (amb cometes: és JSON vàlid) a `hola-mon.filtre` i recarrega: ha de tornar a «Totes».
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

Des de **Application → Storage → Local Storage**, substitueix el valor de la clau indicada, recarrega la pàgina i observa el resultat. Prova els casos **d’un en un**: en recarregar, l’efecte pot desar el valor inicial i substituir el que acabes d’escriure. Si tens tasques que vols conservar, copia’n el JSON abans de fer aquestes proves.

1. A `hola-mon.tasques`, escriu `això-no-és-JSON`: la llista ha de quedar buida, sense bloquejar l’aplicació.
2. A `hola-mon.tasques`, escriu `[{"id":7,"text":"Prova","feta":false}]`: la llista ha de quedar buida perquè l’`id` no és un string.
3. A `hola-mon.tasques`, escriu `[{"id":"1","text":"Prova","feta":"sí"}]`: la llista ha de quedar buida perquè `feta` no és un booleà.
4. A `hola-mon.filtre`, escriu `"inventat"` (amb cometes) i recarrega: el filtre ha de tornar a «Totes».

Els exemples de tasques són **text JSON per enganxar a `localStorage`**, no objectes JavaScript per escriure al codi. En tots els casos, l’aplicació ha de continuar funcionant i recuperar el valor inicial. Després de les proves, torna a afegir les tasques o restaura el JSON que hagis copiat.

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
- [ ] La lectura inicial fa servir *lazy initialization*.
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
- *Lazy initialization*: <https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state>
- `useEffect`: <https://react.dev/reference/react/useEffect>
- Esdeveniment `storage`: <https://developer.mozilla.org/ca/docs/Web/API/Window/storage_event>
