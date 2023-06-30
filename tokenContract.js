let contract;
let accounts;
let contractAddress = "0x331158dA2fEF1156E9ebCACfa84Bdc3BD82e44a9";
let abi = "[]";
async function initContract() {
    if (typeof web3 === "undefined") {
        alert("Please install MetaMask to interact with this Dapp.");
        return;
    }
    web3 = new Web3(web3.currentProvider);
    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(abi, contractAddress);
    displayTokenBalance();
    displayUserBalances();
}

async function displayTokenBalance() {
    const tokenBalance = await contract.methods.balanceOf(accounts[0]).call();
    document.getElementById("tokenBalance").innerText = tokenBalance;
}

async function displayUserBalances() {
    const userCount = await contract.methods.userCount().call();
    const userBalances = await contract.methods.getUserBalances().call();
    document.getElementById("userCount").innerText = userCount;
    const userBalancesList = document.getElementById("userBalancesList");
    userBalancesList.innerHTML = "";
    for (let i = 0; i < userCount; i++) {
        const address = userBalances[i].address;
        const balance = userBalances[i].balance;
        const listItem = document.createElement("li");
        listItem.innerText = "Address: " + address + " - Balance: " + balance;
        userBalancesList.appendChild(listItem);
    }
}

async function transferTokens() {
    const receiver = document.getElementById("receiver").value;
    const amount = document.getElementById("amount").value;
    await contract.methods.transfer(receiver, amount).send({from: accounts[0]});
    displayTokenBalance();
    displayUserBalances();
}

async function executeContract() {
    const totalSupply = document.getElementById("totalSupply").value;
    const name = document.getElementById("name").value;
    const symbol = document.getElementById("symbol").value;
    // Deploy the contract
    contract = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode,
            arguments: [totalSupply, name, symbol]
        })
        .send({from: accounts[0], gas: 3000000});
    // Update the contract address
    contractAddress = contract.options.address;
    // Display the contract address
    document.getElementById("contractAddress").innerText = contractAddress;
    // Initialize the contract
    initContract();
}

window.onload = initContract;