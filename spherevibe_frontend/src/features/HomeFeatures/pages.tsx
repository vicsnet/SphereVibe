"use client"
import Navbar from '@/components/Navbar'
import UploadPost from '@/components/UploadPost'
import { useAppSelector } from '@/redux/store'
import React from 'react'
import AllContents from './components/AllContents'
import TipForm from './components/TipForm'

export default function HomeFeatures() {
  const openModal = useAppSelector((state)=>state.uploadModalReducer.isOpen);
  return (
    <main>
       <Navbar/> 
       <AllContents/>
       {
        openModal &&
       <UploadPost />
       }
      
    </main>
  )
}
