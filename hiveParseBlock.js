module.exports = function (RED) {
  function ParseBlockNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on('input', function (msg) {
      const block = msg.payload;
      if (block && block.transactions) {
        block.transactions.forEach(transaction => {
          transaction.operations.forEach(operation => {
            const operationType = operation[0];
            const operationData = operation[1];

            // Create a new message for each operation
            const operationMsg = {
              payload: operationData,
              operationType: operationType,
              transactionId: transaction.transaction_id
            };

            // Send the new message
            node.send(operationMsg);
          });
        });
      } else {
        node.error("Invalid block data");
      }
    });
  }
  RED.nodes.registerType("hiveParseBlock", ParseBlockNode);
};

