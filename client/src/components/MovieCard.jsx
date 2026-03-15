import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()

  const goToDetails = () => {
    navigate(`/movies/${movie._id}`)
    scrollTo(0, 0)
  }

  const formatRuntime = (min) => {
    if (!min) return ''
    const h = Math.floor(min / 60)
    const m = min % 60
    return `${h}h ${m}m`
  }

  return (
    <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-64'>
      
      {/* Movie Image */}
      <img
        onClick={goToDetails}
        src={movie.backdrop_path}
        alt={movie.title}
        className='rounded-lg h-52 w-full object-cover cursor-pointer'
      />

      {/* Title */}
      <p className='font-semibold mt-2 truncate'>
        {movie.title}
      </p>

      {/* Metadata */}
      <p className='text-sm text-gray-400 mt-2'>
        {new Date(movie.release_date).getFullYear()} ·
        {movie.genres?.slice(0, 2).map(g => g.name).join(' | ')}
        {movie.runtime && ` · ${formatRuntime(movie.runtime)}`}
      </p>

      {/* Footer */}
      <div className='flex items-center justify-between mt-4 pb-3'>
        <button
          onClick={goToDetails}
          className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium'
        >
          Buy Tickets
        </button>

        <p className='flex items-center gap-1 text-sm text-gray-400'>
          <StarIcon className='w-4 h-4 text-primary fill-primary'/>
          {movie.vote_average?.toFixed(1) ?? 'N/A'}
        </p>
      </div>
    </div>
  )
}

export default MovieCard
