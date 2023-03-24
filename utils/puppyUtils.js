const BigNumber = require('bignumber.js')
const { multicall } = require('./multicall')
const { getPuppyStorageAddress: contractAddress } = require('./addressHelpers')
const storageAbi = require('../configs/abi/puppyStorage.json')

const getCount = async (account) => {
  const calls = [
    {
      address: contractAddress(),
      name: 'balanceOf',
      params: [account],
    },
  ]
  const [_balanceOf] = await multicall(storageAbi, calls)
  const balanceOf = new BigNumber(_balanceOf[0]._hex)

  return balanceOf.toNumber()
}

const getList = async (account) => {
  const count = await getCount(account)
  if (count === 0) return []

  const calls = []
  for (i = 0; i < count; i++) {
    calls.push({
      address: contractAddress(),
      name: 'tokenOfOwnerByIndex',
      params: [account, i],
    })
  }

  const _list = await multicall(storageAbi, calls)
  const list = _list.map((item) => {
    return new BigNumber(item[0]._hex).toString()
  })

  return list
}

const getInfo = async (id) => {
  const calls = [
    {
      address: contractAddress(),
      name: 'getTokenInformation',
      params: [id],
    },
  ]
  const [_info] = await multicall(storageAbi, calls)
  const info = {
    seasonNumber: new BigNumber(_info._seasonNumber._hex).toNumber(),
    ticketType: new BigNumber(_info._ticketType._hex).toNumber(),
    pack: new BigNumber(_info._pack._hex).toNumber(),
    ticketNumber: new BigNumber(_info._ticketNumber._hex).toNumber(),
  }
  return info
}

const getInfos = async (ids) => {
  const calls = ids.map((id) => {
    return {
      address: contractAddress(),
      name: 'getTokenInformation',
      params: [id],
    }
  })

  const results = await multicall(storageAbi, calls)
  const infos = results.map((result) => {
    return {
      seasonNumber: new BigNumber(result._seasonNumber._hex).toNumber(),
      ticketType: new BigNumber(result._ticketType._hex).toNumber(),
      pack: new BigNumber(result._pack._hex).toNumber(),
      ticketNumber: new BigNumber(result._ticketNumber._hex).toNumber(),
    }
  })
  return infos
}

module.exports.getCount = getCount
module.exports.getList = getList
module.exports.getInfo = getInfo
module.exports.getInfos = getInfos
