module.exports = function (RED) {
  function TransferHiveEngineTokenNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    const SSC = require('sscjs');
    const ssc = new SSC('https://api.hive-engine.com/rpc');

    node.on('input', function (msg) {
      const globalContext = node.context().global;
      const credentials = globalContext.get('hiveEngineCredentials');

      if (!credentials) {
        node.error("No credentials found in global context");
        return;
      }

      const { username, privateKey } = credentials;
      const { recipient, symbol, amount, memo } = msg.payload;

      if (!username || !privateKey || !recipient || !symbol || !amount) {
        node.error("Missing required parameters: username, privateKey, recipient, symbol, amount");
        return;
      }

      const json = JSON.stringify({
        contractName: "tokens",
        contractAction: "transfer",
        contractPayload: {
          symbol: symbol,
          to: recipient,
          quantity: amount.toString(),
          memo: memo || ''
        }
      });

      const data = {
        id: 'ssc-mainnet-hive',
        json: json,
        required_auths: [username],
        required_posting_auths: []
      };

      hive.broadcast.customJson(privateKey, [], [username], 'ssc-mainnet-hive', json, function (err, result) {
        if (err) {
          node.error("Error broadcasting transfer: " + err);
        } else {
          msg.payload = result;
          node.send(msg);
        }
      });
    });
  }
  RED.nodes.registerType("hiveEngineTransferToken", TransferHiveEngineTokenNode);
};

