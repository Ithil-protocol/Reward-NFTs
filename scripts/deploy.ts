// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const Animagus = await ethers.getContractFactory("Animagus");
  const animagus = await Animagus.deploy(
    "0x0000000000000000000000000000000000000000",
    0
  );
  await animagus.deployed();

  console.log("Animagus deployed to:", animagus.address);

  const Heirloom = await ethers.getContractFactory("Heirloom");
  const heirloom = await Heirloom.deploy("");
  await heirloom.deployed();

  console.log("Animagus deployed to:", animagus.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
