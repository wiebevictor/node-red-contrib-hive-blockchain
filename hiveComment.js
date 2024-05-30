module.exports = function (RED) {
  function CreateCommentNode(config) {
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
      const { parentAuthor, parentPermlink, body, permlink } = msg.payload;

      if (!username || !privateKey || !parentAuthor || !parentPermlink || !body || !permlink) {
        node.error("Missing required parameters: username, privateKey, parentAuthor, parentPermlink, body, permlink");
        return;
      }

      const commentMetadata = {
        tags: [],
        app: 'node-red',
      };

      const comment = {
        author: username,
        body: body,
        parent_author: parentAuthor,
        parent_permlink: parentPermlink,
        permlink: permlink,
        json_metadata: JSON.stringify(commentMetadata),
      };

      hive.broadcast.comment(
        privateKey,
        comment.parent_author,
        comment.parent_permlink,
        comment.author,
        comment.permlink,
        '',
        comment.body,
        comment.json_metadata,
        function (err, result) {
          if (err) {
            node.error("Error broadcasting comment: " + err);
          } else {
            msg.payload = result;
            node.send(msg);
          }
        }
      );
    });
  }
  RED.nodes.registerType("hiveComment", CreateCommentNode);
};

