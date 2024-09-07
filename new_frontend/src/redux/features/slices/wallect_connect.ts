import { createSlice, PayloadAction} from "@reduxjs/toolkit"
import { Contract } from "ethers";
import { ethers,  } from "ethers";
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
    contract: null | Contract;
    error: null | string;

}


const initialState ={
    value: {
        isConnect: false,
        isError:false,
        account:null,
        web3Provider:null,
        signer:null,
        contract:null,
        error:null,

    } as ConnectState,
} as InitialState;



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
            contract: Contract
          }>)=>{
            return{
                value:{
                    isConnect: true,
                    isError:false,
                    account: action.payload.accounts,
                    web3Provider:action.payload.web3Provider,
                    signer: action.payload.signer,
                    contract: action.payload.contract,
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
                    contract:null,
                    error:action.payload
                }
            }
        }
    },
    
})

export const {disconnectWallet, connectWallet,  getError} = connect.actions;
export default connect.reducer;