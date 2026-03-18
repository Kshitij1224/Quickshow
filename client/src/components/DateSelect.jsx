import React, { useState } from 'react'
import BlurCircle from './BlurCircle'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const DateSelect = ({ dateTime, id }) => {

    console.log("DateSelect props:", { dateTime, id });
    const navigate = useNavigate();

    const [selected, setSelected] = useState(null)

    const onBookHandler = () => {
        if (!selected) {
            return toast('Please select a date')
        }
        navigate(`/movies/${id}/${selected}`)
        scrollTo(0, 0)
    }

    return (
        <div id='dateSelect' className='pt-30'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg'>
                {/* Decorative Blur Circles */}
                <BlurCircle top="-100px" left="-100px" />
                <BlurCircle top="100px" right="0px" />

                {/* Date Selection */}
                <div>
                    <p className='text-lg font-semibold'>Choose Date</p>
                    <div className='flex items-center gap-6 text-sm mt-5'>
                        <ChevronLeftIcon width={28} className='cursor-pointer' />

                        {/* Date buttons */}
                        <div className='flex flex-wrap gap-4 md:max-w-lg'>
                            {dateTime && Object.keys(dateTime).sort((a, b) => new Date(a) - new Date(b)).map((date) => (
                                <button
                                    key={date}
                                    onClick={() => setSelected(date)}
                                    className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded-lg cursor-pointer transition-all transform
                                        ${selected === date
                                            ? "bg-primary text-white shadow-lg scale-105" // highlighted when selected
                                            : "bg-transparent border border-primary/70 hover:bg-primary/10 hover:-translate-y-1" // normal
                                        }`}
                                >
                                    <span className='font-semibold'>{new Date(date).getDate()}</span>
                                    <span className='text-xs'>
                                        {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <ChevronRightIcon width={28} className='cursor-pointer' />
                    </div>
                </div>

                {/* Book Now Button */}
                <button onClick={onBookHandler} className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer'>
                    Book Now
                </button>
            </div>
        </div>
    )
}

export default DateSelect
