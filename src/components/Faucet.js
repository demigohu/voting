import React, { useState } from "react"
import { ethers } from "ethers"
import Swal from "sweetalert2"

const Faucet = () => {
  const [recipientAddress, setRecipientAddress] = useState("")
  const [transactionHash, setTransactionHash] = useState(null)

  const requestFaucet = async () => {
    try {
      if (!recipientAddress) {
        alert("Please enter a recipient address.")
        return
      }

      const privateKey =
        "d2aae833d170cc00e0729556f197997657b0f7ade528357e15b599f04399ba1c" // Ganti dengan private key Anda
      const toAddress = recipientAddress.trim()
      const amountToSend = ethers.utils.parseEther("10.0")

      const provider = new ethers.providers.JsonRpcProvider(
        "https://froopyland.dymension.xyz/26/overgear_1229724-1/evmrpc"
      )
      const wallet = new ethers.Wallet(privateKey, provider)

      // Mendapatkan nonce
      const nonce = await provider.getTransactionCount(
        wallet.address,
        "pending"
      )

      const transaction = {
        to: toAddress,
        value: amountToSend,
        nonce: nonce,
      }

      // Menandatangani dan mengirimkan transaksi
      const signedTransaction = await wallet.sendTransaction(transaction)
      setTransactionHash(signedTransaction.hash)
      Swal.fire({
        text: signedTransaction.hash,
        title: "Transaction sent successfully!",
        icon: "success",
        customClass: {
          popup: "swal-custom-popup",
        },
      })

      setRecipientAddress("")
    } catch (error) {
      console.error("Transaction failed:", error.message)
      alert("Transaction failed. Check the console for details.")
    }
  }

  return (
    <div className="card border shadow-md w-[50%] mx-auto">
      <div className="card-body flex-grow-0">
        <h2 className="card-title mb-5">Faucet Page</h2>
        <p>Recipient Address :</p>
        <input
          type="text"
          id="recipientAddress"
          placeholder="Enter recipient address"
          onChange={(e) => setRecipientAddress(e.target.value)}
          value={recipientAddress}
          className="input input-bordered w-full bg-white"
        />
        <button
          onClick={requestFaucet}
          className="btn btn-neutral text-white mt-5"
        >
          Request 10 Ether
        </button>
      </div>
    </div>
  )
}

export default Faucet
