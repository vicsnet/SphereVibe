"use client";
import { closeModal } from "@/redux/features/slices/upload_slice";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import lighthouse from '@lighthouse-web3/sdk'

import { useAppSelector } from "@/redux/store";
import type { SupportedProvider } from "fhenixjs";
import { EncryptionTypes, FhenixClient, EncryptedAddress } from "fhenixjs";
import { Contract } from "ethers";
import contractABI from "../contracts/ContractABI.json";
import {contractAddress} from "../contracts/contract-address";



export default function UploadPost() {
    const dispatch = useDispatch();
    const address = useAppSelector((state)=>state.connectReducer.value.account);
    const provider = useAppSelector((state) =>state.connectReducer.value.web3Provider);
    const signer = useAppSelector((state)=>state.connectReducer.value.signer);

    // const contract = useAppSelector((state)=>state.connectReducer.value.contract);
  // const [selectedImage, setSelectedImage] = useState<null | string[]>([]);
  const [fileName, setFileName] = useState<null | string>(null);
  const [fileUrl, setFileUrl] = useState<null | string>(null);
  const [content, setContent] = useState<null | string>(null);
  const [jsonData, setJsonData] = useState({});
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');


  // create a buffer for image
  // create a json file save the buffer 
const lightHouseApiKEy= ''

// const progressCallback = (progressData:ProgressData) => {
//   let percentageDone =
//     100 - (progressData?.total / progressData?.uploaded)?.toFixed(2)
//   console.log(percentageDone)
// }
  const uploadPoast =async(e:any)=>{
    e.preventDefault();
    setLoading(true);
    const now = new Date();
   
    const newJsonData = {
      content: content,
      tags:tags,
      image: fileUrl,
      time: now,
    };
  

    if(provider && address && signer  !== null){
  const client = new FhenixClient({provider: provider as SupportedProvider  });
  

    const resultAddress = await client.encrypt_address(address);

    console.log(resultAddress.data);
    
    
    const response = await lighthouse.uploadText(JSON.stringify(newJsonData), lightHouseApiKEy, JSON.stringify(resultAddress))
    console.log(response.data.Hash);

    console.log(contractAddress);
    
    const contract = new Contract(contractAddress, contractABI, signer);

    // let txhash = await contract.createPost(response.data.Hash, resultAddress.data);
    const txhash = await contract.createPost(response.data.Hash, resultAddress.data.BYTES_PER_ELEMENT);

    console.log("hash", txhash.hash);

    await txhash.wait();
    console.log("tx mined");

    

    setLoading(false);
 

}
// to encrypt data for a Fhenix contract

  } 


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    
    if (file) {
      setLoading(true);
      const output = await lighthouse.upload(file, lightHouseApiKEy);
      console.log("fileStatus:", output);
      setFileUrl(output.data.Hash);
      // setSelectedImage(URL.createObjectURL(file));
      // setSelectedImage(file);
      setFileName(file?.[0].name);
      setLoading(false)
    }
  };

  const handleImageClick = () => {
    document?.getElementById("imageUpload")?.click();
  };

 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const words = inputValue.split(' ');

      words.forEach((word) => {
        if (word.startsWith('#') && word.length > 1 && !tags.includes(word)) {
          setTags((prevTags) => [...prevTags, word]);
         
        }
      });

      setInputValue('');
    }
  };

   // Remove tag function
   const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    
  };

  return (
    <section  className="w-full h-full top-0 absolute backdrop-filter backdrop-brightness-75  ">
      <div className=" w-[50%] bg-[#F3F9FF] pt-[30px] pb-[54px] rounded-2xl mx-auto mt-[154px]">
        <div className="w-[90%] mx-auto flex justify-end mb-5">
          {/* <Image src="" alt="close post upload" width={16} height={16} /> */}
          <h2 onClick={()=>dispatch(closeModal())} className="text-[17px] font-semibold text-[#0F4880] cursor-pointer">X</h2>
        </div>
        <div className="">
          <textarea
            id="comments"
            name="comments"
            rows={10}
            className="block w-[90%] mx-auto p-3 border border-[98A2B3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-inherit"
            placeholder="Free Your Mind..."
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          {/* hash Tags */}
          <div className="mt-4">
          <input
        type="text"
        value={inputValue}
        onChange={(e)=>setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type something and use #hashtags"
        className="w-[90%] block mx-auto p-3 border border-[98A2B3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-inherit "
      />
          </div>
        </div>
        {/* tags */}
        <div className="w-[90%] mx-auto flex gap-2 flex-wrap mt-4">
        {tags.map((tag, index) => (
          <span key={index} className="text-[17px] text-[#505050] bg-slate-200 flex gap-3 px-3 py-2 rounded-lg">
            {tag}
            <button onClick={() => removeTag(tag)} className="text-ring-blue-500 cursor-pointer">
              &times;
            </button>
          </span>
        ))}
      </div>
        <div className=" flex w-[90%] mx-auto justify-between items-center mt-[54px]">
          <div className="block">
            {/* <span className="sr-only">Choose profile photo</span> */}
            <input
              type="file"
              id="imageUpload"
              className=" w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100 hidden

    "
              onChange={handleImageUpload}
            />
            <div className="flex items-center gap-4">
              <Image
                src="/gallery-add.svg"
                alt="Image uplade"
                width={24}
                height={24}
                onClick={handleImageClick}
                className="cursor-pointer"
              />
              {fileName !== null && (
                <p className="text-[17px] font-medium leading-[25.5px] tracking-[0.5%]">
                  {fileName}
                </p>
              )}
            </div>
          </div>
          <div className="">
            <button onClick={uploadPoast} className="text-[17px] font-medium leading-[25.5px] tracking-[0.5%] text-[#FEFEFE] bg-[#0F4880] px-[24px] rounded-lg py-[14px]">
              Create Post
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
