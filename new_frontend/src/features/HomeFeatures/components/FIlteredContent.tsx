"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";
// import lighthouse from "@lighthouse-web3/sdk";
// import axios from "axios";

import { FaRegThumbsUp, FaWallet } from "react-icons/fa";
import { useAppSelector } from "@/redux/store";
import { Contract } from "ethers";
import { contractAddress } from "@/contracts/contract-address";
import contractABI from "../../../contracts/ContractABI.json";
import TipForm from "./TipForm"

interface ContentProps{
 
    content: any,
  likes: any,
  report: number,
  item: number,
  creator:any,
  image:string,
  tags:string[],
  time:string
}
export default function FilteredContent({ content,  likes, report, item, creator, image, tags,time }:ContentProps) {

  // const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [likeStatus, setLikeStatus] = useState(false);
  // const [time, setTime] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  // const [tags, setTags] = useState([])
// open Tip modal
const [openTip, setOpenTip] = useState(false);
  
  const contract = useAppSelector(
    (state) => state.connectReducer.value.contract,
  );
  const adderess = useAppSelector(
    (state) => state.connectReducer.value.account,
  );
  const signer = useAppSelector((state) => state.connectReducer.value.signer);

  const data = async () => {
    if (contract !== null) {
      const response = await contract.myLikePost(item, adderess);
      // console.log("rr", response);

      setLikeStatus(response);
    }
  };

  const LikePost = async () => {
    if (signer) {
      const contractInteract = new Contract(
        contractAddress,
        contractABI,
        signer,
      );

      const tx = await contractInteract.likePost(item);
      console.log("LikedPost", tx.hash);

      await tx.wait();
      alert("post liked")
      console.log("Like tx mined");
    } else {
      setError("Connect Your Wallet");
    }
  };



  function timeAgoFromDB(dbDate: string): string {
    const messageTime = new Date(dbDate); // Convert ISO string to Date object
    const now = new Date();
    
    const secondsAgo = Math.floor((now.getTime() - messageTime.getTime()) / 1000);
  
    const minutes = Math.floor(secondsAgo / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
  
    if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return `${weeks} weeks ago`;
  }
  
  useEffect(() => {
   
    if (item) {
      data();
    }

    if(time){
      
      const date = timeAgoFromDB(time);
      setCurrentTime(date)
     
      
  
    }
  }, [ content, image, item,  time, ]);

  return (
    <div className="" >

    <section className="w-[50%] border-b-[1px] boreder-b-[#98A2B3] mx-auto pb-[12px]">
      <div className="flex gap-2">
        
        <h2 className="text-[17px] leading-[25.5px] tracking-[0.5%] text-[#505050]">
          @{Number(creator)}
        </h2>
        <p className="text-[#505050] text-[30px]">.</p>
        <p className="text-[#505050] text-[17px] leading-[25.5px] tracking-[0.5%]">
          {currentTime}
        </p>
      </div>
      <div className="mb-2">
        <p className="text-[17px] leading-[25.5px] tracking-[0.5%] mb-2">
          {content}
        </p>
        {/* tags */}
        <div className=" flex gap-2 flex-wrap  mb-2">
          {tags && tags?.length > 0 &&
            tags.map((tag, item)=>(
              <p key={item} className="text-[16px] leading-5 text-[#1d2a37]">{tag}</p>
            ))
          }
        </div>
        {image === null || image === "" ? (
          <></>
        ) : (
          <Image
            src={`https://gateway.lighthouse.storage/ipfs/${image}`}
            alt="content image"
            width={500}
            height={500}
            layout="responive"
          />
        )}
      </div>
      <div className="mt-4 pt-4 flex gap-8">
      {/* Like */}
        <div className=" flex gap-4 items-center">
         
          <FaRegThumbsUp
            onClick={LikePost}
            size={20}
            style={{
              color: likeStatus === true ? "red" : "initial",
            }}
          />
          <p className="text-[#505050] text-[17px]">{Number(likes) === 0 ? "" : likes}</p>
        </div>
      
      {/* Tip */}
        <div onClick={()=>setOpenTip(true)} className=" flex gap-4 items-center">
         
          <FaWallet 
           
            size={20}
            style={{
              color: likeStatus === true ? "red" : "initial",
            }}
          />
          <p className="text-[#505050] text-[17px]">Tip</p>
        </div>
      </div>
    </section>
      {
        openTip === true &&
      <TipForm id={item} close={()=>setOpenTip(false)}/>
      }
    </div>
  );
}
