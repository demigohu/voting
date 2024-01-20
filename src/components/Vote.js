// "use client"
// import { useEffect, useState } from "react"
// import { ethers } from "ethers"
// import VotingContract from "../contracts/Voting.json"
// import Loading from "@/app/loading"
// import "../app/globals.css"

// const Vote = () => {
//   const [proposals, setProposals] = useState([])
//   const [selectedProposal, setSelectedProposal] = useState(null)
//   const [selectedOption, setSelectedOption] = useState("")
//   const [isVoting, setIsVoting] = useState(false)
//   const [votingResults, setVotingResults] = useState([])
//   const [isClosing, setIsClosing] = useState(false)
//   const [clickedProposals, setClickedProposals] = useState([]);


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const contractAddress = "0x7D413BcB64be4CB478014B1D86C70b66964D1110"
//         const contractAbi = VotingContract.abi
//         const provider = new ethers.providers.Web3Provider(window.ethereum)
//         const contract = new ethers.Contract(
//           contractAddress,
//           contractAbi,
//           provider.getSigner()
//         )

//         const numProposals = await contract.getProposalsLength()

//         const proposalsData = []
//         const resultsData = []

//         for (let i = 0; i < numProposals; i++) {
//           const proposal = await contract.getProposal(i)
//           proposalsData.push({
//             id: i,
//             description: proposal.description,
//             options: proposal.options,
//             isOpen: proposal.isOpen,
//             creator: proposal.creator,
//           })

//           // Ambil hasil voting untuk setiap proposal
//           const results = await contract.getVotingResults(i)
//           resultsData.push({ proposalId: i, results })
//         }

//         setProposals(proposalsData)
//         setVotingResults(resultsData)

//         // Jika ada proposal yang terpilih, atur nilai awal selectedOption
//         if (selectedProposal) {
//           const initialOption = selectedProposal.options[0]
//           setSelectedOption(initialOption)
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error.message)
//       }
//     }

//     fetchData()
//   }, [selectedProposal])

//   const handleVote = async () => {
//     try {
//       console.log("Selected Proposal in handleVote:", selectedProposal)
//       console.log("Selected Option in handleVote:", selectedOption)
//       if (!selectedProposal) {
//         console.error("Selected proposal is null")
//         return
//       }

//       if (!window.ethereum || !window.ethereum.isMetaMask) {
//         console.error("MetaMask not available")
//         return
//       }

//       setIsVoting(true)

//       const provider = new ethers.providers.Web3Provider(window.ethereum)
//       const contractAddress = "0x7D413BcB64be4CB478014B1D86C70b66964D1110"
//       const contractAbi = VotingContract.abi
//       const contract = new ethers.Contract(
//         contractAddress,
//         contractAbi,
//         provider.getSigner()
//       )

//       await contract.vote(selectedProposal.id, selectedOption)

//       console.log(
//         `Voted for proposal ${selectedProposal.id} with option ${selectedOption}`
//       )
//       setIsVoting(false)

//       fetchData()
//     } catch (error) {
//       console.error("Error voting:", error.message)
//       setIsVoting(false)
//     }
//   }

//   const handleCloseVoting = async () => {
//     try {
//       if (!selectedProposal) {
//         console.error("Selected proposal is null")
//         return
//       }

//       if (!window.ethereum || !window.ethereum.isMetaMask) {
//         console.error("MetaMask not available")
//         return
//       }

//       setIsClosing(true)

//       const provider = new ethers.providers.Web3Provider(window.ethereum)
//       const contractAddress = "0x7D413BcB64be4CB478014B1D86C70b66964D1110"
//       const contractAbi = VotingContract.abi
//       const contract = new ethers.Contract(
//         contractAddress,
//         contractAbi,
//         provider.getSigner()
//       )

//       await contract.closeVoting(selectedProposal.id)

//       console.log(`Closed voting for proposal ${selectedProposal.id}`)
//       setIsClosing(false)

//       fetchData()
//     } catch (error) {
//       console.error("Error closing voting:", error.message)
//       setIsClosing(false)
//     }
//   }

//   const handleCardClick = (proposal) => {
//     // Fungsi ini akan dipanggil saat card proposal diklik
//     setSelectedProposal(proposal)
//     // Atur nilai opsi jika diperlukan
//     const initialOption = proposal.options[0]
//     setSelectedOption(initialOption)
//   }

//   console.log(selectedOption)

//   return (
//     <div>
//       <h1 className="text-2xl text-center mb-10 font-bold text-black">Voting Page</h1>
//       {proposals.length === 0 ? (
//         <Loading />
//       ) : (
//         <div className="grid grid-cols-2 gap-10 text-black">
//           {proposals.map((proposal) => (
//             <div
//               key={proposal.id}
//               className="card bg-transparent border shadow-xl"
//             >
//               <div key={proposal.id} onClick={() => handleCardClick(proposal)}>
//                 <div className="card-body">
//                   <h2 className="text-lg font-bold">
//                     Description : {proposal.description}
//                   </h2>

//                   {proposal.isOpen && (
//                     <form
//                       onSubmit={(e) => {
//                         e.preventDefault()
//                         setSelectedProposal(proposal)
//                         handleVote()
//                       }}
//                     >
//                       <label>Choose Option :</label>
//                       <div className="flex gap-5">
//                         <select
//                           value={selectedOption}
//                           onChange={(e) => setSelectedOption(e.target.value)}
//                           className="select select-bordered w-full bg-white"
//                         >
//                           {proposal.options.map((option) => (
//                             <option key={option} value={option}>
//                               {option}
//                             </option>
//                           ))}
//                         </select>
//                         <button
//                           type="submit"
//                           className="btn w-32 border-none bg-[#4a86e7] text-white hover:bg-[#4072c3]"
//                           disabled={isVoting}
//                         >
//                           {isVoting ? "Voting..." : "Vote"}
//                         </button>
//                       </div>
//                     </form>
//                   )}

//                   <p>Creator Address: {proposal.creator}</p>

//                   <p>Voting Result:</p>
//                   <ul>
//                     {votingResults
//                       .filter((result) => result.proposalId === proposal.id)
//                       .map((result) =>
//                         result.results.options.map((option, optionIndex) => (
//                           <li key={optionIndex}>
//                             {option}:{" "}
//                             {result.results.votes[optionIndex].toString()} suara
//                           </li>
//                         ))
//                       )}
//                   </ul>

//                   {proposal.creator && (
//                     <button
//                       onClick={() => {
//                         setSelectedProposal(proposal)
//                         handleCloseVoting(proposal.id)
//                       }}
//                       disabled={isVoting}
//                       className="btn border-none bg-red-500 text-white hover:bg-red-600"
//                     >
//                       {isVoting ? "Closing..." : "Close Voting"}
//                     </button>
//                   )}

//                   <p className="font-bold">
//                     Voting Status:{" "}
//                     {proposal.isOpen ? "Open" : "Closed"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default Vote



"use client"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import VotingContract from "../contracts/Voting.json"
import Loading from "@/app/loading"

// ...
const Vote = () => {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [isVoting, setIsVoting] = useState(false);
  const [votingResults, setVotingResults] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contractAddress = "0x5925D08f71aDB695163c799782c34958e3E42b7D";
        const contractAbi = VotingContract.abi;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          provider.getSigner()
        );

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

        // Jika ada proposal yang terpilih, atur nilai awal selectedOption
        if (selectedProposal) {
          const proposalId = selectedProposal.id;
          const initialOption =
            selectedOption[proposalId] || selectedProposal.options[0];
          setSelectedOption({
            ...selectedOption,
            [proposalId]: initialOption,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [selectedProposal]);

  const handleVote = async (proposalId) => {
    try {
      console.log("Selected Proposal in handleVote:", selectedProposal);
      console.log("Selected Option in handleVote:", selectedOption);

      if (!selectedProposal) {
        console.error("Selected proposal is null");
        return;
      }

      if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.error("MetaMask not available");
        return;
      }

      setIsVoting(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = "0x5925D08f71aDB695163c799782c34958e3E42b7D";
      const contractAbi = VotingContract.abi;
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider.getSigner()
      );

      await contract.vote(proposalId, selectedOption[proposalId]);

      console.log(
        `Voted for proposal ${proposalId} with option ${
          selectedOption[proposalId]
        }`
      );
      setIsVoting(false);

      fetchData();
    } catch (error) {
      console.error("Error voting:", error.message);
      setIsVoting(false);
    }
  };

  const handleCloseVoting = async (proposalId) => {
    try {
      if (!selectedProposal) {
        console.error("Selected proposal is null");
        return;
      }

      if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.error("MetaMask not available");
        return;
      }

      setIsClosing(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = "0x5925D08f71aDB695163c799782c34958e3E42b7D";
      const contractAbi = VotingContract.abi;
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider.getSigner()
      );

      await contract.closeVoting(proposalId);

      console.log(`Closed voting for proposal ${proposalId}`);
      setIsClosing(false);

      fetchData();
    } catch (error) {
      console.error("Error closing voting:", error.message);
      setIsClosing(false);
    }
  };
  console.log(selectedOption);

  return (
    <div>
      <h1 className="text-2xl text-center mb-10 font-bold text-black">Voting Page</h1>
      {proposals.length === 0 ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-10 text-black">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="card bg-transparent border shadow-xl"
            >
              <div>
                <div className="card-body">
                  <h2 className="text-lg font-bold">
                    Description : {proposal.description}
                  </h2>

                  {proposal.isOpen && (
                    <form
                      key={proposal.id}
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSelectedProposal(proposal);
                        handleVote(proposal.id);
                      }}
                    >
                      <label>Choose Options :</label>
                      <div className="flex gap-5">
                        <select
                          value={selectedOption[proposal.id] || ""}
                          onChange={(e) =>
                            setSelectedOption({
                              ...selectedOption,
                              [proposal.id]: e.target.value,
                            })
                          }
                          className="select select-bordered w-full bg-white"
                        >
                          <option disabled value={""}>
                            Who shot first?
                          </option>
                          {proposal.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="btn w-32 border-none bg-[#4a86e7] text-white hover:bg-[#4072c3]"
                          disabled={isVoting}
                        >
                          {isVoting ? "Voting..." : "Vote"}
                        </button>
                      </div>
                    </form>
                  )}

                  <p>Creator Address: {proposal.creator}</p>

                  <p>Voting Result:</p>
                  <ul>
                    {votingResults
                      .filter((result) => result.proposalId === proposal.id)
                      .map((result) =>
                        result.results.options.map((option, optionIndex) => (
                          <li key={optionIndex}>
                            {option}:{" "}
                            {result.results.votes[optionIndex].toString()} Voices
                          </li>
                        ))
                      )}
                  </ul>

                  {proposal.creator && (
                    <button
                      onClick={() => {
                        setSelectedProposal(proposal);
                        handleCloseVoting(proposal.id);
                      }}
                      disabled={isVoting}
                      className="btn border-none bg-red-500 text-white hover:bg-red-600"
                    >
                      {isVoting ? "Closing..." : "Close Vote"}
                    </button>
                  )}

                  <p className="font-bold">
                    Voting Status:{" "}
                    {proposal.isOpen ? "Open" : "Closed"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vote;
