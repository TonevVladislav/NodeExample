const axios = require("axios");
const { ethers } = require("ethers");

async function getContractABI(contractAddress) {
  const apiKey = process.env.API_KEY;
  const url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;

  const response = await axios.get(url);
  const abi = JSON.parse(response.data.result);
  return abi;
}

async function getEventSignatures(contractAddress) {
  const abi = await getContractABI(contractAddress);

  const eventSignature = abi
    .filter((item) => item.type === "event")
    .map((event) => {
      const inputs = event.inputs.map((input) => input.type).join(",");
      const signature = `${event.name}(${inputs})`;
      return { name: event.name, signature, topicHash: ethers.id(signature) };
    });
  return eventSignature;
}

module.exports = { getEventSignatures, getContractABI };
