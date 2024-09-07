import { configureStore } from "@reduxjs/toolkit";
import connectReducer from './features/slices/wallect_connect'
import uploadModalReducer  from "./features/slices/upload_slice";
import contentReducer from "./features/slices/content_slice"
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
      reducer: {
        connectReducer,
        uploadModalReducer,
        contentReducer
      },
    });
  
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

  