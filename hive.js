module.exports = function (RED) {
  function HiveNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    const hive = require('@hiveio/hive-js');

    hive.api.setOptions({ url: 'https://api.hive.blog' });

    let isRunning = false;
    let lastBlockNumber = node.context().get('lastBlockNumber') || 0;

    async function getLatestBlockNumber() {
      return new Promise((resolve, reject) => {
        hive.api.getDynamicGlobalProperties((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.head_block_number);
          }
        });
      });
    }

    async function fetchNewBlocks() {
      try {
        const latestBlockNumber = await getLatestBlockNumber();
        if (lastBlockNumber === 0) {
          lastBlockNumber = latestBlockNumber;
        }

        for (let i = lastBlockNumber + 1; i <= latestBlockNumber; i++) {
          hive.api.getBlock(i, (err, result) => {
            if (err) {
              node.error("Error fetching block: " + err);
            } else {
              const msg = { payload: result };
              node.send(msg);
            }
          });
        }

        lastBlockNumber = latestBlockNumber;
        node.context().set('lastBlockNumber', lastBlockNumber); // Persist the last block number
      } catch (err) {
        node.error("Error in fetchNewBlocks: " + err);
      }
    }

    function startFetchingBlocks() {
      if (!isRunning) {
        isRunning = true;
        fetchNewBlocks();
        node.interval = setInterval(fetchNewBlocks, 3000); // Fetch new blocks every 3 seconds
      }
    }

    function stopFetchingBlocks() {
      if (isRunning) {
        isRunning = false;
        clearInterval(node.interval);
      }
    }

    node.on('input', function (msg) {
      if (msg.payload === 'start') {
        startFetchingBlocks();
      } else if (msg.payload === 'stop') {
        stopFetchingBlocks();
      }
    });

    node.on('close', function () {
      stopFetchingBlocks();
    });
  }
  RED.nodes.registerType("hive", HiveNode);
};

