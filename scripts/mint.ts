import { ethers } from "hardhat";


const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function mint() {
    const Salary = await ethers.getContractFactory("Salary");
    
    const salary = await Salary.deploy()
    await salary.deployed();
  
    console.log(`Contract deployed to ${salary.address}`);
  
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  mint().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  