import React, { useEffect, useState } from "react";
import Content from "./Content";
import { useAppSelector } from "@/redux/store";
import { FhenixClient, getPermit, SupportedProvider } from "fhenixjs";
import { contractAddress } from "@/contracts/contract-address";
import axios from "axios";
import FilteredContent from "./FIlteredContent";

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
  const trendFeedStatus = useAppSelector((state)=>state.contentReducer.trendfeedStatus);
  const AllState = useAppSelector((state)=>state.contentReducer.AllState);

  const [myContent, setMyContent] = useState<unknown[][]>([]);

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [sortedData, setSortedData] = useState<any[]>([]);
  const searchQuery = useAppSelector((state)=>state.contentReducer.searchQuery);
 

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

  //  console.log('ddsss',combinedData);
   
    setMyContent(combinedData);
    };

      }
    }

    const fetchDataAndFilter = async () => {
      const tagOccurrences: Record<string, any[]> = {};

      for (const array of myContent) {
        const id = array[0]
        const dataArr = array[1]; 
        const likes = array[2]
        const reports =array[3];
        const creator = array[4]
        // console.log("da", dataArr);
        

        try {
          const response = await axios.get( `https://gateway.lighthouse.storage/ipfs/${dataArr}`);
          const { data } = response;
          const tags: string[] = data.tags;
            
            
          // Filter based on search query
          if (tags.some(tag => tag?.includes(searchQuery))) {
            if (!tagOccurrences[searchQuery]) {
              tagOccurrences[searchQuery] = [];
            }
            // console.log('tags Filtered',data);
            
            tagOccurrences[searchQuery].push({...data, id, likes, reports, creator });
            
            
          }
          
        } catch (error) {
          console.error(`Error fetching data from ${dataArr}:`, error);
        }
      }
   

      setFilteredData(tagOccurrences[searchQuery] || []);
    };

    const fetchDataAndSort = async () => {
      try {
        const updatedDataArray = await Promise.all(
          myContent.map(async (item) => {
            // Fetch data from IPFS using Axios
            const response = await axios.get(`https://gateway.lighthouse.storage/ipfs/${item[1]}`);
            const ipfsData = response.data;
  
            // Assuming `ipfsData` contains tags in a `tags` field
            const tags = ipfsData.tags || [];
            const content = ipfsData.content;
            const image = ipfsData.image;
            const time = ipfsData.time;
  
            return { ...item, tags, content, image, time }; // Add the tags to the content item
          })
        );
  
        // Step 1: Count occurrences of each tag
        const tagCount: Record<string, number> = {};
        updatedDataArray.forEach((item) => {
          item.tags?.forEach((tag:any) => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          });
        });
  
        // Step 2: Sort updatedDataArray by the most frequent tag occurrence
        const sorted = [...updatedDataArray].sort((a, b) => {
          // Get the sum of tag occurrences for each content item
          const aTagCount = a.tags?.reduce((count:any, tag:any) => count + (tagCount[tag] || 0), 0) || 0;
          const bTagCount = b.tags?.reduce((count:any, tag:any) => count + (tagCount[tag] || 0), 0) || 0;
  
          return bTagCount - aTagCount; // Sort descending (highest first)
        });
  // console.log("sorted", sorted);
  
        setSortedData(sorted);
      } catch (error) {
        console.error("Error fetching IPFS data:", error);
      }
    };
  
  

  useEffect(() => {
    data();
    if(searchQuery){

      fetchDataAndFilter();
    }
    if(trendFeedStatus){
      fetchDataAndSort();

    }
      
      
     
  

    
  }, [provider, searchQuery, trendFeedStatus, filteredData, AllState,  ]);

  return (
    <div>
      {
        sortedData.length > 0 &&

      <div className="h-screen overflow-y-scroll">
        {sortedData.map((data, item)=>(
          <div key={item} className="mt-2">
          
          <FilteredContent  content={data.content} likes={data[2]}  report={data[3]} item={data.id} creator={data[4]} image={data.image} tags={data.tags} time={data.time}/>
          </div>
        ))}
      </div>
      }

{searchQuery !== "" && sortedData.length === 0 && AllState === false?
     <div className="h-screen overflow-y-scroll">
     {
         filteredData.length > 0 ?
        <>
        {filteredData.map((data, item)=>
        (
          <div key={item} className="mt-2">
            
          <FilteredContent content={data.content} likes={data[2]}  report={data[3]} item={data[0]} creator={data[4]} image={data.image} tags={data.tags} time={data.time}/>
          </div>
        )
        )}
        </>

        :
        <p>No results found</p>
      }
     </div>
     
      

      :
       <div className="h-screen overflow-y-scroll">
       { myContent.map((data, item)=>(
        <div key={item} className="mt-2">

          <Content creator={data[4]} item={Number(data[0])} hash={data[1]} likes={Number(data[2])} report={Number(data[3])} />
        </div>
        ))}
        </div>}
      
    </div>
  );
}
