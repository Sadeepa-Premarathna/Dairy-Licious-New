# Dairy-Licious - Milk Collection & Distribution System

A comprehensive milk collection and distribution management system built with React and Node.js.

## Features

- **Dashboard**: Overview and analytics for milk collection operations
- **Raw Milk Records**: Track and manage milk collection data
- **Driver Management**: Manage delivery drivers and their assignments
- **Order Management**: Handle customer orders and distribution
- **Tracking System**: Real-time tracking of milk deliveries
- **Expense Management**: Calculate milk collection costs and profit margins

## Tech Stack

### Frontend
- React 19.1.1 with TypeScript
- React Router DOM for navigation
- Modern responsive UI with CSS modules

### Backend
- Node.js with Express.js
- MongoDB for data storage
- RESTful API architecture

## Project Structure

```
├── frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── types/         # TypeScript interfaces
│   │   ├── services/      # API services
│   │   └── App.tsx        # Main application
│   └── package.json
└── backend/           # Node.js Express backend
    ├── models/            # Database models
    ├── routes/            # API routes
    ├── index.js          # Server entry point
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Backend Setup
```bash
cd backend
npm install
npm start
```
Server runs on http://localhost:3001

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Application runs on http://localhost:3000

## Features Overview

### Expense Management
- Calculate cost per liter
- Track expenses by category (transportation, labor, equipment, etc.)
- Profit margin analysis
- Financial reporting

### Inventory Management
- Real-time milk stock tracking
- Quality control monitoring
- Storage management

### Distribution Management
- Route optimization
- Driver assignments
- Delivery tracking
- Customer management

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License.
