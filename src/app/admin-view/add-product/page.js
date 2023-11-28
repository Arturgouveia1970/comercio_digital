"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import TileComponent from "@/components/FormElements/TileComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { AddNewProduct } from "@/services/product";
import { addNewProduct, updateAProduct } from "@/services/product";

import {
  AvailableSizes,
  adminAddProductformControls,
  firebaseConfig,
  firebaseStorageURL,
} from "@/utils";

import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { resolve } from "styled-jsx/css";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStorageURL)

const createUniqueFileName = (getFile) => {
  const timeStamp = Date.now();
  const randomStringValue = Math.random().toString(36).substring(2, 12);

  return `${getFile.name}-${timeStamp}-${randomStringValue}`;
};

async function helperForUPloadingImageToFirebase(file) {
  const getFileName = createUniqueFileName(file);
  const storageReference = ref(storage, `ecommerce/${getFileName}`);
  const uploadImage = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadImage.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then((downloadUrl) => resolve(downloadUrl))
          .catch((error) => reject(error));
      }
    );
  });
}

const initialformData = {
  name: "",
  price: 0,
  description: "",
  category: "men",
  sizes: [],
  deliveryInfo: "",
  onSale: "no",
  imageUrl: "",
  priceDrop: 0,
};
export default function AdminAddNewProduct() {
  const [formData, setformData] = useState(initialformData);
  const { ComponentLevelLoader, setComponentLevelLoader } = useContext(GlobalContext);
  const router = useRouter();

  async function handleImage(event) {
    const extractImageUrl = await helperForUPloadingImageToFirebase(
      event.target.files[0]
    );

    if (extractImageUrl !== '') {
      setformData({ 
        ...formData, 
        imageUrl: extractImageUrl, 
      });
    }
  }

  
  function handleTileClick(getCurrentItem) {
    let cpySizes = [...formData.sizes];
    const index = cpySizes.findIndex(item => item.id === getCurrentItem.id)

    if (index === -1) {
      cpySizes.push(getCurrentItem);
    } else {
      cpySizes = cpySizes.filter(item => item.id !== getCurrentItem.id);
    }

    setformData({
      ...formData,
      sizes: cpySizes
    });
  }

  async function handleAddProduct() {
    setComponentLevelLoader({ loading: true, id: '' });
    const res = await AddNewProduct(formData);
    console.log(res)

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: '' })
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setformData(initialformData);
      setTimeout(() => {
        router.push('/admin-view/all-products');
      }, 1000);
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
    });
    setComponentLevelLoader({ loading: false, id: '' })
    setformData(initialformData)
  }
}

  return (
    <div className="w-full mt-5 mr-0 mb-0 ml-0 relative">
      <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative">
        <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
         <input 
          accept="image/*"
          max="1000000"
          type="file"
          onChange={handleImage}
         />
         <div className="flex gap-2 flex-col">
           <label>Available sizes</label>
           <TileComponent 
             selected={formData.sizes}
             onClick={handleTileClick}
             data={AvailableSizes} 
           />
         </div> 
         {adminAddProductformControls.map((controlItem) =>
            controlItem.componentType === 'input' ? (
            <InputComponent 
              type={controlItem.type}
              placeholder={controlItem.placeholder}
              label={controlItem.label}
              value={formData[controlItem.id]}
              onChange={(event) => {
                setformData({
                  ...formData,
                  [controlItem.id]: event.target.value,
                })
              }} 
            />
            ) :
            controlItem.componentType === 'select' ? (
            <SelectComponent 
              label={controlItem.label}
              options={controlItem.options}
              value={formData[controlItem.id]}
              onChange={(event) => {
                setformData({
                  ...formData,
                  [controlItem.id]: event.target.value,
                })
              }} 
            />  
            ) : null
          )}
            <button
              onClick={handleAddProduct}
              className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium uppercase tracking-white"
            >
              {
                ComponentLevelLoader && ComponentLevelLoader.loading ? (
                  <ComponentLevelLoader 
                    text={'Adding product'}
                    color={'#ffffff'}
                    loading={
                      ComponentLevelLoader && ComponentLevelLoader.loading
                    }
                  /> 
                ) : ( 'Add Product'
              )}            
            </button>
        </div>
      </div>
      <Notification />
    </div>
  )  
}
