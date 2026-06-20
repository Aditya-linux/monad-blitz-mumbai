import hre from "hardhat";

async function main() {
  console.log("Starting deployment to Monad Testnet...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. Deploy MockUSDC
  console.log("Deploying MockUSDC...");
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log(`MockUSDC deployed to: ${usdcAddress}`);

  // 2. Deploy Identity Registry
  console.log("Deploying IdentityRegistry...");
  const IdentityRegistry = await hre.ethers.getContractFactory("ERC8004IdentityRegistry");
  const identity = await IdentityRegistry.deploy();
  await identity.waitForDeployment();
  const identityAddress = await identity.getAddress();
  console.log(`IdentityRegistry deployed to: ${identityAddress}`);

  // 3. Deploy Reputation Registry
  console.log("Deploying ReputationRegistry...");
  const ReputationRegistry = await hre.ethers.getContractFactory("ERC8004ReputationRegistry");
  const registry = await ReputationRegistry.deploy(identityAddress);
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log(`ReputationRegistry deployed to: ${registryAddress}`);

  // 4. Deploy Escrow
  console.log("Deploying PayAgentEscrow...");
  const PayAgentEscrow = await hre.ethers.getContractFactory("PayAgentEscrow");
  const escrow = await PayAgentEscrow.deploy(
    usdcAddress,
    identityAddress,
    registryAddress,
    deployer.address, // Treasury
    deployer.address  // Dispute Resolver
  );
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log(`PayAgentEscrow deployed to: ${escrowAddress}`);

  console.log("\n=================================");
  console.log("Deployment Complete!");
  console.log("USDC Token:", usdcAddress);
  console.log("Identity Registry:", identityAddress);
  console.log("Reputation Registry:", registryAddress);
  console.log("Escrow Contract:", escrowAddress);
  console.log("=================================\n");
  
  console.log("Verify Escrow on Explorer:");
  console.log(`https://testnet.monadexplorer.com/address/${escrowAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
