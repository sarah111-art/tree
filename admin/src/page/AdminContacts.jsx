import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const ITEMS_PER_PAGE = 10

const AdminContacts = ({ token }) => {
  const [contacts, setContacts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(
          backendUrl + '/api/contact/all',
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (res.data.success) setContacts(res.data.contacts)
        else toast.error('Failed to fetch contacts')
      } catch (err) {
        toast.error('Error loading contacts')
      }
      setLoading(false)
    }
    fetchContacts()
  }, [token])

  // Pagination logic
  const totalPages = Math.ceil(contacts.length / ITEMS_PER_PAGE)
  const paginatedContacts = contacts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  if (loading) return <div className="text-center mt-12">Loading...</div>

  return (
    <div className='px-2 sm:px-8 lg:w-[1080px]'>
      <div className='flex flex-col gap-2'>
        <div className='grid grid-cols-[2fr_2fr_4fr_2fr] items-center py-1 px-2 bg-white bold-14 sm:bold-16 mb-3 rounded'>
          <h5>Name</h5>
          <h5>Email</h5>
          <h5>Message</h5>
          <h5>Date</h5>
        </div>
        {/* Contact list */}
        {paginatedContacts.map((c) => (
          <div key={c._id} className='grid grid-cols-[2fr_2fr_4fr_2fr] items-center gap-2 p-1 bg-white rounded-xl'>
            <div className='text-sm font-semibold'>{c.name}</div>
            <div className='text-sm font-semibold'>{c.email}</div>
            <div className='text-sm'>{c.message}</div>
            <div className='text-xs text-gray-400'>{new Date(c.date).toLocaleString()}</div>
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

export default AdminContacts