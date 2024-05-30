module.exports = function (RED) {
  function CreatePostNode(config) {
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
      const { title, body, tags, permlink, maxAcceptedPayout, percentHbd, allowVotes, allowCurationRewards, beneficiaries } = msg.payload;

      if (!username || !privateKey || !title || !body || !tags || !permlink) {
        node.error("Missing required parameters: username, privateKey, title, body, tags, permlink");
        return;
      }

      const postMetadata = {
        tags: tags,
        app: 'node-red',
      };

      const post = {
        author: username,
        title: title,
        body: body,
        parent_author: '',
        parent_permlink: tags[0], // Use the first tag as the permlink for the post
        permlink: permlink,
        json_metadata: JSON.stringify(postMetadata),
      };

      const commentOptions = {
        author: username,
        permlink: permlink,
        max_accepted_payout: maxAcceptedPayout || '1000000.000 HBD',
        percent_hbd: percentHbd || 10000,
        allow_votes: allowVotes !== false,
        allow_curation_rewards: allowCurationRewards !== false,
        extensions: []
      };

      if (beneficiaries && beneficiaries.length > 0) {
        commentOptions.extensions.push([0, { beneficiaries }]);
      }

      hive.broadcast.comment(
        privateKey,
        post.parent_author,
        post.parent_permlink,
        post.author,
        post.permlink,
        post.title,
        post.body,
        post.json_metadata,
        function (err, result) {
          if (err) {
            node.error("Error broadcasting post: " + err);
            return;
          }

          // Broadcast the comment options
          hive.broadcast.commentOptions(
            privateKey,
            commentOptions.author,
            commentOptions.permlink,
            commentOptions.max_accepted_payout,
            commentOptions.percent_hbd,
            commentOptions.allow_votes,
            commentOptions.allow_curation_rewards,
            commentOptions.extensions,
            function (err, result) {
              if (err) {
                node.error("Error broadcasting comment options: " + err);
              } else {
                msg.payload = result;
                node.send(msg);
              }
            }
          );
        }
      );
    });
  }
  RED.nodes.registerType("hivePost", CreatePostNode);
};

