import axios from "axios";
import Movie from "../models/Movie.js"
import Show from "../models/Show.js"
import { inngest } from "../inngest/index.js";

export const getNowPlayingMovies = async (req, res) => {
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
        })
        const movies = data.results;
        res.json({ success: true, movies: movies })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Failed to fetch movies" })
    }
}


export const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice } = req.body

        // Validation
        if (!movieId || !showsInput || !showPrice) {
            return res.json({ success: false, message: 'Missing required fields: movieId, showsInput, showPrice' })
        }
        if (!Array.isArray(showsInput) || showsInput.length === 0) {
            return res.json({ success: false, message: 'showsInput must be a non-empty array' })
        }

        let movie = await Movie.findById(movieId)

        if (!movie) {
            try {
                const options = {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                    },
                    timeout: 15000
                };

                const movieDetailsResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movieId}`,
                    options
                );

                const movieApiData = movieDetailsResponse.data;

                const movieCreditsResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movieId}/credits`,
                    options
                );

                const movieCreditsData = movieCreditsResponse.data;

                const movieDetails = {
                    _id: movieId,
                    title: movieApiData.title,
                    overview: movieApiData.overview,
                    poster_path: movieApiData.poster_path,
                    backdrop_path: movieApiData.backdrop_path,
                    genres: movieApiData.genres,
                    casts: movieCreditsData.cast,
                    release_date: movieApiData.release_date,
                    original_language: movieApiData.original_language,
                    tagline: movieApiData.tagline || "",
                    vote_average: movieApiData.vote_average,
                    runtime: movieApiData.runtime,
                }

                movie = await Movie.create(movieDetails);

            } catch (tmdbError) {
                
                return res.json({success: false, message: 'Failed to fetch movie from TMDB'});
            }
        }

        const showsToCreate = [];

        showsInput.forEach(show => {
            const showDate = show.date;

            show.time.forEach((time) => {
                const dateTimeString = `${showDate}T${time}`;

                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        });

        if (showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate);
        }

        await inngest.send({
            name: "app/show.added",
            data: {movieTitle: movie.title}
        })

        res.json({ success: true, message: 'Show Added successfully.' })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

export const getShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 });
        const uniqueShows = new Set(shows.map(show => show.movie))
        res.json({ success: true, shows: Array.from(uniqueShows) })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params;
        const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } })
        const movie = await Movie.findById(movieId);
        const dateTime = {};
        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if (!dateTime[date]) {
                dateTime[date] = []
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id })
        })
        res.json({ success: true, movie, dateTime })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}