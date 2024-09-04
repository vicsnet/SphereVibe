import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit"
import { Contract } from "ethers";
import { ethers, JsonRpcProvider } from "ethers";
// import Web3 from "web3";



type InitialState ={
    value: ConnectState;
}

type ConnectState = {
    isConnect: boolean;
    isError: boolean;
    account: null | string;
    web3Provider: null |ethers.BrowserProvider;
    signer: null | ethers.JsonRpcSigner;
    // contract: null | Contract;
    error: null | string;

}


const initialState ={
    value: {
        isConnect: false,
        isError:false,
        account:null,
        web3Provider:null,
        signer:null,
        // contract:null,
        error:null,

    } as ConnectState,
} as InitialState;


// export const connectWallet = createAsyncThunk(
//     'wallectConnect/connectWallet',
//     async (_, { rejectWithValue }) => {
//       if (typeof window.ethereum === "undefined") {
//         return rejectWithValue("MetaMask is not installed. Please install it to use this dApp!");
//       }
  
//       try {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         await window.ethereum.request({ method: 'eth_requestAccounts' });
//         const signer = await provider.getSigner();
//         const account = await signer.getAddress();
  
//         return {
//           accounts: account,
//           web3Provider: provider,
//           signer: signer,
//         };
//       } catch (err) {
//         return rejectWithValue("Failed to connect to wallet.");
//       }
//     }
//   );

export const connect = createSlice({
    name: "wallectConnect",
    initialState,
    reducers:{
        disconnectWallet: ()=>{
            return initialState;
        },
        connectWallet:(state, action: PayloadAction<{
            accounts: string;
            web3Provider: ethers.BrowserProvider;
            signer: ethers.JsonRpcSigner;
            // contract: Contract
          }>)=>{
            return{
                value:{
                    isConnect: true,
                    isError:false,
                    account: action.payload.accounts,
                    web3Provider:action.payload.web3Provider,
                    signer: action.payload.signer,
                    // contract: action.payload.contract,
                    error:null
                }
            }
        },
        getError:(state, action:PayloadAction<string>)=>{
            return{
                value:{
                    isConnect: false,
                    isError:true,
                    account: null,
                    web3Provider:null,
                    signer: null,
                    // contract:null,
                    error:action.payload
                }
            }
        }
    },
    extraReducers: (builder) => {
        // builder
        //   .addCase(connectWallet.fulfilled, (state, action) => {
        //     state.value.isConnect = true;
        //     state.value.isError = false;
        //     state.value.account = action.payload.accounts;
        //     state.value.web3Provider = action.payload.web3Provider;
        //     state.value.signer = action.payload.signer;
        //     state.value.error = null;
        //   })
        //   .addCase(connectWallet.rejected, (state, action) => {
        //     state.value.isConnect = false;
        //     state.value.isError = true;
        //     state.value.account = null;
        //     state.value.web3Provider = null;
        //     state.value.signer = null;
        //     state.value.error = action.payload as string;
        //   });
      }
})

export const {disconnectWallet, connectWallet,  getError} = connect.actions;
export default connect.reducer;