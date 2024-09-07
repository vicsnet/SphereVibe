'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
// import { initializeCount } from '../redux/features/counter/counterSlice'

export function ReduxProvider({children}: {children: React.ReactNode}){
  return <Provider store={store}>
    {children}
  </Provider>
}