const { ethers } = require("ethers");
const { logger } = require("./logger.util");

class EventHandler {
  constructor(provider, address) {
    this.provider = provider;
    this.address = address;
    this.listeners = {}; // Track active listeners
    this.logger = logger;
  }

  startListening(eventSignature, fromBlock) {
    if (this.listeners[eventSignature]) {
      this.logger.info(`⚠️ Already listening for ${eventSignature}`);
      return false;
    }

    const eventTopic = ethers.id(eventSignature);
    const filter = {
      address: process.env.CONTRACT_ADDRESS,
      topics: [eventTopic],
      fromBlock,
    };
    const listener = async (log) => {
      this.logger.info(
        `✅ Event received: ${eventSignature} at block ${log.blockNumber}`
      );

      console.log(JSON.stringify(log));
      // Emit the event for handling in service
      this.onEvent(log, eventSignature);
    };

    this.provider.on(filter, listener);
    this.listeners[eventSignature] = { filter, listener };

    this.logger.info(
      `🔍 Started listening for ${eventSignature} from block ${fromBlock}`
    );
    return true;
  }

  stopListening(eventSignature) {
    if (!this.listeners[eventSignature]) {
      this.logger.info(`⚠️ No active listener for ${eventSignature}`);
      return false;
    }

    const { filter, listener } = this.listeners[eventSignature];
    this.provider.off(filter, listener);
    delete this.listeners[eventSignature];

    this.logger.info(`🛑 Stopped listening for ${eventSignature}`);
    return true;
  }

  onEvent(log, eventSignature) {
    // This will be overridden in the service to handle incoming events
  }
}

module.exports = EventHandler;
