module.exports = function (RED) {
  function ListHiveEngineTokensNode(config) {
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

      const { username: defaultUsername } = credentials;
      const { username, symbol } = msg.payload;

      const userToQuery = username || defaultUsername;

      if (!userToQuery) {
        node.error("No username provided or found in global context");
        return;
      }

      const query = { account: userToQuery };
      if (symbol) {
        query.symbol = symbol;
      }

      ssc.find('tokens', 'balances', query, 1000, 0, [], (err, result) => {
        if (err) {
          node.error("Error fetching tokens: " + err);
          return;
        }

        msg.payload = result;
        node.send(msg);
      });
    });
  }
  RED.nodes.registerType("hiveEngineListTokens", ListHiveEngineTokensNode);
};

