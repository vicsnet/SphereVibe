"use client";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractABI from "../contracts/ContractABI.json";
import contractAddress from "../contracts/contract-address";
import {
  disconnectWallet,
  connectWallet,
  getError,
} from "@/redux/features/slices/wallect_connect";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import Image from "next/image";
import { openModal } from "@/redux/features/slices/upload_slice";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const account = useAppSelector((state) => state.connectReducer.value.account);
  const isConnect = useAppSelector(
    (state) => state.connectReducer.value.isConnect,
  );

  const isError = useAppSelector((state) => state.connectReducer.value.error);

  
  // const [account, setAccount] = useState<string | null>(null);
  // const [web3Provider, setWeb3Provider] = useState<Web3 | null>(null);
  // const [contract, setContract]= useState<any>(null);

  const connectWalletHandler = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);

      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts: string[] = await web3.eth.getAccounts();
        // setAccount(accounts[0]);
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        dispatch(
          connectWallet({
            accounts: accounts[0],
            web3Provider: web3,
            contract,
          }),
        );
        // setWeb3Provider(web3);
        // setContract(contract);
      } catch (error) {
        const errorMsg = "user denied account accesss:";
        dispatch(getError(errorMsg));
        console.error("user denied account accesss:", error);
      }
    } else {
      alert("Please install Metamask");
    }
  };

  const disconnectWalletHAndler = async () => {
    // setAccount(null);
    // setWeb3Provider(null);
    // setContract(null)
    dispatch(disconnectWallet());
    console.log("Wallet disconnected");
  };
  useEffect(() => {
    // if (typeof window.ethereum !== 'undefined'){
    //     const web3 = new Web3(window.ethereum);
    //     const connectWallet = async() =>{
    //         try {
    //             await window?.ethereum?.request({method: "eth_requestAccounts"});
    //             const accounts = await web3.eth.getAccounts();
    //             setAccount(accounts[0]);
    //             // Listen to account changed
    //             window?.ethereum?.on("accountsChanged", (accounts) =>{
    //                 setAccount(accounts[0])
    //             })
    //         } catch (error) {
    //             console.error("User denied account access:",error)
    //         }
    //     };
    //     connectWallet();
    // }else{
    //     console.log("Metamas is not installed");
    // }
  }, []);

  return (
    <main className="w-[100%] ">
      <section className="w-[100%] h-[110px] flex justify-between items-center px-24 bg-[#F3F9FF]">
        <div className="flex items-center gap-4">

        <Image src="/logo.svg" alt="Logo" width={200} height={44.85} />

        <ul className="flex items-center gap-8">
          <li className="text-[17px] font-medium leading-[25.5px] tracking-[0.5%] text-[#061D33] ">
            Top Post
          </li>
          <li className="text-[17px] font-medium leading-[25.5px] tracking-[0.5%] text-[#061D33] ">
            Trend Feed
          </li>
        </ul>
        </div>

        
        <div className="relative block w-[40%] ">
  <span className="sr-only">Search</span>
  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
  <Image src="/search-normal.svg" alt="search" width={16} height={16} />
  </span>
  <input className="placeholder:italic placeholder:text-slate-400 block  w-full border border-slate-300 rounded-[36px] py-4 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Search ..." type="text" name="search"/>
</div>

        <ul className="flex gap-12 items-center">
          <li onClick={()=>dispatch(openModal())} className="text-[17px] font-medium leading-[25.5px] tracking-[0.5%] text-[#061D33] cursor-pointer ">
            Upload Post
          </li>
          {
            isConnect ?

          <li onClick={ disconnectWalletHAndler} className="text-[17px] cursor-pointer font-medium leading-[25.5px] tracking-[0.5%] bg-[#0F4880] px-[24px] py-[14px] rounded-lg text-[#FEFEFE]  ">
            {`${account?.slice(0, 4)}..${account?.slice(-3)}`}
          </li>
          :

          <li onClick={connectWalletHandler} className="text-[17px] cursor-pointer font-medium leading-[25.5px] tracking-[0.5%] bg-[#0F4880] px-[24px] py-[14px] rounded-lg text-[#FEFEFE]  ">
             Connect wallet
          </li>
          }
        </ul>
      </section>
    </main>
  );
}
