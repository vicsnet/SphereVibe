import { contractAddress, testToken } from "@/contracts/contract-address";
import { useAppSelector } from "@/redux/store";
import { Contract } from "ethers";
import React, { useState } from "react";
import contractABI from "../../../contracts/ContractABI.json";
import tokenABI from "../../../contracts/tokenABI.json";
import { FhenixClient, SupportedProvider } from "fhenixjs";

interface TipFormProps {
  id:Number,
  close: () => void;  
}
export default function TipForm({id, close}: TipFormProps) {
  const signer = useAppSelector((state) => state.connectReducer.value.signer);
  const provider = useAppSelector((state) =>state.connectReducer.value.web3Provider);

  const [amount, setAmount] = useState<number>(0)

  const [loading, setLoading] = useState(false);

  const handleTip = async () => {
    if (provider && signer && amount !== 0) {
      setLoading(true);
      const client = new FhenixClient({provider: provider as SupportedProvider  });
     
      const result = await client.encrypt_uint256(amount.toString());

      console.log("rest", result.data);
      
      const contractInteract = new Contract(
        contractAddress,
        contractABI,
        signer,
      );
      const tokenInteraction = new Contract(
        testToken,
        tokenABI,
        signer,
      );

      const txToken = await tokenInteraction.approve(contractAddress, amount);

      await txToken.wait()
      console.log("tokne approved");
      

      const tx = await contractInteract.tip(id, result.data.buffer, testToken);
      console.log("LikedPost", tx.hash);

      await tx.wait();
      console.log("Like tx mined");
      setLoading(false);
    } else {
      // setError("Connect Your Wallet");
    }
  };

  return (
    <section className="absolute top-0 w-full h-full backdrop-filter backdrop-brightness-75">
      <div className="w-[40%] bg-[#F3F9FF] py-10 mx-auto ">
      <div className="w-[90%] mx-auto flex justify-end mb-5">
          {/* <Image src="" alt="close post upload" width={16} height={16} /> */}
          <h2 onClick={close} className="text-[17px] font-semibold text-[#0F4880] cursor-pointer">X</h2>
        </div>
        <h2 className="text-[20px] text-center text-[#061D33] font-semibold">Tip Creator</h2>

        <div className=" w-[70%] mx-auto flex flex-col gap-4 mt-[50px]">
          <label className="block">
            <span className="block text-sm font-medium text-slate-700">
              Enter Amount
            </span>
            <input
            type="number"
              className="mt-2 border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 tesxt-sm placeholder:text-sm px-5 h-[50px] w-[100%] rounded-lg"
              
              placeholder="input amount ..."
              onChange={(e)=>setAmount(Number(e.target.value))}
            />
            

            <p className="mt-2 opacity-10 contrast-more:opacity-100 text-slate-600 text-sm">
              Gift our Content Creator.
            </p>
          </label>

          <button
            onClick={handleTip}
            className="text-[17px] font-medium leading-[25.5px] tracking-[0.5%] text-[#FEFEFE] bg-[#0F4880] px-[24px] rounded-lg py-[14px]"
          >
            {
              loading === true ? "Loading ..." :

            "Gift Creator"
            }
          </button>
        </div>
      </div>
    </section>
  );
}
