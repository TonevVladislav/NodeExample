const { ethers } = require("ethers");
const Event = require("../db/models/Event");
const { logger } = require("../utils/logger.util");

const listener = async (log) => {
  console.log(JSON.stringify(log));
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
};

let activeListeners = {};

async function indexEvents(eventSignature, fromBlock = "latest", provider) {
  try {
    const eventTopic = ethers.id(eventSignature);
    const latestBlock = await provider.getBlockNumber();
    const startBlock = fromBlock === "latest" ? latestBlock : fromBlock;

    console.log(`Listening for ${eventSignature} from block ${startBlock}`);

    provider.on(
      {
        address: process.env.CONTRACT_ADDRESS,
        topics: [eventTopic],
        fromBlock: startBlock,
      },
      listener
    );
  } catch (err) {
    logger.info(err);
    return err;
  }
}

async function retrieveEvents() {
  try {
    const eventList = await Event.find();
    return eventList;
  } catch (err) {
    logger.info(err);
  }
}

function stopIndex(eventSignature, provider) {
  provider
    .removeListener("block", listener)
    .catch((err) => {
      logger.info(err);
    })
    .catch((err) => {
      console.log("err" + err);
    });
  console.log(`Stopped indexing for event: ${eventSignature}`);
  return true;
}

module.exports = { indexEvents, retrieveEvents, stopIndex };
