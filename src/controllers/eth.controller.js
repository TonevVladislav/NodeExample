const { ethers } = require("ethers");
const {
  startIndex,
  stopIndex,
  retrieveEvents,
} = require("../services/indexer.service");
const {
  fetchTransactions,
  getContractCreationBlock,
} = require("../services/eth.service");
const { StatusCodes } = require("http-status-codes");
const { logger } = require("../utils/logger.util");

const getTransactions = async (req, res) => {
  try {
    const { address } = req.params;
    let { fromBlock, toBlock } = req.query;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: "Invalid Ethereum address" });
    }

    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

    fromBlock = fromBlock
      ? parseInt(fromBlock)
      : await getContractCreationBlock(address, provider);

    toBlock = toBlock ? parseInt(toBlock) : await provider.getBlockNumber();

    const transactions = await fetchTransactions(
      fromBlock,
      toBlock,
      provider,
      address
    );

    res.json({ transactions });
  } catch (err) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
};

const startIndexing = async (req, res) => {
  try {
    const { eventSignature, fromBlock } = req.body;

    if (!eventSignature) {
      return res.status(400).json({ error: "eventSignature is required" });
    }
    // Start indexing in the background
    const success = await startIndex(eventSignature, fromBlock).catch((err) => {
      logger.info(err);
    });
    if (success) {
      res.json({
        status: "started",
        contractAddress: process.env.CONTRACT_ADDRESS,
        eventSignature,
        startBlock: fromBlock || "latest",
      });
    }
  } catch (err) {
    logger.info(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await retrieveEvents();
    res.status(200).json({ events });
  } catch (err) {
    logger.info(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const stopIndexing = async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    if (stopIndex(process.env.EVENT_SIGNATURE, provider)) {
      res.json({
        status: "stopped",
        contractAddress: process.env.CONTRACT_ADDRESS,
        lastIndexedBlock: "latest",
      });
    }
  } catch (err) {
    logger.info(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getTransactions, startIndexing, getEvents, stopIndexing };
