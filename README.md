# Korean Learning Application

A full-stack web application for learning Korean vocabulary and sentence structures through interactive exercises.

## Features

- **Flashcards**: Practice Korean vocabulary with digital flashcards
- **Sentence Game**: Arrange scrambled Korean sentences in the correct order
- **Search**: Find specific Korean words or sentences using the search function
- **API Backend**: RESTful API serving Korean vocabulary and sentence data

## Tech Stack

### Frontend (Client)
- React with TypeScript
- CSS for styling
- Vite for build and development

### Backend (Server)
- Node.js with Express
- TypeScript
- CSV data parsing
- RESTful API architecture

## Project Structure

```
korean-learning/
├── client/                 # Frontend React application
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── App.tsx         # Main application component
│   │   └── ...
│   ├── public/             # Static assets
│   └── ...
├── server/                 # Backend Express application
│   ├── src/                # Source code
│   │   ├── controllers/    # API controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── data/           # Data files (CSV)
│   │   └── ...
│   └── ...
└── ...
```

## Getting Started

### Prerequisites
- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/bitcham/Korean.git
cd korean-learning
```

2. Install dependencies for both client and server
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running the Application

1. Start the server (API)
```bash
cd server
npm run dev
```
The server will start at http://localhost:3000

2. Start the client (Frontend)
```bash
cd client
npm run dev
```
The client will start at http://localhost:5173

## API Endpoints

- `GET /api/korean/flashcards`: Get all flashcards
- `GET /api/korean/sentence-game`: Get sentence game data
- `GET /api/korean/search?q=keyword`: Search words and sentences

## License

MIT