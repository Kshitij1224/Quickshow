import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, Calendar1Icon, Clock1Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {

  const navigate = useNavigate()

  return (
    <div className='relative flex flex-col items-start justify-center gap-6 px-6 md:px-16 lg:px-36 min-h-screen overflow-hidden'>
      {/* Background with overlay */}
      <div className='absolute inset-0 bg-[url("/Dhurandhar.jpeg")] bg-cover bg-center bg-no-repeat'>
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70'></div>
      </div>
      
      {/* Content */}
      <div className='relative z-10 max-w-3xl'>
        <div className='inline-flex items-center gap-2 mb-4 px-3 py-1 bg-red-600/30 backdrop-blur-sm rounded-full border border-red-500/40'>
          <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
          <span className='text-red-400 text-xs font-medium'>NOW SHOWING</span>
        </div>
        
        <h1 className='text-5xl md:text-[70px] md:leading-18 font-black text-white mb-4'>
          <span className='text-red-600 block mb-2'>DHURANDHAR</span>
          <span className='text-3xl md:text-5xl font-bold block'>The Revenge</span>
        </h1>
        
        <div className='flex flex-wrap items-center gap-6 text-gray-300 mb-4'>
          <span className='flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20'>Action</span>
          <span className='flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20'>Thriller</span>
          <div className='flex items-center gap-1'>
              <Calendar1Icon className='w-4 h-4'/>
              <span>2026</span>
          </div>
          <div className='flex items-center gap-1'>
              <Clock1Icon className='w-4 h-4'/>
              <span>3h 49m</span>
          </div>
        </div>
        
        <p className='max-w-md text-gray-300 mb-6 leading-relaxed'>
          Hamza Ali Mazari, whose real identity is Jaskirat Singh Rangi, pursues his undercover operation within Pakistan's criminal world, seeking vengeance for past betrayals.
        </p>
        
        <button 
          onClick={()=>navigate('/movies')} 
          className='flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-600/50'
        >
          Book Tickets Now
          <ArrowRight className='w-5 h-5'/>
        </button>
      </div>
    </div>
  )
}

export default HeroSection
