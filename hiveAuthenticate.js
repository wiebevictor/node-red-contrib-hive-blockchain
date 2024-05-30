module.exports = function (RED) {
  function AuthenticateNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    const hive = require('@hiveio/hive-js');

    node.on('input', function (msg) {
      const { username, privateKey } = msg.payload;

      if (!username || !privateKey) {
        node.error("Missing required parameters: username, privateKey");
        return;
      }

      hive.api.getAccounts([username], function(err, result) {
        if (err) {
          node.error("Error fetching account: " + err);
          return;
        }

        if (result.length === 0) {
          node.error("Account not found");
          return;
        }

        const account = result[0];
        const pubKey = account.posting.key_auths[0][0];
        const isValid = hive.auth.wifIsValid(privateKey, pubKey);

        if (isValid) {
          // Store credentials in global context
          const globalContext = node.context().global;
          globalContext.set('hiveCredentials', { username, privateKey });

          msg.payload = { authenticated: true, account: account };
        } else {
          msg.payload = { authenticated: false };
        }

        node.send(msg);
      });
    });
  }
  RED.nodes.registerType("hiveAuthenticate", AuthenticateNode);
};

