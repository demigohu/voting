"use client"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import VotingContract from "../contracts/Voting.json"
import Loading from "@/app/loading"

// ...
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

        if (selectedProposal) {
          const proposalId = selectedProposal.id

          // If the proposal is already in the selectedOption state,
          // use its existing selected option; otherwise, use the first option.
          const initialOption =
            selectedOption[proposalId] || selectedProposal.options[0]

          // Ensure only one option is selected for the proposal
          const updatedSelectedOption = { [proposalId]: initialOption }

          setSelectedOption((prevSelectedOption) => ({
            ...prevSelectedOption,
            ...updatedSelectedOption,
          }))
        }
      } catch (error) {
        console.error("Error fetching data:", error.message)
      }
    }

    fetchData()
  }, [selectedProposal])

  const handleVote = async (proposalId) => {
    try {
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

      await contract.vote(proposalId, selectedOption[proposalId])

      console.log(
        `Voted for proposal ${proposalId} with option ${selectedOption[proposalId]}`
      )
      setIsVoting(false)

      fetchData()
    } catch (error) {
      console.error("Error voting:", error.message)
      setIsVoting(false)
    }
  }

  const handleCloseVoting = async (proposalId) => {
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

      await contract.closeVoting(proposalId)

      console.log(`Closed voting for proposal ${proposalId}`)
      setIsClosing(false)

      fetchData()
    } catch (error) {
      console.error("Error closing voting:", error.message)
      setIsClosing(false)
    }
  }
  console.log(selectedOption)

  return (
    <div>
      <h1 className="text-2xl text-center mb-10 font-bold">Halaman Voting</h1>
      {proposals.length === 0 ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="card bg-transparent border shadow-xl"
            >
              <div className="card-body p-5 lg:p-10">
                <h2 className="text-lg font-bold">
                  Description : {proposal.description}
                </h2>

                {proposal.isOpen && (
                  <form
                    key={proposal.id}
                    onSubmit={(e) => {
                      e.preventDefault()
                      setSelectedProposal(proposal)
                      handleVote(proposal.id)
                    }}
                  >
                    <label>Pilih Opsi :</label>
                    <div className="flex gap-5">
                      <select
                        value={selectedOption[proposal.id] || ""}
                        onChange={(e) =>
                          setSelectedOption({
                            ...selectedOption,
                            [proposal.id]: e.target.value,
                          })
                        }
                        className="select select-bordered w-full"
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

                <div className="overflow-hidden">
                  <p>Pembuat Proposal:</p>
                  <p className="mb-2" style={{ wordWrap: "break-word" }}>
                    {proposal.creator}
                  </p>
                </div>

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
          ))}
        </div>
      )}
    </div>
  )
}

export default Vote
