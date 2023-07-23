import { useEffect, useState } from "react";
import Switch from "react-switch";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BSC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BSC_CONTRACT_ADDRESS;
const MUMBAI_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MUMBAI_CONTRACT_ADDRESS;
const MUMBAI_RPC_URL = process.env.NEXT_PUBLIC_MUMBAI_RPC_URL;

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");
  const [sourceChain, setSourceChain] = useState("");

  const { config } = usePrepareContractWrite({
    // Calling a hook to prepare the contract write configuration
    address: BSC_CONTRACT_ADDRESS, // Address of the BSC contract
    abi: SendMessageContract.abi, // ABI (Application Binary Interface) of the contract
    functionName: "sendMessage", // Name of the function to call on the contract
    args: ["polygon_mumbai", MUMBAI_CONTRACT_ADDRESS, message], // Arguments to pass to the contract function
    value: ethers.utils.parseEther("0.01"), // Value to send along with the contract call for gas fee
  });

  const { data: useContractWriteData, write } = useContractWrite(config);

  const { data: useWaitForTransactionData, isSuccess } = useWaitForTransaction({
    hash: useContractWriteData?.hash, // Hash of the transaction obtained from the contract write data
  });

  const handleSendMessage = () => {
    write(); // Initiating the contract call

    toast.info("Sending message...", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });
  };

  useEffect(() => {
    const body = document.querySelector("body");
    darkMode ? body.classList.add("dark") : body.classList.remove("dark");

    isSuccess
      ? toast.success("Message sent!", {
          position: "top-right",
          autoClose: 7000,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        })
      : useWaitForTransactionData?.error || useContractWriteData?.error
      ? toast.error("Error sending message")
      : null;
  }, [darkMode, useContractWriteData, useWaitForTransactionData]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="container mx-auto px-4 flex flex-col min-h-screen">
      <header className="py-4">
        <div className="flex justify-between items-center">
          <Switch
            onChange={handleToggleDarkMode}
            checked={darkMode}
            onColor="#4F46E5"
            offColor="#D1D5DB"
            uncheckedIcon={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: 15,
                  color: "#FFF",
                  paddingRight: 2,
                }}
              >
                ☀️
              </div>
            }
            checkedIcon={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: 15,
                  color: "#FFF",
                  paddingRight: 2,
                }}
              >
                🌙
              </div>
            }
            className="react-switch"
          />
          <ConnectButton />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Fullstack Interchain dApp with{" "}
          <span className="text-blue-500">Axelar 🔥 </span>
        </h1>
        <p className=" mb-8 text-center max-w-3xl text-gray-500">
          An interchain decentralized application using React, Solidity, and
          Axelar General Message Passing that allows users to send messages
          between two chains.
        </p>

        <div className="flex justify-center max-w-3xl">
          <div className="border border-gray-300 rounded-lg p-8 m-2 ">
            <h2 className="text-2xl font-bold mb-4">Send Message 📓 </h2>
            <textarea
              type="text"
              placeholder="Message"
              className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full"
              onClick={() => handleSendMessage()}
            >
              Send
            </button>
          </div>

          <div className="border border-gray-300 rounded-lg p-8 m-2 w-2/5">
            <h2 className="text-2xl font-bold mb-4">Response 🎉 </h2>
            {"" ? (
              <>
                <p className="font-semibold mb-4">
                  From:{" "}
                  <span className="font-normal text-gray-500">
                    {" "}
                    {sourceChain.charAt(0).toUpperCase() + sourceChain.slice(1)}
                  </span>
                </p>
                <p className="font-semibold mb-4">
                  To:{" "}
                  <span className="font-normal text-gray-500">
                    {sourceChain ? "Avalanche" : null}
                  </span>
                </p>
                <p className="font-semibold mb-4">
                  Message:{" "}
                  <span className="font-normal text-gray-500">{value}</span>
                </p>
              </>
            ) : (
              <span className="text-red-500 ">waiting for response...</span>
            )}
          </div>
        </div>
      </main>
      <ToastContainer />
      <footer className="flex justify-center items-center py-8 border-t border-gray-300">
        <a
          href="https://github.com/Rahul-Prasad-07/Cross-Chain-Dapp/tree/main"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center font-bold text-blue-500 text-lg"
        >
          View on GitHub &rarr;
        </a>
      </footer>
    </div>
  );
}
