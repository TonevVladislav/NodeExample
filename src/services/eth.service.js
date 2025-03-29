async function fetchTransactions(fromBlock, toBlock, provider, address) {
  console.log(
    `Fetching transactions for ${address} from block ${fromBlock} to ${toBlock}`
  );
  const transactions = [];
  // Loop through blocks to fetch transactions
  for (let i = fromBlock; i <= toBlock; i++) {
    const block = await provider.getBlock(i);
    if (block && block.transactions.length > 0) {
      for (const txHash of block.transactions) {
        const tx = await provider.getTransaction(txHash);
        if (tx && (tx.from === address || tx.to === address)) {
          transactions.push(tx);
        }
      }
    }
  }
  return transactions;
}

async function getContractCreationBlock(address, provider) {
  const txHistory = await provider.getHistory(address);
  return txHistory.length ? txHistory[0].blockNumber : 0;
}

module.exports = {
  fetchTransactions,
  getContractCreationBlock,
};
