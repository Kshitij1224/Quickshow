import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'
import { FilmIcon, SearchIcon, FilterIcon, GridIcon, ListIcon } from 'lucide-react'

const Movies = () => {
  const {shows} = useAppContext()
  const [viewMode, setViewMode] = React.useState('grid')
  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredShows = shows.filter(movie => 
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return shows.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] bg-gradient-to-b from-transparent to-gray-900/20'>
      
      {/* Background decoration */}
      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>
      
      {/* Header */}
      <div className='relative mb-12'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8'>
          <div>
            <div className='flex items-center gap-3 mb-4'>
              <FilmIcon className='w-8 h-8 text-primary animate-pulse' />
              <div className='h-px w-20 bg-gradient-to-r from-primary to-transparent'></div>
            </div>
            <h1 className='text-4xl md:text-5xl font-bold text-white mb-3'>
              All <span className='text-primary'>Movies</span>
            </h1>
            <p className='text-gray-400 max-w-2xl'>
              Discover our complete collection of movies - from blockbuster hits to hidden gems
            </p>
          </div>
          
          <div className='flex items-center gap-4'>
            <div className='text-gray-400 text-sm'>
              {filteredShows.length} movies available
            </div>
            <div className='flex bg-white/10 backdrop-blur-sm rounded-lg border border-white/20'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <GridIcon className='w-4 h-4' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <ListIcon className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className='relative max-w-2xl'>
          <div className='relative'>
            <SearchIcon className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='Search movies by title...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:bg-white/15 transition-all'
            />
          </div>
        </div>
      </div>
      
      {/* Movies Grid */}
      <div className='relative'>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30'></div>
        
        {filteredShows.length > 0 ? (
          <div className={`grid gap-8 relative z-10 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredShows.map((movie, index) => (
              <div 
                key={movie._id} 
                className='transform transition-all duration-500 hover:scale-105 hover:-translate-y-2'
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-20 relative z-10'>
            <div className='inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4'>
              <SearchIcon className='w-5 h-5 text-primary' />
              <span className='text-white font-medium'>No movies found</span>
            </div>
            <p className='text-gray-400 max-w-md mx-auto'>
              We couldn't find any movies matching "{searchTerm}". Try searching with different keywords.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className='mt-6 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-full transition-colors'
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
      
      {/* Load More Section */}
      {filteredShows.length > 8 && (
        <div className='text-center mt-20 relative z-10'>
          <div className='inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/20 to-purple-600/20 backdrop-blur-sm rounded-full border border-primary/30 mb-6'>
            <FilmIcon className='w-5 h-5 text-primary' />
            <span className='text-white font-medium'>More movies available</span>
          </div>
          <button className='px-12 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/50'>
            Load More Movies
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-b from-transparent to-gray-900/50'>
      <div className='text-center max-w-md'>
        <div className='inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6'>
          <FilmIcon className='w-8 h-8 text-primary' />
          <span className='text-white font-medium'>No Movies Available</span>
        </div>
        <h1 className='text-3xl md:text-4xl font-bold text-white mb-4'>
          Coming Soon
        </h1>
        <p className='text-gray-400 mb-8'>
          We're preparing our movie collection. Check back soon for the latest releases!
        </p>
        <div className='flex items-center gap-2 justify-center text-gray-500'>
          <div className='w-2 h-2 bg-yellow-400 rounded-full animate-pulse'></div>
          <span className='text-sm'>New movies added weekly</span>
        </div>
      </div>
    </div>
  )
}

export default Movies
