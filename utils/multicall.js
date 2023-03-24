const { ethers } = require('ethers');
const { getMulticallContract } = require('./contractHelpers');

const multicall = async (abi, calls) => {
  try {
    const multi = getMulticallContract();
    const itf = new ethers.utils.Interface(abi);

    const calldata = calls.map((call) => [
      call.address.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ]);
    const { returnData } = await multi.aggregate(calldata);

    const res = returnData.map((call, i) =>
      itf.decodeFunctionResult(calls[i].name, call)
    );

    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return includes a boolean whether the call was successful e.g. [wasSuccessful, callResult]
 */
const multicallv2 = async (abi, calls, options) => {
  const { requireSuccess } = options;
  const multi = getMulticallContract();
  const itf = new ethers.utils.Interface(abi);

  const calldata = calls.map((call) => [
    call.address.toLowerCase(),
    itf.encodeFunctionData(call.name, call.params),
  ]);
  const returnData = await multi.tryAggregate(requireSuccess, calldata);
  const res = returnData.map((call, i) => {
    const [result, data] = call;
    return result ? itf.decodeFunctionResult(calls[i].name, data) : null;
  });

  return res;
};

module.exports.multicall = multicall;
module.exports.multicallv2 = multicallv2;
