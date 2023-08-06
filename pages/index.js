import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  // State variables
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [interestRate, setInterestRate] = useState(undefined);
  const [userDepositAmount, setUserDepositAmount] = useState("1"); // Default deposit amount
  const [maxDailyWithdrawal, setMaxDailyWithdrawal] = useState(undefined);

  // Contract address and ABI
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  // Connect to user's MetaMask wallet
  const getWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setEthWallet(provider);
      try {
        await provider.send("eth_requestAccounts", []);
      } catch (error) {
        console.error("Error requesting accounts:", error);
      }
    }
  };

  // Handle user account details
  const handleAccount = async () => {
    if (ethWallet) {
      const accounts = await ethWallet.listAccounts();
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    }
  };

  // Connect to the ATM contract
  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }
    try {
      await ethWallet.send("eth_requestAccounts", []);
      const accounts = await ethWallet.listAccounts();
      setAccount(accounts[0]);
      getATMContract();
    } catch (error) {
      alert("Error connecting to the MetaMask wallet.");
      console.error(error);
    }
  };

  // Create a contract instance for the ATM
  const getATMContract = () => {
    if (!ethWallet) return;

    const provider = ethWallet.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, provider);
    setATM(atmContract);
  };

  // Fetch the account balance, interest rate, and max daily withdrawal amount
  const getBalanceAndInterestRate = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(balance.toString());

      const interestRate = await atm.interestRatePerSecond();
      setInterestRate(interestRate.toString());

      const maxDailyWithdrawal = await atm.maxDailyWithdrawal();
      setMaxDailyWithdrawal(maxDailyWithdrawal.toString());
    }
  };

  // Deposit funds
  const deposit = async () => {
    if (atm) {
      try {
        const tx = await atm.deposit(ethers.utils.parseEther(userDepositAmount));
        await tx.wait();
        getBalanceAndInterestRate();
      } catch (error) {
        console.error("Error depositing:", error);
      }
    }
  };

  // Withdraw funds
  const withdraw = async () => {
    if (atm) {
      try {
        const tx = await atm.withdraw(ethers.utils.parseEther("1"));
        await tx.wait();
        getBalanceAndInterestRate();
      } catch (error) {
        console.error("Error withdrawing:", error);
      }
    }
  };

  // Set a nominee for the account
  const setNominee = async () => {
    if (!account) {
      alert("Please connect your MetaMask wallet");
      return;
    }

    const nomineeAddress = prompt("Enter the nominee's Ethereum address:");

    try {
      const tx = await atm.setNominee(nomineeAddress);
      await tx.wait();
      alert("Nominee has been set successfully.");
    } catch (error) {
      alert("Error setting nominee. Make sure you are the owner of the account.");
    }
  };

  // Perform an emergency withdrawal
  const emergencyWithdraw = async () => {
    if (!account) {
      alert("Please connect your MetaMask wallet");
      return;
    }

    // Get the withdrawal amount from the user using the prompt
    const withdrawalAmount = prompt("Enter the amount you want to withdraw in ETH:");

    if (isNaN(parseFloat(withdrawalAmount))) {
      alert("Please enter a valid numeric value for the withdrawal amount.");
      return;
    }

    try {
      // Parse the user-entered withdrawal amount to ethers format
      const withdrawalAmountInWei = ethers.utils.parseEther(withdrawalAmount);

      // Call the emergencyWithdraw function on the smart contract with the user-entered withdrawal amount
      const tx = await atm.emergencyWithdraw(withdrawalAmountInWei);
      await tx.wait();
      alert("Emergency withdrawal successful.");
      getBalanceAndInterestRate();
    } catch (error) {
      alert("Error performing emergency withdrawal.");
      console.error("Emergency Withdraw Error:", error);
    }
  };

  // Initialize user's MetaMask wallet and account
  useEffect(() => {
    getWallet();
    handleAccount();
  }, []);

  // Fetch the account balance, interest rate, and max daily withdrawal amount when the account is connected
  useEffect(() => {
    if (account && atm) {
      getBalanceAndInterestRate();
    }
  }, [account, atm]);

  // Render the UI
  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {ethWallet === undefined && <p>Please install MetaMask in order to use this ATM.</p>}
      {ethWallet !== undefined && account === undefined && (
        <button onClick={connectAccount}>Please connect your MetaMask wallet</button>
      )}
      {ethWallet !== undefined && account !== undefined && balance === undefined && (
        <p>Loading balance...</p>
      )}
      {ethWallet !== undefined && account !== undefined && balance !== undefined && (
        <div>
          <p>Your Account: {account}</p>
          <p>Your Balance (including interest): {balance} ETH</p>
          <p>Interest Rate: {interestRate} per second</p>
          <p>Max Daily Withdrawal: {maxDailyWithdrawal} ETH</p>
          <input
            type="number"
            value={userDepositAmount}
            onChange={(e) => setUserDepositAmount(e.target.value)}
          />
          <button onClick={deposit}>Deposit</button>
          <button onClick={withdraw}>Withdraw 1 ETH</button>
        </div>
      )}
      {ethWallet !== undefined && account !== undefined && (
        <div>
          <button onClick={setNominee}>Set Nominee</button>

        </div>
      )}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
