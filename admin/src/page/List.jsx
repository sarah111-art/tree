// import React from 'react'
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import { backendUrl, currency } from '../App'
// import { toast } from 'react-toastify'
// import { TbTrash } from 'react-icons/tb'

// const ITEMS_PER_PAGE = 10;

// const List = ({token}) => {
//   const [list, setList] = useState([]);
//   const [page, setPage] = useState(1);

//   const fetchList = async () => {
//     try {
//       const response = await axios.get(backendUrl + '/api/product/list');
//       if (response.data.success) {
//         setList(response.data.products);
//       } else {
//         toast.error('Failed to fetch products');
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error('Failed to fetch products');
//     }
//   };

//   const removeProduct = async (id) => {
//     try {
//       const response = await axios.delete(`${backendUrl}/api/product/remove/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         toast.success('Product removed successfully');
//         fetchList();
//       } else {
//         toast.error('Failed to remove product');
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('An error occurred while removing the product');
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, []);

//   // Pagination logic
//   const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
//   const paginatedList = list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

//   return (
//     <div className='px-2 sm:px-8'>
//       <div className='flex flex-col gap-2'>
//         <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr]
//         items-center py-1 px-2 bg-white bold-14 sm:bold-16 mb-3 rounded'>
//           <h5>Image</h5>
//           <h5>Name</h5>
//           <h5>Category</h5>
//           <h5>Price</h5>
//           <h5>Remove</h5>
//         </div>
//         {/* productlist  */}
//         {paginatedList.map((item) => (
//           <div key={item._id} className='grid
//            grid-cols-[1fr_1fr_1fr_1fr_1fr] 
//           md:grid-cols-[1fr_3fr_1fr_1fr_1fr] 
//           items-center gap-2 p-1 bg-white rounded-xl'>
//             <img src={item.image} alt="" className='w-12 rounded-lg'/>
//             <h5 className='text-sm font-semibold'>{item.name}</h5>
//             <h5 className='text-sm font-semibold'>{item.category}</h5>
//             <div className='text-sm font-semibold'>
//               {currency}{item.price && Object.values(item.price).length > 0 ? Object.values(item.price)[0] : 'N/A'}
//             </div>
//             <div>
//               <TbTrash onClick={() => removeProduct(item._id)}
//                 className='text-right md:text-center cursor-pointer text-lg'/>
//             </div>
//           </div>
//         ))}
//         {/* Pagination controls */}
//         <div className="flex justify-center gap-2 mt-4">
//           <button
//             onClick={() => setPage(page - 1)}
//             disabled={page === 1}
//             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="px-2">{page} / {totalPages}</span>
//           <button
//             onClick={() => setPage(page + 1)}
//             disabled={page === totalPages}
//             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default List
import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { TbTrash, TbEdit } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

const ITEMS_PER_PAGE = 10;

const List = ({token}) => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch products');
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/product/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Product removed successfully');
        fetchList();
      } else {
        toast.error('Failed to remove product');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while removing the product');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const paginatedList = list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className='px-2 sm:px-8 lg:w-[1080px]'>
      <div className='flex flex-col gap-2'>
        <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr]
        items-center py-1 px-2 bg-white bold-14 sm:bold-16 mb-3 rounded'>
          <h5>Image</h5>
          <h5>Name</h5>
          <h5>Category</h5>
          <h5>Price</h5>
          <h5>Edit</h5>
          <h5>Remove</h5>
        </div>
        {/* productlist  */}
        {paginatedList.map((item) => (
          <div key={item._id} className='grid
           grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] 
          md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] 
          items-center gap-2 p-1 bg-white rounded-xl'>
            <img src={item.image} alt="" className='w-12 rounded-lg'/>
            <h5 className='text-sm font-semibold'>{item.name}</h5>
            <h5 className='text-sm font-semibold'>{item.category}</h5>
            <div className='text-sm font-semibold'>
              {currency}{item.price && Object.values(item.price).length > 0 ? Object.values(item.price)[0] : 'N/A'}
            </div>
            <div>
              <TbEdit
                onClick={() => navigate(`/edit/${item._id}`)}
                className='text-right md:text-center cursor-pointer text-lg text-black-500 hover:text-black-700'
                title="Edit"
              />
            </div>
            <div>
              <TbTrash onClick={() => removeProduct(item._id)}
                className='text-right md:text-center cursor-pointer text-lg'/>
            </div>
          </div>
        ))}
        {/* Pagination controls */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default List