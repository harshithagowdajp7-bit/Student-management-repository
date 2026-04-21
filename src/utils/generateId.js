const generateId = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

module.exports = generateId;