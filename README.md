# Himpunan Mahasiswa TKBG (Teknologi Konstruksi Bangunan Gedung) Semarang - Frontend

This is the official frontend repository for the Himpunan Mahasiswa TKBG Semarang website. Built with React and Vite, the platform provides information about the organization, its members, news (berita), work programs (program kerja), gallery, and a functional contact form.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation setup](#installation-setup)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Building for Production](#building-for-production)

## Tech Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **Styling:** Custom CSS with modern design system
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Animations:** GSAP & ScrollTrigger

## Features
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile viewing.
- **Dynamic Content:** Fetches real-time data from the backend API for Members, News, Gallery, and Programs.
- **Dark/Light Mode:** Integrated theme toggling functionality.
- **Smooth Animations:** Premium scrolling and micro-animations via GSAP.
- **Contact System:** Integrated connection to backend to store incoming messages.
- **CMS Integration:** Fully compatible with the Express/Filament Backend API.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- Node.js (v18 or higher recommended)
- npm or yarn

## Installation setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Ballon14/frontend-himpunan.git
   cd frontend-himpunan
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables
Create a `.env` file in the root of your project based on the `.env.example` file (if available) or create a new one:

```env
# URL for your backend API
VITE_API_URL=https://api.iqbaldev.site/api
```
*(For local development with the backend running locally, use `http://localhost:8000/api`)*

## Development Workflow
To start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Building for Production
To build the application for production deployment:
1. Ensure your `.env` contains the production API URL.
2. Run the build command:
   ```bash
   npm run build
   ```
3. The compiled assets will be available in the `dist/` directory. Deploy the contents of this folder to your web server (Nginx, Apache, or platforms like Vercel/Netlify).
