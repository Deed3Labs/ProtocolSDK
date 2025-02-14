export default [
  {
    // Add your Subdivide contract ABI here
    // This should match your deployed contract's ABI
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "parts", type: "uint256" }
    ],
    name: "subdivide",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getSubdivisions",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  // Add other ABI entries...
] as const 