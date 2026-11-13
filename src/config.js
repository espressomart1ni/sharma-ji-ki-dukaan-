// ---- Catalogue: add a product here + drop a PNG in public/assets/products (or /dvd) and it appears on shelves. ----
// type: packet | box | jar | pencilbox | car | dvd | cassette | top      pool: which shelves may stock it
export const FOOTPRINT = { packet: .19, box: .17, jar: .18, pencilbox: .35, car: .23, dvd: .16, cassette: .14, top: .12 };
export const PRODUCTS = [
  { id: 'parleg', type: 'packet', name: 'Parle-G', color: '#f4c430', content: 'biscuit', pool: ['snack'], blurb: 'Dunked for exactly two seconds. Three, and it was in the chai.' },
  { id: 'monaco', type: 'packet', name: 'Monaco', color: '#d8452a', content: 'cracker', pool: ['snack'], blurb: 'Salty, round, and always shared.' },
  { id: 'hideseek', type: 'packet', name: 'Hide & Seek', color: '#5b2b17', content: 'biscuit', pool: ['snack'], blurb: 'The “fancy” biscuit, for guests and exam results.' },
  { id: 'littlehearts', type: 'packet', name: 'Little Hearts', color: '#e56a8a', content: 'biscuit', pool: ['snack'], blurb: 'You ate the icing side first. Everyone did.' },
  { id: 'fiftyfifty', type: 'packet', name: '50-50', color: '#2b6cb0', content: 'cracker', pool: ['snack'], blurb: 'Half sweet, half salty, fully tiffin box.' },
  { id: 'unclechipps', type: 'packet', name: 'Uncle Chipps', color: '#f0b92a', content: 'chips', pool: ['snack'], blurb: 'Five rupees of crunch and a greasy thumbprint.' },
  { id: 'poppins', type: 'packet', name: 'Poppins', color: '#7cbf3e', content: 'candy', pool: ['snack'], blurb: 'A roll of colours. The last one was always orange.' },
  { id: 'melody', type: 'packet', name: 'Melody', color: '#6a3b1f', content: 'candy', pool: ['snack'], blurb: 'Chocolatey, toffee-ey, a little sticky on the teeth.' },
  { id: 'hajmola', type: 'packet', name: 'Hajmola', color: '#a3202b', content: 'candy', pool: ['snack'], blurb: 'Officially digestive. Actually a sweet-and-sour sweet.' },
  { id: 'krackjack', type: 'packet', name: 'KrackJack', color: '#1f7050', content: 'cracker', pool: ['snack'], blurb: 'Sweet and salty, depending on the bite.' },
  { id: 'phantom', type: 'box', name: 'Phantom candy sticks', pool: ['snack', 'toy'], blurb: 'Parents hated them. We loved them.' },
  { id: 'candyjar', type: 'jar', variant: 'candy', name: 'Toffee jar', pool: ['snack'], rare: true, blurb: 'One rupee for four. Uncle counted twice.' },
  { id: 'marbles', type: 'jar', variant: 'marble', name: 'Kanche (marbles)', pool: ['toy'], rare: true, blurb: 'Currency of the playground.' },
  { id: 'spaceranger', type: 'pencilbox', name: 'Space Rangers pencil box', pool: ['stationery'], blurb: 'Two compartments. The bottom one held your best stuff.' },
  { id: 'flames', type: 'car', name: 'Die-cast car', pool: ['toy', 'stationery'], blurb: 'Flip it over: the base had all the writing.' },
  { id: 'lattu', type: 'top', name: 'Lattu (spinning top)', pool: ['toy'], blurb: 'Wind the string, throw low, win a fight.' },
  { id: 'cassette_mix', type: 'cassette', name: "Mix '99 cassette", pool: ['media'], blurb: 'Recorded off the radio, with the announcer’s voice at the start.' },
  { id: 'cassette_filmi', type: 'cassette', name: 'Filmi Gaane Vol. 4', pool: ['media'], blurb: 'The pencil was for winding the tape back.' },
  { id: 'dil_ke_paas', type: 'dvd', name: 'Dil Ke Paas (DVD)', pool: ['media'], blurb: 'Romance. Matinee crowd.' },
  { id: 'chhota_hero', type: 'dvd', name: 'Chhota Hero (DVD)', pool: ['media'], blurb: 'Small kid, big heart.' },
  { id: 'bandook_2', type: 'dvd', name: 'Bandook 2 (DVD)', pool: ['media'], blurb: 'The sequel nobody asked for, everybody rented.' },
  { id: 'shaadi_season', type: 'dvd', name: 'Shaadi Season (DVD)', pool: ['media'], blurb: 'Five days, five hundred guests.' },
  { id: 'cartoon_mela', type: 'dvd', name: 'Cartoon Mela Vol. 3 (DVD)', pool: ['media'], blurb: 'Twelve episodes, Hindi dub.' },
  { id: 'cricket_deewane', type: 'dvd', name: 'Cricket Ke Deewane (DVD)', pool: ['media'], blurb: 'Gully to glory.' },
];
export const DVD_TEX = id => `dvd/${id}.png`;
// ---- Shelves: position [x,z], facing (rotY), length, and which pools they stock ----
export const SHELVES = [
  { pos: [3.85, -5], rotY: -Math.PI / 2, len: 8, pool: ['snack', 'toy'], force: 'phantom' },
  { pos: [-3.85, -7], rotY: Math.PI / 2, len: 5.4, pool: ['stationery', 'toy'] },
  { pos: [0, -9.95], rotY: 0, len: 7, pool: ['snack', 'stationery', 'media'] },
  { pos: [1.6, -6.8], rotY: Math.PI / 2, len: 4.4, pool: ['media', 'stationery'], force: 'spaceranger' },
  { pos: [1.6, -6.8], rotY: -Math.PI / 2, len: 4.4, pool: ['snack', 'toy'] },
];
// Walls/furniture the player can't walk through: [x0,x1,z0,z1]
export const COLLIDERS = [[-7, -1.4, -.35, .35], [1.4, 7, -.35, .35], [-4, .55, -4.4, -2.5], [3.4, 4, -9.7, -.8], [-4, -3.4, -9.7, -4.3], [1.2, 2.0, -9.1, -4.5], [-4.1, -2.3, 2.7, 4.1], [5.1, 5.5, 4.1, 4.7]];
// Lighting knobs (tune here; in-game press - and = to change exposure)
export const LIGHT = { exposure: 1.0, sun: 2.4, tube: 14, bulb: 10 };
