# node-red-contrib-hive-blockchain

A Node-RED node to connect to the Hive blockchain, including Hive-Engine integration. This package allows you to interact with Hive and Hive-Engine, including authenticating, posting, voting, listing tokens, and transferring tokens.

## Installation

To install this Node-RED node, run the following command in your Node-RED user directory (typically `~/.node-red`):

```bash
npm install node-red-contrib-hive-custom
```

## Nodes Included

"hiveParseBlock": Parses a block to determine the transaction types
"hiveVote": Adds a vote onto a post
"hiveAuthenticate": Authenticates using the posting key
"hivePost": Creates a post
"hiveComment": Adds a comment to a post
"hiveEngineAuthenticate": Authenticates to the hive-engine side chain using the posting key
"hiveEngineListTokens": Lists a users tokens
"hiveEngineTransferToken": Transfers a token from the authenticated user to another user

This is only a small subset of all the possible features available on the blockchain and on the hive-engine blockchain

## Hive Blockchain

### Purpose:
The `authenticateHive` node authenticates the user and stores the credentials in the global context for use by other nodes.

#### Inputs:
- `username`: The Hive account username.
- `privateKey`: The private *posting* key for the Hive account.

#### Example Payload:
```json
{
  "username": "your_username",
  "privateKey": "your_private_posting_key"
}
```

#### Example Flow:
```json
[
    {
        "id": "12345678.abcd",
        "type": "inject",
        "z": "a1b2c3d4.e5f6",
        "name": "Inject Auth Data",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "{\"username\": \"your_username\", \"privateKey\": \"your_private_posting_key\"}",
        "payloadType": "json",
        "x": 150,
        "y": 80,
        "wires": [
            [
                "9abcdef0.1234"
            ]
        ]
    },
    {
        "id": "9abcdef0.1234",
        "type": "hiveAuthenticate",
        "z": "a1b2c3d4.e5f6",
        "name": "Authenticate Node",
        "x": 400,
        "y": 80,
        "wires": [
            [
                "debug_auth"
            ]
        ]
    },
    {
        "id": "debug_auth",
        "type": "debug",
        "z": "a1b2c3d4.e5f6",
        "name": "Debug Auth Result",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "statusVal": "",
        "statusType": "auto",
        "x": 650,
        "y": 80,
        "wires": []
    }
]
```

### Create Post Node

#### Purpose:
The `hivePost` node creates a new post on the Hive blockchain using the authenticated credentials stored in the global context.

#### Inputs:
- `title`: The title of the post.
- `body`: The body of the post, written in markdown.
- `tags`: An array of tags for the post.
- `permlink`: A unique identifier for the post (permalink).
- `maxAcceptedPayout`: (Optional) The maximum accepted payout for the post.
- `percentHbd`: (Optional) The percentage of the payout in HBD.
- `allowVotes`: (Optional) Whether to allow votes on the post.
- `allowCurationRewards`: (Optional) Whether to allow curation rewards.
- `beneficiaries`: (Optional) An array of beneficiaries and their weight.

#### Example Payload:
```json
{
  "title": "My First Markdown Post",
  "body": "# My First Markdown Post\n\nThis is the first paragraph of my post.\n\n## Subheading\n\nThis is the second paragraph.\n\n- This is a list item\n- Another list item\n\n**Bold text** and _italic text_.",
  "tags": ["hive", "markdown", "blog"],
  "permlink": "my-first-markdown-post",
  "maxAcceptedPayout": "1000.000 HBD",
  "percentHbd": 5000,
  "allowVotes": true,
  "allowCurationRewards": true,
  "beneficiaries": [
    { "account": "beneficiary1", "weight": 5000 },
    { "account": "beneficiary2", "weight": 5000 }
  ]
}
```

#### Example Flow:
```json
[
    {
        "id": "abcd1234efgh5678",
        "type": "inject",
        "z": "a1b2c3d4.e5f6",
        "name": "Inject Post Data",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "{}",
        "payloadType": "json",
        "x": 150,
        "y": 180,
        "wires": [
            [
                "1234abcd5678efgh"
            ]
        ]
    },
    {
        "id": "1234abcd5678efgh",
        "type": "function",
        "z": "a1b2c3d4.e5f6",
        "name": "Set Post Content",
        "func": "msg.payload = {\n    title: \"My First Markdown Post\",\n    body: `# My First Markdown Post\n\nThis is the first paragraph of my post.\n\n## Subheading\n\nThis is the second paragraph.\n\n- This is a list item\n- Another list item\n\n**Bold text** and _italic text_.`,\n    tags: [\"hive\", \"markdown\", \"blog\"],\n    permlink: \"my-first-markdown-post\",\n    maxAcceptedPayout: \"1000.000 HBD\",\n    percentHbd: 5000,\n    allowVotes: true,\n    allowCurationRewards: true,\n    beneficiaries: [\n        { account: \"beneficiary1\", weight: 5000 },\n        { account: \"beneficiary2\", weight: 5000 }\n    ]\n};\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 350,
        "y": 180,
        "wires": [
            [
                "create_post_node"
            ]
        ]
    },
    {
        "id": "create_post_node",
        "type": "hivePost",
        "z": "a1b2c3d4.e5f6",
        "name": "Create Post Node",
        "x": 550,
        "y": 180,
        "wires": [
            [
                "debug_post"
            ]
        ]
    },
    {
        "id": "debug_post",
        "type": "debug",
        "z": "a1b2c3d4.e5f6",
        "name": "Debug Post Result",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "statusVal": "",
        "statusType": "auto",
        "x": 750,
        "y": 180,
        "wires": []
    }
]
```

### Create Comment Node

#### Purpose:
The `hiveComment` node adds a comment to an existing post on the Hive blockchain using the authenticated credentials stored in the global context.

#### Inputs:
- `parentAuthor`: The author of the post to comment on.
- `parentPermlink`: The permalink of the post to comment on.
- `body`: The body of the comment, written in markdown.
- `permlink`: A unique identifier for the comment (permalink).

#### Example Payload:
```json
{
  "parentAuthor": "parent_author",
  "parentPermlink": "parent_permlink",
  "body": "This is a comment on the post.",
  "permlink": "comment-permlink"
}
```

#### Example Flow:
```json
[
    {
        "id": "12345678.abcd",
        "type": "inject",
        "z": "a1b2c3d4.e5f6",
        "name": "Inject Comment Data",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "{\"parentAuthor\": \"parent_author\", \"parentPermlink\": \"parent_permlink\", \"body\": \"This is a comment on the post.\", \"permlink\": \"comment-permlink\"}",
        "payloadType": "json",
        "x": 150,
        "y": 80,
        "wires": [
            [
                "9abcdef0.1234"
            ]
        ]
    },
    {
        "id": "9abcdef0.1234",
        "type": "hiveComment",
        "z": "a1b2c3d4.e5f6",
        "name": "Create Comment Node",
        "x": 400,
        "y": 80,
        "wires": [
            [
                "34567890.cdef"
            ]
        ]
    },
    {
        "id": "34567890.cdef",
        "type": "debug",
        "z": "a1b2c3d4.e5f6",
        "name": "Debug Comment Result",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "statusVal": "",
        "statusType": "auto",
        "x": 650,


        "y": 80,
        "wires": []
    }
]
```

### Vote Node

#### Purpose:
The `hiveVote` node casts a vote on a post or comment on the Hive blockchain using the authenticated credentials stored in the global context.

#### Inputs:
- `author`: The author of the post or comment to vote on.
- `permlink`: The permalink of the post or comment to vote on.
- `weight`: The weight of the vote (usually between -10000 and 10000).

#### Example Payload:
```json
{
  "author": "author_of_post_or_comment",
  "permlink": "permlink_of_post_or_comment",
  "weight": 10000
}
```

#### Example Flow:
```json
[
    {
        "id": "abcd1234efgh5678",
        "type": "inject",
        "z": "a1b2c3d4.e5f6",
        "name": "Inject Vote Data",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "{\"author\": \"author_of_post_or_comment\", \"permlink\": \"permlink_of_post_or_comment\", \"weight\": 10000}",
        "payloadType": "json",
        "x": 150,
        "y": 80,
        "wires": [
            [
                "9abcdef0.1234"
            ]
        ]
    },
    {
        "id": "9abcdef0.1234",
        "type": "hiveVote",
        "z": "a1b2c3d4.e5f6",
        "name": "Vote Node",
        "x": 400,
        "y": 80,
        "wires": [
            [
                "34567890.cdef"
            ]
        ]
    },
    {
        "id": "34567890.cdef",
        "type": "debug",
        "z": "a1b2c3d4.e5f6",
        "name": "Debug Vote Result",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "statusVal": "",
        "statusType": "auto",
        "x": 650,
        "y": 80,
        "wires": []
    }
]
```

### Summary

1. **Authenticate Node**: Authenticates the user and stores the credentials in the global context.
2. **Create Post Node**: Creates a new post using the authenticated credentials.
3. **Create Comment Node**: Adds a comment to an existing post using the authenticated credentials.
4. **Vote Node**: Casts a vote on a post or comment using the authenticated credentials.

Each node uses the global context to retrieve the authentication credentials stored by the `authenticate` node, ensuring seamless integration and secure handling of private keys. 

## HiveEngine SideChain

### 1. Authentication HiveEngine Node

#### Purpose:
The `hiveEngineAuthenticate` node authenticates the user with Hive-Engine and stores the credentials in the global context for use by other nodes.

#### Inputs (in `msg.payload`):
- `username`: The Hive account username.
- `privateKey`: The *private* posting key for the Hive account.

#### Example Payload:
```json
{
  "username": "your_username",
  "privateKey": "your_private_posting_key"
}
```

#### Example Flow:
```json
[
    {
        "id": "12345678.abcd",
        "type": "inject",
        "name": "Inject Auth Data",
        "props": [
            {
                "p": "payload"
            }
        ],
        "payload": "{\"username\": \"your_username\", \"privateKey\": \"your_private_posting_key\"}",
        "payloadType": "json",
        "x": 150,
        "y": 80,
        "wires": [
            [
                "hiveEngineAuthenticate"
            ]
        ]
    },
    {
        "id": "hiveEngineAuthenticate",
        "type": "hiveEngineAuthenticate",
        "name": "Authentication HiveEngine Node",
        "x": 400,
        "y": 80,
        "wires": [
            [
                "debugAuth"
            ]
        ]
    },
    {
        "id": "debugAuth",
        "type": "debug",
        "name": "Debug Auth Result",
        "active": true,
        "tosidebar": true,
        "complete": "true",
        "x": 650,
        "y": 80,
        "wires": []
    }
]
```

### 2. List HiveEngine Tokens Node

#### Purpose:
The `hiveEngineListTokens` node lists the Hive-Engine tokens for a specified user. If no username is specified, it lists the tokens for the authenticated user. Optionally, a specific token symbol can be provided to list only that token.

#### Inputs (in `msg.payload`):
- `username` (optional): The username of the account to list tokens for.
- `symbol` (optional): The symbol of the specific token to list.

#### Example Payloads:
- List tokens for authenticated user:
  ```json
  {}
  ```
- List tokens for a specific user:
  ```json
  {
    "username": "specific_user"
  }
  ```
- List a specific token for the authenticated user:
  ```json
  {
    "symbol": "TOKEN"
  }
  ```
- List a specific token for a specific user:
  ```json
  {
    "username": "specific_user",
    "symbol": "TOKEN"
  }
  ```

#### Example Flow:
```json
[
    {
        "id": "12345678.abcd",
        "type": "inject",
        "name": "List Tokens for Default User",
        "props": [
            {
                "p": "payload"
            }
        ],
        "payload": "{}",
        "payloadType": "json",
        "x": 150,
        "y": 80,
        "wires": [
            [
                "listTokens"
            ]
        ]
    },
    {
        "id": "98765432.efgh",
        "type": "inject",
        "name": "List Tokens for Specific User",
        "props": [
            {
                "p": "payload"
            }
        ],
        "payload": "{\"username\": \"specific_user\"}",
        "payloadType": "json",
        "x": 150,
        "y": 140,
        "wires": [
            [
                "listTokens"
            ]
        ]
    },
    {
        "id": "13579abc.def0",
        "type": "inject",
        "name": "List Specific Token for Default User",
        "props": [
            {
                "p": "payload"
            }
        ],
        "payload": "{\"symbol\": \"TOKEN\"}",
        "payloadType": "json",
        "x": 150,
        "y": 200,
        "wires": [
            [
                "listTokens"
            ]
        ]
    },
    {
        "id": "24680abc.def0",
        "type": "inject",
        "name": "List Specific Token for Specific User",
        "props": [
            {
                "p": "payload"
            }
        ],
        "payload": "{\"username\": \"specific_user\", \"symbol\": \"TOKEN\"}",
        "payloadType": "json",
        "x": 150,
        "y": 260,
        "wires": [
            [
                "listTokens"
            ]
        ]
    },
    {
        "id": "listTokens",
        "type": "hiveEngineListTokens",
        "name": "List HiveEngine Tokens Node",
        "x": 400,
        "y": 170,
        "wires": [
            [
                "debugTokens"
            ]
        ]
    },
    {
        "id": "debugTokens",
        "type": "debug",
        "name": "Debug Tokens Result",
        "active": true,
        "tosidebar": true,
        "complete": "true",
        "x": 650,
        "y": 170,
        "wires": []
    }
]
```

### 3. Transfer HiveEngine Token Node

#### Purpose:
The `hiveEngineTransferToken` node transfers a Hive-Engine token from the authenticated user to a specified recipient.

#### Inputs (in `msg.payload`):
- `recipient`: The username of the recipient.
- `symbol`: The symbol of the token to transfer.
- `amount`: The amount of the token to transfer.
- `memo` (optional): A memo for the transfer.

#### Example Payload:
```json
{
  "recipient": "recipient_user",
  "symbol": "TOKEN",
  "amount": "10.0",
  "memo": "Test transfer"
}
```

#### Example Flow:
```json
[
    {
        "id": "12345678.abcd",
        "type": "inject",
        "name": "Inject Transfer Data",
        "props": [
            {
                "p": "payload"
            }
        ],
        "payload": "{\"recipient\": \"recipient_user\", \"symbol\": \"TOKEN\", \"amount\": \"10.0\", \"memo\": \"Test transfer\"}",
        "payloadType": "json",
        "x": 150,
        "y": 80,
        "wires": [
            [
                "transferToken"
            ]
        ]
    },
    {
        "id": "transferToken",
        "type": "hiveEngineTransferToken",
        "name": "Transfer HiveEngine Token Node",
        "x": 400,
        "y": 80,
        "wires": [
            [
                "debugTransfer"
            ]
        ]
    },
    {
        "id": "debugTransfer",
        "type": "debug",
        "name": "Debug Transfer Result",
        "active": true,
        "tosidebar": true,
        "complete": "true",
        "x": 650,
        "y": 80,
        "wires": []
    }
]
```

### Summary

1. **Authentication HiveEngine Node**: Authenticates the user with Hive-Engine and stores the credentials in the global context.
2. **List HiveEngine Tokens Node**: Lists the Hive-Engine tokens for a specified user, or the authenticated user if no username is specified. Optionally, lists a specific token.
3. **Transfer HiveEngine Token Node**: Transfers a Hive-Engine token from the authenticated user to a specified recipient.


