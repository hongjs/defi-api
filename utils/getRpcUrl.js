// Array of available nodes to connect to
const nodes = [
  process.env.REACT_APP_NODE_1,
  process.env.REACT_APP_NODE_2,
  process.env.REACT_APP_NODE_3,
];

const getNodeUrl = () => {
  const randomIndex = new Date().getTime() % 3;
  return nodes[randomIndex];
};

module.exports.getNodeUrl = getNodeUrl;
