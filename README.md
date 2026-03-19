# Quickshow - Movie Ticket Booking System

A modern, full-stack movie ticket booking application built with React, Node.js, and MongoDB. Features seamless user authentication, real-time seat selection, secure payments, and automated email confirmations.

## 🎬 Features

### Frontend (React)
- **User Authentication**: Clerk integration for secure sign-up/sign-in
- **Movie Browsing**: Browse movies with posters, ratings, and details
- **Seat Selection**: Interactive seat layout with real-time availability
- **Booking Management**: View and manage your bookings
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Search & Filter**: Find movies by title, genre, or release date

### Backend (Node.js & Express)
- **User Management**: Clerk webhook synchronization
- **Movie & Show Management**: CRUD operations for movies and showtimes
- **Seat Availability**: Real-time seat tracking and booking
- **Payment Processing**: Stripe integration for secure payments
- **Email System**: Automated booking confirmations and reminders
- **Admin Dashboard**: Analytics and booking management

### Key Features
- 🎥 **Movie Catalog**: TMDB integration for movie data
- 🎭 **Show Management**: Multiple showtimes per movie
- 💺 **Smart Seating**: Visual seat selection with availability
- 💳 **Secure Payments**: Stripe payment processing
- 📧 **Email Notifications**: Booking confirmations and reminders
- 🔐 **Authentication**: Clerk-based user management
- 📱 **Responsive UI**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **React Hot Toast**: Toast notifications
- **Axios**: HTTP client for API calls
- **Clerk**: Authentication and user management

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **Stripe**: Payment processing
- **Nodemailer**: Email sending
- **Inngest**: Background job processing
- **Clerk Express**: Server-side authentication
- **JWT**: Token-based authentication

### Database Models
- **User**: User profiles and authentication
- **Movie**: Movie details from TMDB
- **Show**: Showtimes and seat management
- **Booking**: User bookings and payment status

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stripe account
- Clerk account
- TMDB API key

## 📁 Project Structure

```
Quickshow/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── lib/           # Utility functions
│   │   └── assets/        # Static assets
│   ├── public/            # Public files
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── config/           # Configuration files
│   ├── inngest/          # Background jobs
│   └── package.json
├── .env                  # Environment variables
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/sign-in` - User sign-in
- `POST /api/auth/sign-up` - User sign-up

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Create movie (Admin)

### Shows
- `GET /api/shows` - Get all shows
- `GET /api/shows/:id` - Get show details
- `POST /api/shows` - Create show (Admin)
- `GET /api/shows/:id/seats` - Get occupied seats

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/user/bookings` - Get user bookings
- `GET /api/bookings/admin` - Get all bookings (Admin)

### Users
- `GET /api/user/bookings` - Get user bookings
- `POST /api/user/update-favorite` - Update favorite movies
- `GET /api/user/favorites` - Get favorite movies

## 🎯 Core Functionality

### Booking Flow
1. **Browse Movies**: User browses available movies
2. **Select Show**: User chooses a showtime
3. **Choose Seats**: Interactive seat selection
4. **Payment**: Secure Stripe payment processing
5. **Confirmation**: Email confirmation sent
6. **Booking Management**: View and manage bookings

### Email System
- **Booking Confirmation**: Sent after successful payment
- **Show Reminders**: Automated reminders 8 hours before showtime
- **New Show Notifications**: Notify users of new movie shows

### Admin Features
- **Dashboard**: Analytics and statistics
- **Movie Management**: Add/edit movies
- **Show Management**: Create and manage showtimes
- **Booking Overview**: View all bookings and revenue

## 🔐 Authentication & Security

- **Clerk Integration**: Secure user authentication
- **JWT Tokens**: Secure API authentication
- **Stripe Security**: PCI-compliant payment processing
- **Webhook Verification**: Secure webhook processing
- **Input Validation**: Sanitized user inputs
- **Error Handling**: Comprehensive error management

## 📧 Email System

The application uses Inngest for background job processing:

- **Booking Confirmation**: Triggered after successful payment
- **Show Reminders**: Scheduled 8 hours before showtime
- **New Show Notifications**: Sent when new shows are added

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Interactive Seat Map**: Visual seat selection
- **Real-time Updates**: Live seat availability
- **Smooth Animations**: Modern UI transitions
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Graceful error messages

## 🎉 Acknowledgments

- **TMDB**: For movie data and posters
- **Clerk**: For authentication services
- **Stripe**: For payment processing
- **Tailwind CSS**: For styling framework
- **Inngest**: For background job processing

**Quickshow** - Your gateway to seamless movie ticket booking! 🎬✨
