const { ethers } = require('ethers');
const { simpleRpcProvider } = require('./providers');
const multiCallAbi = require('../configs/abi/multicall.json');
const godfatherStorageAbi = require('../configs/abi/godfatherStorage.json');
const {
  getMulticallAddress,
  getPuppyStorageAddress,
  getGodfatherStorageAddress,
} = require('./addressHelpers');

const getContract = (abi, address, signer) => {
  const signerOrProvider = signer ? signer : simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

const getMulticallContract = (signer) => {
  return getContract(multiCallAbi, getMulticallAddress(), signer);
};

const getGodfatherContract = (signer) => {
  return getContract(godfatherStorageAbi, getGodfatherStorageAddress(), signer);
};

const getPuppyContract = (signer) => {
  return getContract(godfatherStorageAbi, getPuppyStorageAddress(), signer);
};

module.exports.getMulticallContract = getMulticallContract;
module.exports.getGodfatherContract = getGodfatherContract;
module.exports.getPuppyContract = getPuppyContract;
