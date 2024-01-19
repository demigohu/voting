"use client"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import VotingContract from "../contracts/Voting.json"
import Loading from "@/app/Loading"

const Vote = () => {
  const [proposals, setProposals] = useState([])
  const [selectedProposal, setSelectedProposal] = useState(null)
  const [selectedOption, setSelectedOption] = useState("")
  const [isVoting, setIsVoting] = useState(false)
  const [votingResults, setVotingResults] = useState([])
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contractAddress = "0x7D413BcB64be4CB478014B1D86C70b66964D1110"
        const contractAbi = VotingContract.abi
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          provider.getSigner()
        )

        const numProposals = await contract.getProposalsLength()

        const proposalsData = []
        const resultsData = []

        for (let i = 0; i < numProposals; i++) {
          const proposal = await contract.getProposal(i)
          proposalsData.push({
            id: i,
            description: proposal.description,
            options: proposal.options,
            isOpen: proposal.isOpen,
            creator: proposal.creator,
          })

          // Ambil hasil voting untuk setiap proposal
          const results = await contract.getVotingResults(i)
          resultsData.push({ proposalId: i, results })
        }

        setProposals(proposalsData)
        setVotingResults(resultsData)

        // Jika ada proposal yang terpilih, atur nilai awal selectedOption
        if (selectedProposal) {
          const initialOption = selectedProposal.options[0]
          setSelectedOption(initialOption)
        }
      } catch (error) {
        console.error("Error fetching data:", error.message)
      }
    }

    fetchData()
  }, [selectedProposal])

  const handleVote = async () => {
    try {
      console.log("Selected Proposal in handleVote:", selectedProposal)
      console.log("Selected Option in handleVote:", selectedOption)
      if (!selectedProposal) {
        console.error("Selected proposal is null")
        return
      }

      if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.error("MetaMask not available")
        return
      }

      setIsVoting(true)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contractAddress = "0x7D413BcB64be4CB478014B1D86C70b66964D1110"
      const contractAbi = VotingContract.abi
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider.getSigner()
      )

      await contract.vote(selectedProposal.id, selectedOption)

      console.log(
        `Voted for proposal ${selectedProposal.id} with option ${selectedOption}`
      )
      setIsVoting(false)

      fetchData()
    } catch (error) {
      console.error("Error voting:", error.message)
      setIsVoting(false)
    }
  }

  const handleCloseVoting = async () => {
    try {
      if (!selectedProposal) {
        console.error("Selected proposal is null")
        return
      }

      if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.error("MetaMask not available")
        return
      }

      setIsClosing(true)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contractAddress = "0x7D413BcB64be4CB478014B1D86C70b66964D1110"
      const contractAbi = VotingContract.abi
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider.getSigner()
      )

      await contract.closeVoting(selectedProposal.id)

      console.log(`Closed voting for proposal ${selectedProposal.id}`)
      setIsClosing(false)

      fetchData()
    } catch (error) {
      console.error("Error closing voting:", error.message)
      setIsClosing(false)
    }
  }

  const handleCardClick = (proposal) => {
    // Fungsi ini akan dipanggil saat card proposal diklik
    setSelectedProposal(proposal)
    // Atur nilai opsi jika diperlukan
    const initialOption = proposal.options[0]
    setSelectedOption(initialOption)
  }

  console.log(selectedOption)

  return (
    <div>
      <h1 className="text-2xl text-center mb-10 font-bold">Halaman Voting</h1>
      {proposals.length === 0 ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-10">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="card bg-transparent border shadow-xl"
            >
              <div key={proposal.id} onClick={() => handleCardClick(proposal)}>
                <div className="card-body">
                  <h2 className="text-lg font-bold">
                    Description : {proposal.description}
                  </h2>

                  {proposal.isOpen && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        setSelectedProposal(proposal)
                        handleVote()
                      }}
                    >
                      <label>Pilih Opsi :</label>
                      <div className="flex gap-5">
                        <select
                          value={selectedOption}
                          onChange={(e) => setSelectedOption(e.target.value)}
                          className="select select-bordered w-full"
                        >
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

                  <p>Pembuat Proposal: {proposal.creator}</p>

                  <p>Hasil Voting:</p>
                  <ul>
                    {votingResults
                      .filter((result) => result.proposalId === proposal.id)
                      .map((result) =>
                        result.results.options.map((option, optionIndex) => (
                          <li key={optionIndex}>
                            {option}:{" "}
                            {result.results.votes[optionIndex].toString()} suara
                          </li>
                        ))
                      )}
                  </ul>

                  {proposal.creator && (
                    <button
                      onClick={() => {
                        setSelectedProposal(proposal)
                        handleCloseVoting(proposal.id)
                      }}
                      disabled={isVoting}
                      className="btn border-none bg-red-500 text-white hover:bg-red-600"
                    >
                      {isVoting ? "Menutup..." : "Tutup Voting"}
                    </button>
                  )}

                  <p className="font-bold">
                    Status Voting:{" "}
                    {proposal.isOpen ? "Masih Dibuka" : "Sudah Ditutup"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Vote
