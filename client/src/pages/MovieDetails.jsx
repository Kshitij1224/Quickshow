import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard' // Fixed import

const MovieDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [show, setShow] = useState(null)

  // Format runtime in hours and minutes
  const timeFormat = (minutes) => {
    if (!minutes) return 'N/A'
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hrs}h ${mins}m`
  }

  // Fetch the movie by ID
  const getShow = () => {
    const movie = dummyShowsData.find(show => show._id.toString() === id) // ensure string comparison
    if (!movie) return
    setShow({
      movie,
      dateTime: dummyDateTimeData
    })
  }

  useEffect(() => {
    getShow()
  }, [id])

  if (!show) {
    return <div className="text-center pt-40">Loading...</div>
  }

  return (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
        {/* Poster */}
        <img
          src={show.movie.poster_path}
          alt={show.movie.title}
          className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'
        />

        <div className='relative flex flex-col gap-3'>
          <BlurCircle top="-100px" left="-100px" />

          <p className='text-primary'>ENGLISH</p>

          <h1 className='text-4xl font-semibold max-w-96 text-balance'>
            {show.movie.title}
          </h1>

          <div className='flex items-center gap-2 text-gray-300'>
            <StarIcon className='w-5 h-5 text-primary fill-primary' />
            {show.movie.vote_average?.toFixed(1)} User Rating
          </div>

          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>
            {show.movie.overview}
          </p>

          <p className='text-gray-300 text-sm'>
            {timeFormat(show.movie.runtime)} ·{' '}
            {show.movie.genres.map(genre => genre.name).join(', ')} ·{' '}
            {show.movie.release_date?.split('-')[0]}
          </p>

          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <button className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95'>
              <PlayCircleIcon className='w-5 h-5' />
              Watch Trailer
            </button>
            <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'>
              Buy Tickets
            </a>
            <button className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95'>
              <Heart className={'w-5 h-5'} />
            </button>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <p className='text-lg font-medium mt-20'>Your Favorite Cast</p>
      <div className='overflow-x-auto no-scroller mt-8 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
          {show.movie.casts.slice(0, 12).map((cast, index) => (
            <div
              key={index}
              className='flex flex-col items-center text-center min-w-[80px]'
            >
              <img
                src={cast.profile_path}
                alt={cast.name}
                className='rounded-full h-20 w-20 object-cover'
              />
              <p className='text-sm mt-2 text-gray-300'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DateSelect Component */}
      <DateSelect dateTime={show.dateTime} id={id} />

      {/* Recommendations */}
      <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {dummyShowsData.slice(0, 4).map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>

      {/* Show More Button */}
      <div className='flex justify-center mt-20'>
        <button
          onClick={() => {navigate('/movies');scrollTo(0,0)}}
          className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'
        >
          Show More
        </button>
      </div>
    </div>
  )
}

export default MovieDetails
