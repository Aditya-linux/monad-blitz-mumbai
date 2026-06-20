// Auto-generated contract ABIs and addresses
export const REPUTATION_REGISTRY_ADDRESS = "0x52D3a43152297aa8fC0d5404BC1bF87794E90566" as const;

export const REPUTATION_REGISTRY_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_identityRegistry",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "agentId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "reviewer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "int128",
        "name": "score",
        "type": "int128"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "decimals",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tags",
        "type": "string"
      }
    ],
    "name": "NewFeedback",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "agentFeedback",
    "outputs": [
      {
        "internalType": "address",
        "name": "reviewer",
        "type": "address"
      },
      {
        "internalType": "int128",
        "name": "score",
        "type": "int128"
      },
      {
        "internalType": "uint8",
        "name": "decimals",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "tags",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "feedbackURI",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "contentHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "agentFeedbackCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "agentTotalScore",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_agentId",
        "type": "uint256"
      }
    ],
    "name": "getAllFeedback",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "reviewer",
            "type": "address"
          },
          {
            "internalType": "int128",
            "name": "score",
            "type": "int128"
          },
          {
            "internalType": "uint8",
            "name": "decimals",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "tags",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "feedbackURI",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "contentHash",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct ERC8004ReputationRegistry.Feedback[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_agentId",
        "type": "uint256"
      }
    ],
    "name": "getAverageScore",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_agentId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "getFeedback",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "reviewer",
            "type": "address"
          },
          {
            "internalType": "int128",
            "name": "score",
            "type": "int128"
          },
          {
            "internalType": "uint8",
            "name": "decimals",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "tags",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "feedbackURI",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "contentHash",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct ERC8004ReputationRegistry.Feedback",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_agentId",
        "type": "uint256"
      }
    ],
    "name": "getFeedbackCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_agentId",
        "type": "uint256"
      },
      {
        "internalType": "int128",
        "name": "_score",
        "type": "int128"
      },
      {
        "internalType": "uint8",
        "name": "_decimals",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "_tags",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_feedbackURI",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "_contentHash",
        "type": "bytes32"
      }
    ],
    "name": "giveFeedback",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "identityRegistry",
    "outputs": [
      {
        "internalType": "contract IERC8004Identity",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
