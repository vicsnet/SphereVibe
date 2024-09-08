"use client"
import Navbar from '@/components/Navbar'
import UploadPost from '@/components/UploadPost'
import { useAppSelector } from '@/redux/store'
import React from 'react'
import AllContents from './components/AllContents'


export default function HomeFeatures() {
  const openModal = useAppSelector((state)=>state.uploadModalReducer.isOpen);
  return (
    <main className='max-h-screen overflow-y-hidden'>
       <Navbar/> 
       <AllContents/>
       {
        openModal &&
       <UploadPost />
       }
      
    </main>
  )
}
