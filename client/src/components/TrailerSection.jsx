import React from 'react'
import { dummyTrailers } from '../assets/assets'
import BlurCircle from './BlurCircle'
import { PlayCircleIcon, ExternalLinkIcon, YoutubeIcon } from 'lucide-react'

const TrailerSection = () => {

  const handleTrailerClick = (videoUrl) => {
    window.open(videoUrl, '_blank')
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden bg-gradient-to-b from-transparent to-gray-900/20'>
      
      <div className='text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
          Latest <span className='text-primary'>Trailers</span>
        </h2>
        <p className='text-gray-400 max-w-2xl mx-auto'>
          Watch the latest movie trailers and get excited for upcoming releases
        </p>
      </div>

      <div className='relative mt-6 mb-12'>
        <BlurCircle top='-100px' right='-100px'/>
        <BlurCircle top='50%' left='-100px'/>

        <div className='bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl overflow-hidden mx-auto flex items-center justify-center backdrop-blur-sm border border-primary/30' style={{ maxWidth: '960px', height: '540px' }}>
          <div className='text-center p-8'>
            <div className='relative inline-block mb-6'>
              <div className='absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse'></div>
              <YoutubeIcon className='w-20 h-20 mx-auto text-primary relative z-10' />
            </div>
            <h3 className='text-2xl font-semibold text-white mb-3'>Watch Movie Trailers</h3>
            <p className='text-gray-300 text-lg mb-6'>Click on any trailer below to watch on YouTube</p>
            <div className='flex items-center justify-center gap-2 text-gray-400'>
              <ExternalLinkIcon className='w-4 h-4' />
              <span className='text-sm'>Opens in new tab</span>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
        {dummyTrailers.map((trailer, index)=>(
            <div 
              key={trailer.videoUrl} 
              className='relative group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2'
              onClick={() => handleTrailerClick(trailer.videoUrl)}
            >
                {/* Card Container */}
                <div className='relative rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50'>
                    {/* Image */}
                    <div className='aspect-video relative overflow-hidden'>
                        <img 
                          src={trailer.image} 
                          alt="trailer" 
                          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
                        />
                        
                        {/* Overlay */}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                            <div className='absolute inset-0 bg-primary/20 mix-blend-overlay'></div>
                        </div>
                        
                        {/* Play Button */}
                        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100'>
                            <div className='bg-primary/90 backdrop-blur-sm rounded-full p-4 shadow-2xl shadow-primary/50 transform transition-transform duration-300 group-hover:scale-110'>
                                <PlayCircleIcon className='w-8 h-8 text-white' fill='white' />
                            </div>
                        </div>
                        
                        {/* Watch Badge */}
                        <div className='absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0'>
                            <div className='flex items-center gap-1 text-white text-xs font-medium'>
                                <YoutubeIcon className='w-3 h-3' />
                                <span>Watch</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Card Footer */}
                    <div className='p-3 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50'>
                        <div className='flex items-center justify-between'>
                            <span className='text-gray-400 text-xs'>Trailer {index + 1}</span>
                            <div className='flex items-center gap-1 text-primary/60'>
                                <ExternalLinkIcon className='w-3 h-3' />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Glow Effect */}
                <div className='absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10'></div>
            </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className='text-center mt-16'>
        <p className='text-gray-500 text-sm'>
          Click any trailer to watch the full video on YouTube
        </p>
      </div>
    </div>
  )
}

export default TrailerSection
