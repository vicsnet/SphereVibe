"use client"
import Navbar from '@/components/Navbar'
import UploadPost from '@/components/UploadPost'
import { useAppSelector } from '@/redux/store'
import React from 'react'

export default function HomeFeatures() {
  const openModal = useAppSelector((state)=>state.uploadModalReducer.isOpen);
  return (
    <main>
       <Navbar/> 
       {
        openModal &&
       <UploadPost />
       }
    </main>
  )
}
