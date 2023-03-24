const RarityEnum = Object.freeze({ 1: 'X', 2: '2X', 3: 'R', 4: 'SR', 5: 'SSR', 6: 'Legendary' })
const SizeEnum = Object.freeze({
  small: {
    PATH: 'sm',
    WIDTH: 512,
    HEIGHT: 403,
    TROPHY_WIDTH: 40,
    TROPHY_TOP: 273,
    TROPHY_LEFT: 410,
    SHADOW_OFFSET: 2,
  },
  medium: {
    PATH: 'md',
    WIDTH: 1024,
    HEIGHT: 807,
    TROPHY_WIDTH: 80,
    TROPHY_TOP: 545,
    TROPHY_LEFT: 820,
    SHADOW_OFFSET: 4,
  },
  large: {
    PATH: 'lg',
    WIDTH: 1531,
    HEIGHT: 1206,
    TROPHY_WIDTH: 120,
    TROPHY_TOP: 813,
    TROPHY_LEFT: 1225,
    SHADOW_OFFSET: 8,
  },
})

const GodfaterBuffer = {
  sm: {
    '00': null,
    '01': null,
    '02': null,
    '03': null,
    '04': null,
    '05': null,
    '06': null,
    '07': null,
    '08': null,
    '09': null,
    10: null,
    11: null,
    11: null,
    13: null,
    14: null,
    15: null,
  },
  md: {
    '00': null,
    '01': null,
    '02': null,
    '03': null,
    '04': null,
    '05': null,
    '06': null,
    '07': null,
    '08': null,
    '09': null,
    10: null,
    11: null,
    11: null,
    13: null,
    14: null,
    15: null,
  },
  lg: {
    '00': null,
    '01': null,
    '02': null,
    '03': null,
    '04': null,
    '05': null,
    '06': null,
    '07': null,
    '08': null,
    '09': null,
    10: null,
    11: null,
    11: null,
    13: null,
    14: null,
    15: null,
  },
}

const PuppyBuffer = {
  sm: {
    '00': null,
    '01': null,
    '02': null,
    '03': null,
    '04': null,
    '05': null,
    '06': null,
    '07': null,
    '08': null,
    '09': null,
    10: null,
    11: null,
    11: null,
    13: null,
    14: null,
    15: null,
  },
  md: {
    '00': null,
    '01': null,
    '02': null,
    '03': null,
    '04': null,
    '05': null,
    '06': null,
    '07': null,
    '08': null,
    '09': null,
    10: null,
    11: null,
    11: null,
    13: null,
    14: null,
    15: null,
  },
  lg: {
    '00': null,
    '01': null,
    '02': null,
    '03': null,
    '04': null,
    '05': null,
    '06': null,
    '07': null,
    '08': null,
    '09': null,
    10: null,
    11: null,
    11: null,
    13: null,
    14: null,
    15: null,
  },
}

const TrophyBuffer = {
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
}

function romanize(num) {
  if (num === 0) return '0'
  if (!+num) return false

  const digits = String(+num).split('')
  const key = [
    '',
    'C',
    'CC',
    'CCC',
    'CD',
    'D',
    'DC',
    'DCC',
    'DCCC',
    'CM',
    '',
    'X',
    'XX',
    'XXX',
    'XL',
    'L',
    'LX',
    'LXX',
    'LXXX',
    'XC',
    '',
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
  ]

  let roman = ''
  let i = 3
  while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman
  return Array(+digits.join('') + 1).join('M') + roman
}

module.exports.SizeEnum = SizeEnum
module.exports.RarityEnum = RarityEnum
module.exports.GodfaterBuffer = GodfaterBuffer
module.exports.PuppyBuffer = PuppyBuffer
module.exports.TrophyBuffer = TrophyBuffer
module.exports.romanize = romanize
