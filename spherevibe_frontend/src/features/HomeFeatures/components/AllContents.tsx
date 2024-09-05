import React, { useEffect, useState } from "react";
import Content from "./Content";
import { useAppSelector } from "@/redux/store";
import { FhenixClient, getPermit, SupportedProvider } from "fhenixjs";
import { contractAddress } from "@/contracts/contract-address";

// type DataObject = {
//   hash: string;
//   likes: number;
//   report: number;
// };
interface DataObject {
  [key: string]: number[];
}
export default function AllContents() {
  const contract = useAppSelector(
    (state) => state.connectReducer.value.contract,
  );
  const provider = useAppSelector(
    (state) => state.connectReducer.value.web3Provider,
  );
  const adderess = useAppSelector((state)=>state.connectReducer.value.account);

  const [myContent, setMyContent] = useState<unknown[][]>([]);

 

  const data = async () => {
    if (provider !== null) {
      const client = new FhenixClient({
        provider: provider as SupportedProvider,
      });

      const permit = await getPermit(
        contractAddress,
        provider as SupportedProvider,
      );
      if (contract && permit !== null) {
        client.storePermit(permit);
        const response = await contract.readAllPost(permit, adderess );


    

        const combinedData: unknown[][] = (response as unknown[][])?.[0]?.map((_, index) =>
      (response as unknown[][]).map((arr) => arr[index])
    ) || [];

   console.log('ddsss',combinedData);
   
    setMyContent(combinedData);
    };

      }
    }
  

  useEffect(() => {
    data();
  }, [provider]);

  return (
    <div>
      {
        myContent.map((data, item)=>(

          <Content creator={data[4]} item={Number(data[0])} hash={data[1]} likes={Number(data[2])} report={Number(data[3])} />
        ))
      }
    </div>
  );
}
