// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const initBalance = ethers.utils.parseEther("1"); // Change this to your desired initial balance
  const minimumDeposit = ethers.utils.parseEther("0.1"); // Change this to your desired minimum deposit amount
  const fixedAmount = ethers.utils.parseEther("10"); // Change this to your desired fixed amount
  const maxDailyWithdrawal = ethers.utils.parseEther("1"); // Change this to your desired maximum daily withdrawal amount

  const Assessment = await hre.ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy(initBalance, minimumDeposit, fixedAmount, maxDailyWithdrawal);

  await assessment.deployed();

  console.log("Assessment deployed to:", assessment.address);

  // Set the interest rate per second (for example, 0.01% per second)
  const interestRatePerSecond = ethers.utils.parseUnits("0.0001", 18);
  await assessment.setInterestRatePerSecond(interestRatePerSecond);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
