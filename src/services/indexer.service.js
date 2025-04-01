const Event = require("../db/models/Event");
const { ethers } = require("ethers");
const { logger } = require("../utils/logger.util");
const EventHandler = require("../utils/event.handler.util");

const provider = new ethers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/64cb812e6dc444549961e573b6e2f579"
);
const eventHandler = new EventHandler(provider, process.env.CONTRACT_ADDRESS);

eventHandler.onEvent = async (log) => {
  try {
    const event = {
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      data: {
        from: log.address,
        to: log.topics[2],
        value: log.data,
      },
      event: process.env.EVENT_SIGNATURE,
    };

    await Event.create(event);
    console.log(
      `Saved event: ${process.env.EVENT_SIGNATURE} at block ${log.blockNumber}`
    );
  } catch (err) {
    logger.info(err);
  }
};

async function startIndex(eventSignature, fromBlock = "latest") {
  return eventHandler.startListening(eventSignature, fromBlock);
}

async function stopIndex(eventSignature) {
  return eventHandler.stopListening(eventSignature);
}

async function retrieveEvents() {
  try {
    const eventList = await Event.find();
    return eventList;
  } catch (err) {
    logger.info(err);
  }
}

module.exports = { startIndex, stopIndex, retrieveEvents };
