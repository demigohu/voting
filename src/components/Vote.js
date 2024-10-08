"use client"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import VotingContract from "../contracts/Voting.json"
import Loading from "@/app/loading"

// ...
const Vote = () => {
  const [proposals, setProposals] = useState([])
  const [selectedProposal, setSelectedProposal] = useState(null)
  const [selectedOption, setSelectedOption] = useState({})
  const [isVoting, setIsVoting] = useState(false)
  const [votingResults, setVotingResults] = useState([])
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contractAddress = "0x5925D08f71aDB695163c799782c34958e3E42b7D"
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
          const initialOption =
            selectedOption[proposalId] || selectedProposal.options[0]
          setSelectedOption({
            ...selectedOption,
            [proposalId]: initialOption,
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error.message)
      }
    }

    fetchData()
  }, [selectedProposal])

  const handleVote = async (proposalId) => {
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
      const contractAddress = "0x5925D08f71aDB695163c799782c34958e3E42b7D"
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
      const contractAddress = "0x5925D08f71aDB695163c799782c34958e3E42b7D"
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
      <h1 className="text-2xl text-center mb-10 font-bold text-black">
        Voting Page
      </h1>
      {proposals.length === 0 ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="card glassmorpishm">
              <div className="card-body p-5 lg:p-10">
                <h2 className="text-lg font-bold text-black">
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
                    <label className="text-black">Pilih Opsi :</label>
                    <div className="flex gap-5">
                      <select
                        value={selectedOption[proposal.id] || ""}
                        onChange={(e) =>
                          setSelectedOption({
                            ...selectedOption,
                            [proposal.id]: e.target.value,
                          })
                        }
                        className="select select-bordered w-full text-black bg-white"
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

                <div className="overflow-hidden text-black">
                  <p>Pembuat Proposal:</p>
                  <p className="mb-2" style={{ wordWrap: "break-word" }}>
                    {proposal.creator}
                  </p>
                </div>

                <p className="text-black">Hasil Voting:</p>
                <ul className="text-black">
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

                <p className="font-bold text-black">
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
