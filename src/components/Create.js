"use client"
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingContract from '../contracts/Voting.json';

const CreateProposal = () => {
  const [description, setDescription] = useState('');
  const [optionsArray, setOptionsArray] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const contractAddress = '0x7D413BcB64be4CB478014B1D86C70b66964D1110';
  const contractABI = VotingContract.abi;

  useEffect(() => {
    // Connect to Metamask provider
    async function connectToMetamask() {
      try {
        // Request account access if needed
        await window.ethereum.enable();
        
        // Create an ethers provider using Metamask provider
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        // Connect to the contract using its ABI and address
        const votingContract = new ethers.Contract(contractAddress, contractABI, web3Provider.getSigner());
        setContract(votingContract);
      } catch (error) {
        console.error('Failed to connect to Metamask:', error.message);
      }
    }

    connectToMetamask();
  }, []);

  const handleOptionChange = (e, index) => {
    const newOptions = [...optionsArray];
    newOptions[index] = e.target.value;
    setOptionsArray(newOptions);
  };

  const addOption = () => {
    setOptionsArray([...optionsArray, '']);
  };

  const handleSubmit = async () => {
    try {
      if (!provider || !contract) {
        console.error('Metamask connection not established.');
        return;
      }

      // Kirim transaksi untuk membuat proposal baru
      const tx = await contract.createProposal(description, optionsArray);

      // Tunggu transaksi untuk di-mine
      await tx.wait();

      // Handle success
      console.log('Proposal created successfully');
    } catch (error) {
      // Handle error
      console.error('Failed to create proposal:', error.message);
    }
  };

  return (
    <div>
      <h1>Create New Proposal</h1>
      <div>
        <label>Description:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Options:</label>
        {optionsArray.map((option, index) => (
          <div key={index}>
            <input type="text" value={option} onChange={(e) => handleOptionChange(e, index)} />
          </div>
        ))}
        <button onClick={addOption}>Add Option</button>
      </div>
      <button onClick={handleSubmit}>Create Proposal</button>
    </div>
  );
};

export default CreateProposal;
