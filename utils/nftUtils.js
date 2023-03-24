const toNumberHex = (ticketNumber, digit) => {
  const hex = ticketNumber.toString(16).padStart(digit, '0')
  const numberText = []
  for (let i = 0; i < hex.length; i++) {
    numberText.push(parseInt(hex[i], 16))
    numberText.push('-')
  }
  numberText.splice(-1, 1)
  return numberText.join('')
}

module.exports.toNumberHex = toNumberHex
