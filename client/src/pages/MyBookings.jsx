import React, { useEffect, useState } from 'react'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import { timeFormat } from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const {axios,getToken,user,image_base_url}=useAppContext();
  const [searchParams, setSearchParams] = useSearchParams()
  // console.log(axios,getToken,user,image_base_url);  

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [confirmingPayment, setConfirmingPayment] = useState(false)

  const getMyBookings = async () => {
    try {
      const {data} = await axios.get('/api/user/bookings',{headers: {Authorization: `Bearer ${await getToken()}`}});
      console.log("Bookings data:", data)
      if(data.success){
        setBookings(data.bookings || [])
      } else {
        toast.error(data.message || 'Failed to load bookings')
      }
    } catch (error) {
      console.log('Bookings error:', error);
      toast.error('Failed to load bookings')
    }
    setIsLoading(false)
  }

  const confirmPaymentFromSession = async () => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId || !user) return

    try {
      setConfirmingPayment(true)
      const { data } = await axios.post(
        '/api/booking/confirm-payment',
        { sessionId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (data.success) {
        toast.success('Booking confirmed and email sent.')
      } else {
        toast.error(data.message || 'Failed to confirm booking payment')
      }
    } catch (error) {
      console.log('Confirm payment error:', error)
      toast.error(error.response?.data?.message || 'Failed to confirm booking payment')
    }

    setSearchParams({}, { replace: true })
    setConfirmingPayment(false)
  }

  useEffect(() => {
    if(user){
      getMyBookings()
    } else {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      confirmPaymentFromSession()
    }
  }, [user])

  if (isLoading) {
    return <Loading size="large" text="Loading your bookings..." />
  }

  if (!user) {
    return (
      <div className='relative px-6 md:px-16 lg:px-40 pt-[120px] min-h-[80vh]'>
        <BlurCircle top="100px" left="100px" />   
        <BlurCircle bottom='0' left="600px"/>
        <div className='text-center py-20'>
          <p className='text-gray-400 text-lg mb-4'>Please login to view your bookings</p>
          <Link to="/login" className='bg-primary px-6 py-2 rounded-full text-white hover:bg-primary/90 transition'>
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className='relative px-6 md:px-16 lg:px-40 pt-[120px] min-h-[80vh]'>
        <BlurCircle top="100px" left="100px" />   
        <BlurCircle bottom='0' left="600px"/>
        <div className='text-center py-20'>
          <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>
          <p className='text-gray-400 text-lg mb-4'>You haven't made any bookings yet</p>
          <Link to="/" className='bg-primary px-6 py-2 rounded-full text-white hover:bg-primary/90 transition'>
            Browse Movies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='relative px-6 md:px-16 lg:px-40 pt-[120px] min-h-[80vh]'>
      <BlurCircle top="100px" left="100px" />   
      <BlurCircle bottom='0' left="600px"/>
      
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>
      {confirmingPayment && (
        <p className='text-sm text-primary mb-4'>Confirming your payment and sending email...</p>
      )}
      
      {bookings.map((item, index) => (
        <div key={item._id || index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 w-full max-w-3xl'>
          <div className='flex flex-col md:flex-row'>
            <img 
              src={item.show?.movie?.poster_path ? image_base_url + item.show.movie.poster_path : '/placeholder-movie.jpg'} 
              alt={item.show?.movie?.title || 'Movie'} 
              className='md:max-w-[180px] aspect-video h-auto object-cover object-bottom rounded'
              onError={(e) => {
                e.target.src = '/placeholder-movie.jpg'
              }}
            />
            <div className='flex flex-col p-4'>
              <p className='text-lg font-semibold'>{item.show?.movie?.title || 'Movie Title'}</p>
              <p className='text-gray-400 text-sm'>{timeFormat(item.show?.movie?.runtime || 0)}</p>
              <p className='text-gray-400 text-sm mt-auto'>{dateFormat(item.show?.showDateTime || item.date)}</p>
            </div>
          </div>

          <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
            <div className='flex items-center gap-4'>
              <p className='text-2xl font-semibold mb-3'>{currency}{item.amount || 0}</p>
              {!item.isPaid && item.paymentLink && (
                <Link to={item.paymentLink} className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer hover:bg-primary/90 transition'>
                  Pay Now
                </Link>
              )}
            </div>
            <div className='text-sm'>
              <p><span className='text-gray-400'>Total Tickets:</span> {item.bookedSeats?.length || 0}</p>
              <p><span className='text-gray-400'>Seat Number:</span> {item.bookedSeats?.join(", ") || 'N/A'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyBookings
