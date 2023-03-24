const { ethers } = require('ethers');
const { getNodeUrl } = require('./getRpcUrl');

const url = getNodeUrl();
const simpleRpcProvider = new ethers.providers.JsonRpcProvider(url);

module.exports.simpleRpcProvider = simpleRpcProvider;
