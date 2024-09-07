import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type contentState ={
    // allContentData: null | any[] ;
    searchQuery:string,
    trendfeedStatus:boolean,
    AllState:boolean
}
const initialState ={
    // allContentData:null,
    searchQuery: "",
    trendfeedStatus:false,
    AllState:true
} as contentState;


export const content = createSlice({
    name:"contentSlice",
    initialState,
    reducers:{
        search:(state, action:PayloadAction<string>)=>{
            return{
                searchQuery: action.payload,
                trendfeedStatus:false,
                AllState:false,
            }
        },
        trendFeedClicked: (state, action:PayloadAction<boolean>)=>{
            return{
                searchQuery:"",
                trendfeedStatus: action.payload,
                AllState:false,
            }
        }
        ,
        disable: (state, action:PayloadAction<boolean>)=>{
            return{
                searchQuery:"",
                trendfeedStatus: false,
                AllState:action.payload,
            }
        }
    }

})

export const {search, trendFeedClicked, disable} = content.actions;
export default content.reducer;