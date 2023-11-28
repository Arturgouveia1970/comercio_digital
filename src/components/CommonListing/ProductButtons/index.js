
'use client'

import { usePathname } from "next/navigation"

const ProductButton = () => {
  const pathName = usePathname();
  const isAdminView = pathName.includes('admin-view');

  return isAdminView ? (
    <div>
      <button
        className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
      >
        Update
      </button> 
      <button
        className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
      >
        Delete
      </button>
    </div>
  ) : (
    <>
      <button
        className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white" 
      >
        Add to Cart
      </button>
    </>
  );
}

export default ProductButton

