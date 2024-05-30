module.exports = function (RED) {
  function VoteNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    const hive = require('@hiveio/hive-js');

    node.on('input', function (msg) {
      const globalContext = node.context().global;
      const credentials = globalContext.get('hiveCredentials');

      if (!credentials) {
        node.error("No credentials found in global context");
        return;
      }

      const { username, privateKey } = credentials;
      const { author, permlink, weight } = msg.payload;

      if (!username || !privateKey || !author || !permlink || !weight) {
        node.error("Missing required parameters: username, privateKey, author, permlink, weight");
        return;
      }

      const vote = {
        voter: username,
        author: author,
        permlink: permlink,
        weight: weight
      };

      hive.broadcast.vote(privateKey, vote.voter, vote.author, vote.permlink, vote.weight, function (err, result) {
        if (err) {
          node.error("Error broadcasting vote: " + err);
        } else {
          msg.payload = result;
          node.send(msg);
        }
      });
    });
  }
  RED.nodes.registerType("hiveVote", VoteNode);
};

