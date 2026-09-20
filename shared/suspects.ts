/**
 * The lineup. Each suspect has structured `traits` (used to draw the avatar)
 * and a prose `profile` written in deliberately different vocabulary from the
 * trait names, so that matching "green scarf and round glasses" to
 * "moss muffler, wire spectacles" is a real language-understanding step for Jev.
 */

export type Hair = 'short' | 'long' | 'curly' | 'bald' | 'bun' | 'mohawk'
export type HairColor = 'black' | 'blonde' | 'red' | 'grey' | 'brown' | 'blue'
export type FacialHair = 'none' | 'beard' | 'moustache' | 'goatee'
export type Glasses = 'none' | 'round' | 'square' | 'sunglasses' | 'monocle'
export type Hat = 'none' | 'fedora' | 'beanie' | 'cap' | 'beret' | 'tophat'
export type Coat =
  | 'red' | 'green' | 'navy' | 'yellow' | 'purple' | 'brown'
  | 'black' | 'white' | 'orange' | 'teal' | 'pink' | 'grey'
export type Accessory =
  | 'none' | 'scarf' | 'bowtie' | 'necklace' | 'earring'
  | 'pipe' | 'headphones' | 'tie' | 'flower'
export type Skin = 'light' | 'tan' | 'brown' | 'dark'

export interface Traits {
  hair: Hair
  hairColor: HairColor
  facialHair: FacialHair
  glasses: Glasses
  hat: Hat
  coat: Coat
  accessory: Accessory
  skin: Skin
}

export interface Suspect {
  id: string
  name: string
  occupation: string
  traits: Traits
  profile: string
}

export const SUSPECTS: readonly Suspect[] = [
  {
    id: 'marlowe',
    name: 'Marlowe Finch',
    occupation: 'Jazz pianist',
    traits: { hair: 'bald', hairColor: 'black', facialHair: 'goatee', glasses: 'round', hat: 'none', coat: 'purple', accessory: 'bowtie', skin: 'dark' },
    profile: 'Shaven head, neat little chin-beard, small circular wire spectacles, plum-coloured velvet jacket with a bow at the collar. Dark complexion. No hat.',
  },
  {
    id: 'ines',
    name: 'Ines Calloway',
    occupation: 'Florist',
    traits: { hair: 'long', hairColor: 'red', facialHair: 'none', glasses: 'none', hat: 'beret', coat: 'green', accessory: 'flower', skin: 'light' },
    profile: 'Flowing copper hair spilling from under a slouched beret, moss-coloured overcoat, a single bloom pinned to the lapel. Fair skin, no eyewear.',
  },
  {
    id: 'desmond',
    name: 'Desmond Achebe',
    occupation: 'Dockworker',
    traits: { hair: 'short', hairColor: 'black', facialHair: 'beard', glasses: 'none', hat: 'beanie', coat: 'yellow', accessory: 'scarf', skin: 'dark' },
    profile: 'Full dark beard, close-cropped hair under a knitted woollen cap, mustard-coloured raincoat with a muffler wound round the neck. Deep brown skin, no glasses.',
  },
  {
    id: 'petra',
    name: 'Petra Lindqvist',
    occupation: 'Violinist',
    traits: { hair: 'bun', hairColor: 'blonde', facialHair: 'none', glasses: 'square', hat: 'none', coat: 'navy', accessory: 'necklace', skin: 'light' },
    profile: 'Pale flaxen hair pulled into a tight knot at the back, rectangular frames, midnight-blue tailored coat, a pendant on a fine chain. Bare-headed.',
  },
  {
    id: 'cornelius',
    name: 'Cornelius Vane',
    occupation: 'Antiques dealer',
    traits: { hair: 'short', hairColor: 'grey', facialHair: 'moustache', glasses: 'monocle', hat: 'tophat', coat: 'black', accessory: 'pipe', skin: 'light' },
    profile: 'Silver hair, waxed handlebar moustache, a single eyeglass on a cord, tall silk hat, sombre black frock coat, a pipe clamped in his teeth.',
  },
  {
    id: 'ruby',
    name: 'Ruby Okonkwo',
    occupation: 'Bike courier',
    traits: { hair: 'mohawk', hairColor: 'blue', facialHair: 'none', glasses: 'sunglasses', hat: 'none', coat: 'orange', accessory: 'headphones', skin: 'brown' },
    profile: 'Electric-blue mohawk, dark shades, no hat, hi-vis tangerine jacket, big headphones slung round the neck. Brown skin.',
  },
  {
    id: 'hal',
    name: 'Hal Brennan',
    occupation: 'Bartender',
    traits: { hair: 'curly', hairColor: 'brown', facialHair: 'beard', glasses: 'none', hat: 'none', coat: 'white', accessory: 'tie', skin: 'tan' },
    profile: 'Unruly chestnut curls, bushy beard, crisp white dinner jacket with a slim necktie. No hat, no specs. Olive skin.',
  },
  {
    id: 'yuki',
    name: 'Yuki Tanaka',
    occupation: 'Architect',
    traits: { hair: 'short', hairColor: 'black', facialHair: 'none', glasses: 'square', hat: 'none', coat: 'grey', accessory: 'earring', skin: 'light' },
    profile: 'Sharp cropped jet-black hair, thick-rimmed rectangular glasses, charcoal wool coat, a single hoop earring. Clean-shaven, no hat.',
  },
  {
    id: 'bartholomew',
    name: 'Bartholomew Quill',
    occupation: 'Librarian',
    traits: { hair: 'long', hairColor: 'grey', facialHair: 'moustache', glasses: 'round', hat: 'none', coat: 'brown', accessory: 'scarf', skin: 'light' },
    profile: 'Shoulder-length silver hair, drooping walrus moustache, small round spectacles, tweedy brown overcoat, tartan muffler. Hatless.',
  },
  {
    id: 'simone',
    name: 'Simone Duval',
    occupation: 'Racing driver',
    traits: { hair: 'short', hairColor: 'blonde', facialHair: 'none', glasses: 'sunglasses', hat: 'none', coat: 'red', accessory: 'none', skin: 'tan' },
    profile: 'Cropped platinum hair, aviator shades, scarlet leather jacket. No hat, no jewellery, no scarf. Sun-tanned.',
  },
  {
    id: 'grigor',
    name: 'Grigor Petrov',
    occupation: 'Chess grandmaster',
    traits: { hair: 'bald', hairColor: 'grey', facialHair: 'beard', glasses: 'none', hat: 'fedora', coat: 'teal', accessory: 'tie', skin: 'light' },
    profile: 'Hairless crown under a wide-brimmed felt hat, thick grey-flecked beard, teal suit jacket with a striped necktie. No glasses.',
  },
  {
    id: 'lottie',
    name: 'Lottie Marsh',
    occupation: 'Pastry chef',
    traits: { hair: 'curly', hairColor: 'red', facialHair: 'none', glasses: 'round', hat: 'beanie', coat: 'pink', accessory: 'necklace', skin: 'light' },
    profile: 'Ginger ringlets escaping from a knitted hat, round glasses, rose-pink coat, a locket at her throat. Freckled, fair skin.',
  },
]

export const NONE_ID = 'none'

export function suspectById(id: string): Suspect | undefined {
  return SUSPECTS.find((s) => s.id === id)
}
