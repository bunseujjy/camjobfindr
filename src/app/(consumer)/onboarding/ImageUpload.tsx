"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelected: (file: File | null) => void;
  currentImage: string | null;
}

export default function ImageUpload({
  onImageSelected,
  currentImage,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageSelected(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="relative w-[200px] h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {preview ? (
        <Image
          src={preview || currentImage || "/placeholder.svg"}
          alt="Company Logo Preview"
          width={100}
          height={100}
          quality={100}
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Click to upload company logo
          </p>
        </div>
      )}
    </div>
  );
}
