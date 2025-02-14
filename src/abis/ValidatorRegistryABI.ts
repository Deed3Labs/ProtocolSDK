export default [
  {
    inputs: [{ internalType: "address", name: "validator", type: "address" }],
    name: "registerValidator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "validator", type: "address" }],
    name: "isValidator",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  }
] as const 