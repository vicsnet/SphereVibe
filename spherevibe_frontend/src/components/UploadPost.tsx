"use client";
import { closeModal } from "@/redux/features/slices/upload_slice";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function UploadPost() {
    const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState<null | string>(null);
  const [fileName, setFileName] = useState<null | string>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const handleImageClick = () => {
    document?.getElementById("imageUpload")?.click();
  };

  return (
    <section onClick={()=>dispatch(closeModal())} className="w-full h-full top-0 absolute backdrop-filter backdrop-brightness-75  ">
      <div className=" w-[50%] bg-[#F3F9FF] pt-[30px] pb-[54px] rounded-2xl mx-auto mt-[154px]">
        <div className="w-[90%] mx-auto flex justify-end mb-5">
          {/* <Image src="" alt="close post upload" width={16} height={16} /> */}
          <h2 onClick={()=>dispatch(closeModal())} className="text-[17px] font-semibold text-[#0F4880] cursor-pointer">X</h2>
        </div>
        <div className="">
          <textarea
            id="comments"
            name="comments"
            rows={10}
            className="block w-[90%] mx-auto p-3 border border-[98A2B3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-inherit"
            placeholder="Free Your Mind..."
          ></textarea>
        </div>

        <div className=" flex w-[90%] mx-auto justify-between items-center mt-[54px]">
          <div className="block">
            {/* <span className="sr-only">Choose profile photo</span> */}
            <input
              type="file"
              id="imageUpload"
              className=" w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100 hidden

    "
              onChange={handleImageUpload}
            />
            <div className="flex items-center gap-4">
              <Image
                src="/gallery-add.svg"
                alt="Image uplade"
                width={24}
                height={24}
                onClick={handleImageClick}
              />
              {fileName !== null && (
                <p className="text-[17px] font-medium leading-[25.5px] tracking-[0.5%]">
                  {fileName}
                </p>
              )}
            </div>
          </div>
          <div className="">
            <button className="text-[17px] font-medium leading-[25.5px] tracking-[0.5%] text-[#FEFEFE] bg-[#0F4880] px-[24px] rounded-lg py-[14px]">
              Create Post
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
