module.exports = function (RED) {
  function AuthenticationHiveEngineNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    const SSC = require('sscjs');
    const ssc = new SSC('https://api.hive-engine.com/rpc');

    node.on('input', function (msg) {
      const { username, privateKey } = msg.payload;

      if (!username || !privateKey) {
        node.error("Missing required parameters: username, privateKey");
        return;
      }

      // Store credentials in global context
      const globalContext = node.context().global;
      globalContext.set('hiveEngineCredentials', { username, privateKey });

      msg.payload = { authenticated: true };
      node.send(msg);
    });
  }
  RED.nodes.registerType("hiveEngineAuthenticate", AuthenticationHiveEngineNode);
};

