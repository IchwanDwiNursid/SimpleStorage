import ethers from "ethers";
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()

const main = async() => {
    // http://127.0.0.1:7545
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY,provider)

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8")
// --------------------------commond transaction---------------------------
    const contractFactory = new ethers.ContractFactory(abi,binary,wallet)
    console.log("Deploying, please wait....");
    const contract = await contractFactory.deploy() // ===========> can add  gasPrice or gasLimit
    await contract.deployTransaction.wait(1)

// ----------------------interacting with contract--------------------------    
    //Get Number
   const currentFavoriteNumber = await contract.retrieve();
   console.log(`Current favorite number ${currentFavoriteNumber.toString()}`)
   const transactionResponse = await contract.store("7")
   const transactionReceipt = await transactionResponse.wait(1)
   const updateFavoriteNumber = await contract.retrieve()
   console.log(`Update favorite number is: ${updateFavoriteNumber}`)
}

try {
    await main()
}catch(error) {
    console.log(error)
}