# Live Shows CRUD

A simple Azure Static Web App to manage Bands, Venues, and Events.

## Development and Testing

`npm install` installs dependencies

`npm run dev` on root project directory starts the server and the web app simultaneously.

## Deployment

The application is deployed at: [https://ambitious-forest-02d47500f.3.azurestaticapps.net/](https://ambitious-forest-02d47500f.3.azurestaticapps.net/)

## Project Structure

- `api/`: Azure Functions backend
- `client/`: React frontend (Vite)

## Technologies Used

### Frontend (Client)
- **React (v19)**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool and development server.
- **React Select**: A flexible and beautiful Select Input control for React, used for searchable dropdowns.
- **Google Maps API**:
  - `@react-google-maps/api`: For rendering interactive maps.
  - `react-google-autocomplete`: For address autocomplete in venue management.

### Backend (API)
- **Azure Functions (Node.js v4)**: Serverless compute service to run the API endpoints.
- **MSSQL (`mssql`)**: Microsoft SQL Server client for Node.js, used to connect to the Azure SQL Database.
- **Azure Storage Blob (`@azure/storage-blob`)**: SDK for uploading and managing images in Azure Blob Storage.

### Infrastructure & Tools
- **Azure Static Web Apps**: Hosting service that automatically builds and deploys the full stack web app.
- **Azure SQL Database**: Relational database service for storing bands, venues, and events data.
- **Azure Blob Storage**: Object storage solution for serving static assets like band logos and event promo images.
- **Concurrently**: Utility to run multiple commands (frontend and backend) simultaneously during development.

## Application Components

The frontend is built as a Single Page Application (SPA) using React, organized into three main management modules:

- **Event Manager (`EventManager.jsx`)**:
  - The central hub for scheduling shows.
  - Features a searchable dropdown for venues (using `react-select`).
  - Allows filtering events by search terms and date (future/past).
  - Supports uploading promotional images directly to Azure Blob Storage.
  - Links Bands and Venues to create comprehensive event listings.

- **Band Manager (`BandManager.jsx`)**:
  - CRUD interface for managing musical acts.
  - Includes functionality to upload and display band logos.

- **Venue Manager (`VenueManager.jsx`)**:
  - Manages performance locations.
  - Integrates with Google Maps API for address autocomplete and visual map location picking.
  - Sorts venues alphabetically for easy navigation.

- **App Shell (`App.jsx`)**:
  - Handles user authentication via Azure Static Web Apps auth (with local development mocking).
  - Provides tab-based navigation between the different managers.

## Authors

- Marshall Benson
- Gemini 3 Pro


