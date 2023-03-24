const { addresses } = require('../configs/constants/contracts')

const getMulticallAddress = () => {
  return addresses.mulltiCall
}

const getGodfatherStorageAddress = () => {
  return addresses.godfatherStorage
}

const getPuppyStorageAddress = () => {
  return addresses.puppyStorage
}

module.exports.getMulticallAddress = getMulticallAddress
module.exports.getGodfatherStorageAddress = getGodfatherStorageAddress
module.exports.getPuppyStorageAddress = getPuppyStorageAddress
