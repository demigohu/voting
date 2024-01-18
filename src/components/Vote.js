"use client";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingContract from '../contracts/Voting.json';

const Vote = () => {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [isVoting, setIsVoting] = useState(false);
  const [votingResults, setVotingResults] = useState([]);
  const [isClosing, setIsClosing] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const contractAddress = '0x7D413BcB64be4CB478014B1D86C70b66964D1110';
        const contractAbi = VotingContract.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractAbi, provider.getSigner());

        const numProposals = await contract.getProposalsLength();

        const proposalsData = [];
        const resultsData = [];

        for (let i = 0; i < numProposals; i++) {
          const proposal = await contract.getProposal(i);
          proposalsData.push({
            id: i,
            description: proposal.description,
            options: proposal.options,
            isOpen: proposal.isOpen,
            creator: proposal.creator,
          });

          // Ambil hasil voting untuk setiap proposal
          const results = await contract.getVotingResults(i);
          resultsData.push({ proposalId: i, results });
        }

        setProposals(proposalsData);
        setVotingResults(resultsData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleVote = async () => {
    try {
      if (!selectedProposal) {
        console.error('Selected proposal is null');
        return;
      }

      if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.error('MetaMask not available');
        return;
      }

      setIsVoting(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = '0x7D413BcB64be4CB478014B1D86C70b66964D1110';
      const contractAbi = VotingContract.abi;
      const contract = new ethers.Contract(contractAddress, contractAbi, provider.getSigner());

      await contract.vote(selectedProposal.id, selectedOption);

      console.log(`Voted for proposal ${selectedProposal.id} with option ${selectedOption}`);
      setIsVoting(false);

      fetchData();
    } catch (error) {
      console.error('Error voting:', error.message);
      setIsVoting(false);
    }
  };

  // const handleVote = async () => {
  //   try {
  //     if (!selectedProposal) {
  //       console.error('Selected proposal is null');
  //       return;
  //     }

  //     if (!window.ethereum || !window.ethereum.isMetaMask) {
  //       console.error('MetaMask not available');
  //       return;
  //     }

  //     setIsVoting(true);

  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const contractAddress = '0x7D413BcB64be4CB478014B1D86C70b66964D1110';
  //     const contractAbi = VotingContract.abi;
  //     const contract = new ethers.Contract(contractAddress, contractAbi, provider.getSigner());

  //     // Logging untuk memeriksa nilai selectedProposal dan selectedOption
  //     console.log('Selected Proposal:', selectedProposal);
  //     console.log('Selected Option:', selectedOption);

  //     await contract.vote(selectedProposal.id, selectedOption);

  //     console.log(`Voted for proposal ${selectedProposal.id} with option ${selectedOption}`);
  //     setIsVoting(false);

  //     fetchData();
  //   } catch (error) {
  //     console.error('Error voting:', error.message);
  //     setIsVoting(false);
  //   }
  // };

  const handleCloseVoting = async () => {
    try {
      if (!selectedProposal) {
        console.error('Selected proposal is null');
        return;
      }
  
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.error('MetaMask not available');
        return;
      }
  
      setIsClosing(true);
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = '0x7D413BcB64be4CB478014B1D86C70b66964D1110';
      const contractAbi = VotingContract.abi;
      const contract = new ethers.Contract(contractAddress, contractAbi, provider.getSigner());
  
      await contract.closeVoting(selectedProposal.id);
  
      console.log(`Closed voting for proposal ${selectedProposal.id}`);
      setIsClosing(false);
  
      fetchData();
    } catch (error) {
      console.error('Error closing voting:', error.message);
      setIsClosing(false);
    }
  };
  

  return (
    <div>
      <h1>Halaman Voting</h1>
      {proposals.map((proposal) => (
        <div key={proposal.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
          <h2>{proposal.description}</h2>
          <p>Opsi: {proposal.options.join(', ')}</p>
  
          {/* Tampilkan form voting */}
          {proposal.isOpen && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSelectedProposal(proposal);  // Set selectedProposal saat tombol Vote diklik
                handleVote();
              }}
            >
              <label>
                Pilih Opsi:
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  {proposal.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" disabled={isVoting}>
                {isVoting ? 'Voting...' : 'Vote'}
              </button>
            </form>
          )}
  
          <p>Pembuat Proposal: {proposal.creator}</p>
  
          {/* Selalu tampilkan hasil voting, terlepas dari status proposal */}
          <>
            <p>Hasil Voting:</p>
            <ul>
              {votingResults
                .filter((result) => result.proposalId === proposal.id)
                .map((result) => (
                  result.results.options.map((option, optionIndex) => (
                    <li key={optionIndex}>
                      {option}: {result.results.votes[optionIndex].toString()} suara
                    </li>
                  ))
                ))}
            </ul>
          </>
  
          {/* Tampilkan tombol tutup voting */}
          {proposal.creator && (
            <button
              onClick={() => {
                setSelectedProposal(proposal);  // Set selectedProposal saat tombol Tutup Voting diklik
                handleCloseVoting(proposal.id);
              }}
              disabled={isVoting}
            >
              {isVoting ? 'Menutup...' : 'Tutup Voting'}
            </button>
          )}
  
          {/* Tambahkan status voting (masih dibuka atau sudah ditutup) */}
          <p>Status Voting: {proposal.isOpen ? 'Masih Dibuka' : 'Sudah Ditutup'}</p>
        </div>
      ))}
    </div>
  );
};

export default Vote;