import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState ={
    isOpen: false,
}

export const uploadModal = createSlice({
    name:"uploadSlice",
    initialState,
    reducers:{
        openModal: () =>{
            return{
                isOpen:true,
            }
        },
        closeModal: () =>{
            return{
                isOpen:false,
            }
        }
    }
})

export const {openModal, closeModal} = uploadModal.actions;
export default uploadModal.reducer;