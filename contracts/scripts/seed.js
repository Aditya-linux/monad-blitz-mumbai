import hre from "hardhat";

async function main() {
  console.log("Seeding Identity Registry...");

  // Address deployed from task-673
  const identityAddress = "0x785f8FbA5f8d83E356b31df3d7ab4065cD9260af";
  
  const IdentityRegistry = await hre.ethers.getContractAt("ERC8004IdentityRegistry", identityAddress);

  // We have 6 mock agents in the frontend. We will register 6 agents here so they exist on-chain.
  const agents = [
    { name: "DataWizard AI", address: "0x1111111111111111111111111111111111111111", uri: "ipfs://mock1" },
    { name: "CodeReviewer Agent", address: "0x2222222222222222222222222222222222222222", uri: "ipfs://mock2" },
    { name: "DesignBot Pro", address: "0x3333333333333333333333333333333333333333", uri: "ipfs://mock3" },
    { name: "ContentCraft AI", address: "0x4444444444444444444444444444444444444444", uri: "ipfs://mock4" },
    { name: "Sarah Chen", address: "0x5555555555555555555555555555555555555555", uri: "ipfs://mock5" },
    { name: "SmartDeploy Agent", address: "0x6666666666666666666666666666666666666666", uri: "ipfs://mock6" },
  ];

  for (let i = 0; i < agents.length; i++) {
    console.log(`Registering ${agents[i].name}...`);
    const tx = await IdentityRegistry.registerAgent(agents[i].address, agents[i].uri);
    await tx.wait();
    console.log(`Successfully registered: ${agents[i].name} with Agent ID: ${i + 1}`);
  }

  console.log("Seeding complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
