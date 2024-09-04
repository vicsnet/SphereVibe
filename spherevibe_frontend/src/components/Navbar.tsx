"use client";
import React, { useEffect, useState } from "react";

import contractABI from "../contracts/ContractABI.json";
import {contractAddress} from "../contracts/contract-address";

import {
  disconnectWallet,
  connectWallet,
  getError,
} from "@/redux/features/slices/wallect_connect";

import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import Image from "next/image";
import { openModal } from "@/redux/features/slices/upload_slice";
import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers";
import { Contract } from "ethers";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const account = useAppSelector((state) => state.connectReducer.value.account);
  const isConnect = useAppSelector(
    (state) => state.connectReducer.value.isConnect,
  );

  const isError = useAppSelector((state) => state.connectReducer.value.error);

  

  const connectWalletHandler =async  () => {
    if (typeof window.ethereum !== "undefined" ) {
    try {
       

        const provider =  new ethers.BrowserProvider(window.ethereum);

        await window.ethereum.request({ method: 'eth_requestAccounts' });


        const signer =  await provider.getSigner();

        const account = await signer.getAddress();

        // const contract = await new Contract(contractAddress, contractABI, provider);


        let data ={
          accounts: account,
          web3Provider: provider,
          signer: signer,
          // contract
        }

        dispatch(connectWallet(data));

       
        
      }  catch (err) {
        console.error(err);
        const msg ="Failed to connect to wallet."
          dispatch(getError(msg))
        // setError('Failed to connect to wallet.');
      }
    }
      else {
        const msg ="MetaMask is not installed. Please install it to use this dApp!"
        dispatch(getError(msg))
       
      }
    // dispatch(connectWallet());
  };


  const disconnectWalletHAndler = async () => {

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
