"use client"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import VotingContract from "../contracts/Voting.json"

const CreateProposal = () => {
  const [description, setDescription] = useState("")
  const [optionsArray, setOptionsArray] = useState([])
  const [provider, setProvider] = useState(null)
  const [contract, setContract] = useState(null)

  const contractAddress = "0x5925D08f71aDB695163c799782c34958e3E42b7D"
  const contractABI = VotingContract.abi

  useEffect(() => {
    // Connect to Metamask provider
    async function connectToMetamask() {
      try {
        // Request account access if needed
        await window.ethereum.enable()

        // Create an ethers provider using Metamask provider
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(web3Provider)

        // Connect to the contract using its ABI and address
        const votingContract = new ethers.Contract(
          contractAddress,
          contractABI,
          web3Provider.getSigner()
        )
        setContract(votingContract)
      } catch (error) {
        console.error("Failed to connect to Metamask:", error.message)
      }
    }

    connectToMetamask()
  }, [])

  const handleOptionChange = (e, index) => {
    const newOptions = [...optionsArray]
    newOptions[index] = e.target.value
    setOptionsArray(newOptions)
  }

  const addOption = (e) => {
    e.preventDefault()
    setOptionsArray([...optionsArray, ""])
  }

  const handleSubmit = async () => {
    try {
      if (!provider || !contract) {
        console.error("Metamask connection not established.")
        return
      }

      // Kirim transaksi untuk membuat proposal baru
      const tx = await contract.createProposal(description, optionsArray)

      // Tunggu transaksi untuk di-mine
      await tx.wait()
    } catch (error) {
      // Handle error
      console.error("Failed to create proposal:", error.message)
    }
  }

  return (
    <div className="card card-base-100 border p-5 md:p-10 shadow-xl md:w-[70%] lg:w-[50%] mx-auto">
      <h1 className="text-xl font-bold">Create New Proposal</h1>
      <form className="mt-5 ">
        <div className="">
          <label>Description:</label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full bg-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mt-2">
          <button
            onClick={addOption}
            className="btn bg-[#79cf3b] hover:bg-[#70c931] border-none text-white my-3 w-full"
          >
            Add Option
          </button>
          <label>Options:</label>
          {optionsArray.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                className="input input-bordered w-full mb-3 bg-white"
                value={option}
                onChange={(e) => handleOptionChange(e, index)}
              />
            </div>
          ))}
        </div>
      </form>
      <button
        onClick={handleSubmit}
        className="btn bg-[#3369bf] hover:bg-[#2a4e87] border-none text-white my-5"
      >
        Create Proposal
      </button>
    </div>
  )
}

export default CreateProposal
