"use client"

import React, { useState } from "react"
import { ethers } from "ethers"
import Link from "next/link"
import Image from "next/image"
import Logo from "@/../public/logo.jpg"
import { Divide as Hamburger } from "hamburger-react"

function Navbar() {
  const [walletInfoVisible, setWalletInfoVisible] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [balance, setBalance] = useState("")
  const [change, setChange] = useState(false)
  const [isOpen, setOpen] = useState(false)

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        // Cek apakah pengguna sudah terhubung ke wallet
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        if (accounts.length === 0) {
          // Jika belum terhubung, minta izin
          await window.ethereum.request({ method: "eth_requestAccounts" })
        }

        // Dapatkan alamat dan ChainID
        const address = await signer.getAddress()
        const chainId = await provider.getNetwork().chainId

        // Cek apakah ChainID sesuai dengan yang diinginkan (0x1229724)
        if (chainId !== 0x12c39c) {
          // Tambahkan jaringan yang diinginkan
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                nativeCurrency: {
                  name: "Overgear",
                  symbol: "OVR",
                  decimals: 18,
                },
                rpcUrls: [
                  "https://froopyland.dymension.xyz/26/overgear_1229724-1/evmrpc",
                ],
                chainId: "0x12C39C",
                chainName: "overgear_1229724-1",
              },
            ],
          })
        }

        // Update informasi wallet jika diperlukan
        setWalletAddress(address)
        const balance = await provider.getBalance(address)
        const formattedBalance = ethers.utils.formatEther(balance)
        setBalance(formattedBalance)
        setWalletInfoVisible(true)
      } else {
        console.error("Metamask not found")
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error)
    }
  }

  const disconnectWallet = () => {
    setWalletInfoVisible(false)
    setWalletAddress("")
    setBalance("")
  }

  const handleChange = () => {
    setChange(!change)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 md:px-10 relative overflow-x-hidden">
      <div className="flex justify-between items-center py-3 md:py-5">
        <div className="flex items-center gap-2">
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
            <Image
              src={Logo}
              alt=""
              width={100}
              height={100}
              className="w-full h-full"
            />
          </div>
          <p className="text-xl font-bold text-black">Over Vote</p>
        </div>
        <div className="lg:flex gap-10 font-semibold text-[#333333] hidden">
          <Link href={"/"} className="hover:text-[#f0f0f0]">
            Home
          </Link>
          <Link href={"vote"} className="hover:text-[#f0f0f0]">
            Vote
          </Link>
          <Link href={"faucet"} className="hover:text-[#f0f0f0]">
            Faucet
          </Link>
        </div>
        <div className="lg:flex items-center gap-8 hidden">
          {walletInfoVisible ? (
            <div>
              <div className="flex gap-5">
                <button className="btn bg-transparent text-black hover:bg-transparent ">
                  {balance}
                </button>
                <div
                  className="border text-white shadow-md px-2 rounded-lg cursor-pointer flex items-center gap-2 max-w-40 overflow-hidden"
                  onClick={handleChange}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={Logo}
                      alt=""
                      width={100}
                      height={100}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="max-w-20 text-xs text-black font-semibold overflow-hidden">
                    {walletAddress}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              className="btn bg-[#ffd700] hover:bg-[#eccc15] border-none text-black"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
        <div className="lg:hidden">
          <Hamburger color="black" toggled={isOpen} toggle={setOpen} />
          {isOpen ? (
            <div className="flex flex-col items-center gap-10 font-semibold absolute right-0 bg-[#bfd9fe] w-full z-50 py-10 top-full transition-all">
              <Link
                href={"/"}
                className="text-black hover:text-[#f0f0f0]"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <Link
                href={"vote"}
                className="text-black hover:text-[#f0f0f0]"
                onClick={() => setOpen(false)}
              >
                Vote
              </Link>
              <Link
                href={"faucet"}
                className="text-black hover:text-[#f0f0f0]"
                onClick={() => setOpen(false)}
              >
                Faucet
              </Link>
              <div className="lg:flex items-center gap-8">
                {walletInfoVisible ? (
                  <div>
                    <div className="flex gap-5">
                      <button className="btn bg-transparent text-black hover:bg-transparent ">
                        {balance}
                      </button>
                      <div
                        className="border text-white shadow-md px-2 rounded-lg cursor-pointer flex items-center gap-2 max-w-40 overflow-hidden"
                        onClick={handleChange}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={a}
                            alt=""
                            width={100}
                            height={100}
                            className="w-full h-full"
                          />
                        </div>
                        <p className="max-w-20 text-xs text-black font-semibold overflow-hidden">
                          {walletAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn btn-neutral text-white border-none"
                    onClick={connectWallet}
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-10 font-semibold absolute bg-[#bfd9fe] w-full z-50 py-10 -right-[100%] transition-all">
              <Link href={"/"} className="hover:text-[#f0f0f0]">
                Home
              </Link>
              <Link href={"vote"} className="hover:text-[#f0f0f0]">
                Vote
              </Link>
              <Link href={"faucet"} className="hover:text-[#f0f0f0]">
                Faucet
              </Link>
            </div>
          )}
        </div>
        {change ? (
          <div
            className="flex items-center max-w-64 gap-2  overflow-hidden rounded-lg absolute right-10 shadow-xl top-[80px] z-50 border"
            onClick={handleChange}
          >
            <div className="p-2 overflow-hidden">
              <p className="text-xs font-semibold">{walletAddress}</p>
            </div>
            <button
              onClick={disconnectWallet}
              className="btn bg-[#f83600] hover:bg-[#df451a] text-white border-none"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Navbar
