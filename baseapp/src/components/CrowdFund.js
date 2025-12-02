import React from "react";
import { ethers } from "ethers";
import { useState } from "react";

function Crowdfund() {
  // Helper function to shorten address display
  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  const [balance, setBalance] = useState(null);
  const [yourBalance, setYourBalance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [signer2, setSigner2] = useState(null);
  const [contract, setContract] = useState(null);
  const [contract2, setContract2] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [goalAmount, setGoalAmount] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isStarted, setIsStarted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [network, setNetwork] = useState(null);
  


const contractAddress = "0xf6Acf5bE647e332A9760F68EE26295eb754118f3";
  async function main() {
    try {
      setError(null);
      const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
      console.log(accounts);
      setAccounts(accounts[0]);
      const provider1 = new ethers.BrowserProvider(window.ethereum);
      console.log(provider1);
      setProvider(provider1);

      // Get network info
      const networkInfo = await provider1.getNetwork();
      setNetwork(networkInfo.name);
      console.log("Connected to network:", networkInfo.name, "Chain ID:", networkInfo.chainId);

      // Check if contract exists
      const code = await provider1.getCode(contractAddress);
      if (code === "0x") {
        setError(`Contract not found at ${contractAddress} on ${networkInfo.name}. Please deploy the contract or check the address.`);
        return;
      }

    const abi = [
	{
		"inputs": [],
		"name": "endFunding",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "setfund",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_endTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_goalAmount",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "withdrawlAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawlSomeFunds",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "checkAllFunds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "myAdress",
				"type": "address"
			}
		],
		"name": "checkYourFunds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "endTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "goalAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isStarted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

    const signer1 = await provider1.getSigner(accounts[0]);
      const signer2 = await provider1.getSigner(accounts[1]);
      setSigner2(signer2);
      setSigner(signer1);
      const crowdFundContract = new ethers.Contract(contractAddress, abi, signer1);
      const crowdFundContrac2 = new ethers.Contract(contractAddress, abi, signer2);
      setContract2(crowdFundContrac2)
      setContract(crowdFundContract);
      console.log("Contract connected successfully!");
    } catch (err) {
      console.error("Connection error:", err);
      setError(err.message || "Failed to connect wallet");
    }
  }

  async function handleBalanceCheck() {
    try {
      setError(null);
      if (!contract) {
        setError("Please connect wallet first");
        return;
      }
      const balanceAll = await contract.checkAllFunds();
      setBalance(balanceAll.toString());
      console.log(balanceAll.toString());
    } catch (err) {
      console.error("Balance check error:", err);
      setError(err.message || "Failed to check balance");
    }
  }

  async function handleYourBalance() {
    try {
      setError(null);
      if (!contract) {
        setError("Please connect wallet first");
        return;
      }
      const yourFunds = await contract.checkYourFunds(accounts);
      setYourBalance(yourFunds.toString());
      console.log(yourFunds.toString());
    } catch (err) {
      console.error("Your balance error:", err);
      setError(err.message || "Failed to check your balance");
    }
  }

  async function handleSetFund(){
    try {
      setError(null);
      if (!contract2) {
        setError("Please connect wallet first");
        return;
      }
      const txn = await contract2.setfund({value: ethers.parseUnits("0.00001", 18)})
      await txn.wait()
      console.log("Donation successful:", txn);
      alert("Donation successful!");
    } catch (err) {
      console.error("Donation error:", err);
      setError(err.message || "Failed to donate");
    }
  }

  async function withdrawAll() {
    try {
      setError(null);
      if (!contract2) {
        setError("Please connect wallet first");
        return;
      }
      const txn = await contract2.withdrawlAll();
      await txn.wait()
      console.log("Withdrawal successful:", txn);
      alert("Withdrawal successful!");
    } catch (err) {
      console.error("Withdrawal error:", err);
      setError(err.message || "Failed to withdraw");
    }
  }



  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f3e8 0%, #e8dcc4 100%)',
      fontFamily: "'Courier New', monospace",
      padding: '20px'
    },
    header: {
      background: '#2c2416',
      padding: '20px 40px',
      borderBottom: '3px solid #8b7355',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
    },
    walletAddress: {
      color: '#d4af37',
      fontSize: '14px',
      letterSpacing: '1px',
      fontWeight: 'bold'
    },
    mainCard: {
      maxWidth: '600px',
      margin: '60px auto',
      background: '#fff9f0',
      border: '4px solid #8b7355',
      borderRadius: '2px',
      padding: '40px',
      boxShadow: '8px 8px 0px rgba(139, 115, 85, 0.3)',
      textAlign: 'center'
    },
    title: {
      fontSize: '32px',
      color: '#2c2416',
      marginBottom: '10px',
      fontWeight: 'bold',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      borderBottom: '2px solid #8b7355',
      paddingBottom: '15px'
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b5d4f',
      marginBottom: '30px',
      fontStyle: 'italic'
    },
    button: {
      background: '#2c2416',
      color: '#d4af37',
      border: '2px solid #8b7355',
      padding: '12px 30px',
      margin: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      transition: 'all 0.3s',
      fontFamily: "'Courier New', monospace"
    },
    buttonHover: {
      background: '#d4af37',
      color: '#2c2416'
    },
    statsBox: {
      background: '#2c2416',
      color: '#d4af37',
      padding: '20px',
      margin: '30px 0',
      border: '2px solid #8b7355',
      display: 'flex',
      justifyContent: 'space-around',
      gap: '20px'
    },
    statItem: {
      flex: 1
    },
    statLabel: {
      fontSize: '11px',
      marginBottom: '8px',
      opacity: 0.8,
      letterSpacing: '1px'
    },
    statValue: {
      fontSize: '18px',
      fontWeight: 'bold'
    },
    image: {
      width: '100%',
      maxWidth: '400px',
      height: '250px',
      objectFit: 'cover',
      border: '3px solid #8b7355',
      marginBottom: '30px',
      filter: 'sepia(30%)'
    },
    errorBox: {
      background: '#8b4545',
      color: '#fff9f0',
      padding: '15px',
      margin: '20px 0',
      border: '2px solid #6b3535',
      fontSize: '13px',
      textAlign: 'left'
    },
    networkInfo: {
      color: '#d4af37',
      fontSize: '12px',
      marginLeft: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button 
          style={styles.button}
          onClick={main}
          onMouseEnter={(e) => {
            e.target.style.background = '#d4af37';
            e.target.style.color = '#2c2416';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#2c2416';
            e.target.style.color = '#d4af37';
          }}
        >
          {accounts ? '✓ Connected' : 'Connect Wallet'}
        </button>
        <div>
          <div style={styles.walletAddress}>
            {accounts ? shortenAddress(accounts) : 'Not Connected'}
          </div>
          {network && <div style={styles.networkInfo}>Network: {network}</div>}
        </div>
      </header>

      <div style={styles.mainCard}>
        <h1 style={styles.title}>CrowdFund</h1>
        <p style={styles.subtitle}>Support the cause, make a difference</p>
        
        {error && (
          <div style={styles.errorBox}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <img style={styles.image} src="./fund.jpg" alt="Crowdfund" />

        <div style={styles.statsBox}>
          <div style={styles.statItem}>
            <div style={styles.statLabel}>TOTAL RAISED</div>
            <div style={styles.statValue}>{balance || '---'} Wei</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statLabel}>YOUR CONTRIBUTION</div>
            <div style={styles.statValue}>{yourBalance || '---'} Wei</div>
          </div>
        </div>

        <div>
          <button 
            style={styles.button}
            onClick={handleBalanceCheck}
            onMouseEnter={(e) => {
              e.target.style.background = '#d4af37';
              e.target.style.color = '#2c2416';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#2c2416';
              e.target.style.color = '#d4af37';
            }}
          >
            Check Balance
          </button>
          <button 
            style={styles.button}
            onClick={handleYourBalance}
            onMouseEnter={(e) => {
              e.target.style.background = '#d4af37';
              e.target.style.color = '#2c2416';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#2c2416';
              e.target.style.color = '#d4af37';
            }}
          >
            Your Balance
          </button>
        </div>

        <div style={{ marginTop: '30px' }}>
          <button 
            style={{...styles.button, background: '#8b7355', color: '#fff9f0'}}
            onClick={handleSetFund}
            onMouseEnter={(e) => {
              e.target.style.background = '#d4af37';
              e.target.style.color = '#2c2416';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#8b7355';
              e.target.style.color = '#fff9f0';
            }}
          >
            Donate 0.00001 ETH
          </button>
          <button 
            style={{...styles.button, background: '#8b7355', color: '#fff9f0'}}
            onClick={withdrawAll}
            onMouseEnter={(e) => {
              e.target.style.background = '#d4af37';
              e.target.style.color = '#2c2416';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#8b7355';
              e.target.style.color = '#fff9f0';
            }}
          >
            Withdraw All
          </button>
        </div>
      </div>
    </div>
  );
}

export default Crowdfund;