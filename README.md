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
- **DnD Kit (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`)**: Modern drag-and-drop toolkit for React, used in the Rack Builder for equipment positioning.
- **React Image Crop (`react-image-crop`)**: Image cropping component for fitting equipment images to proper aspect ratios.

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

- **Rack Builder (`RackBuilder.jsx`)**:
  - Visual rack equipment planning tool for managing audio equipment.
  - Supports creating multiple racks with customizable RU capacity, dimensions, cost, weight, and power capacity.
  - Features drag-and-drop equipment positioning using `@dnd-kit/core` with automatic conflict resolution.
  - Includes front/back mounting support for comprehensive rack planning.
  - Provides image cropping functionality (`react-image-crop`) to fit equipment photos to proper aspect ratios.
  - Displays real-time totals for cost, weight, power consumption, and depth clearance.
  - Tracks power conditioner capacity and demand across all equipment in each rack.

- **App Shell (`App.jsx`)**:
  - Handles user authentication via Azure Static Web Apps auth (with local development mocking).
  - Provides tab-based navigation between the different managers.

## Authors

- Marshall Benson
- Gemini 3 Pro


