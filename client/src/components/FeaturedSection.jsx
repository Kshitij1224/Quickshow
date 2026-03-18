import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, FilmIcon, SparklesIcon } from 'lucide-react'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'

const FeaturedSection = () => {

  const navigate = useNavigate()
  const {shows} = useAppContext()

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden relative bg-gradient-to-b from-transparent to-gray-900/20'>
      
      {/* Background decoration */}
      <BlurCircle top='0' right='-80px'/>
      <BlurCircle top='50%' left='-100px'/>
      
      {/* Header */}
      <div className='relative flex flex-col md:flex-row md:items-center justify-between mb-12'>
        <div className='mb-6 md:mb-0'>
          <div className='flex items-center gap-3 mb-3'>
            <FilmIcon className='w-6 h-6 text-primary animate-pulse' />
            <div className='h-px w-16 bg-gradient-to-r from-primary to-transparent'></div>
          </div>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-2'>
            Now <span className='text-primary'>Showing</span>
          </h2>
          <p className='text-gray-400 max-w-md'>
            Experience the latest blockbusters and timeless classics on the big screen
          </p>
        </div>
        
        <button 
          onClick={()=>navigate('/movies')} 
          className='group flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105'
        >
          <span>View All Movies</span>
          <ArrowRight className='group-hover:translate-x-1 transition-transform duration-300 w-4 h-4'/>
        </button>
      </div>
      
      {/* Movies Grid */}
      <div className='relative'>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30'></div>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10'>
          {shows.slice(0,4).map((show, index)=>(
            <div 
              key={show._id} 
              className='transform transition-all duration-500 hover:scale-105 hover:-translate-y-2'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MovieCard movie={show}/>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className='relative mt-20 text-center'>
        <div className='inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/20 to-purple-600/20 backdrop-blur-sm rounded-full border border-primary/30'>
          <SparklesIcon className='w-5 h-5 text-primary' />
          <span className='text-white font-medium'>Discover more amazing movies</span>
        </div>
        
        <div className='mt-8'>
          <button 
            onClick={()=>{navigate('/movies'); scrollTo(0,0)}}
            className='inline-flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/50'
          >
            <FilmIcon className='w-5 h-5' />
            Explore All Movies
            <ArrowRight className='w-5 h-5'/>
          </button>
        </div>
        
        <p className='text-gray-500 text-sm mt-4 max-w-2xl mx-auto'>
          From action-packed adventures to heartwarming dramas - find your perfect movie experience
        </p>
      </div>
    </div>
  )
}

export default FeaturedSection
