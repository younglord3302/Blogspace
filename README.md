# BlogSpace

A modern, full-stack blog platform built with the MERN stack (MongoDB, Express, React, Node.js). Features a premium glassmorphic UI, interactive particle background, and a robust tag/search system.

## Features

- **Premium UI/UX**: Glassmorphism design, animated gradients, and an interactive solar-system style background.
- **Authentication**: Secure JWT-based authentication (Login/Register).
- **Rich Content**: Create, read, and manage blog posts with rich text support.
- **Tag System**: Filter posts by tags via a dedicated sidebar.
- **Comments**: Interactive comment sections for each post.
- **Responsive**: Fully responsive design for mobile, tablet, and desktop.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion (animations), Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB.

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/blogspace.git
    cd blogspace
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create a .env file based on .env.example
    cp .env.example .env
    # Start the server
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    # Create a .env file based on .env.example
    cp .env.example .env
    # Start the client
    npm start
    ```

4.  **Visit the App**
    Open [http://localhost:3000](http://localhost:3000) to view the application.

## Directory Structure

- `/backend`: API server and database logic.
- `/frontend`: React application and static assets.

## Deployment

### Vercel (Recommended)

The easiest way to deploy is to use the Vercel button below. It will automatically clone this repository to your GitHub and set up the deployment for both the frontend and backend.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fblogspace&env=MONGODB_URI,JWT_SECRET,REACT_APP_API_URL)

**Manual Vercel Setup:**
1.  Install Vercel CLI: `npm i -g vercel`
2.  Run `vercel` in the root directory.
3.  Set the environment variables in the Vercel dashboard:
    -   `MONGODB_URI`
    -   `JWT_SECRET`
    -   `REACT_APP_API_URL` (Set this to your Vercel URL + `/api`, e.g., `https://your-project.vercel.app/api` - *Note: The frontend will auto-detect the relative path `/api` due to the proxy setup in `vercel.json`*)

## License

MIT
