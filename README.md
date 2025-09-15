# Dairy-Licious Inventory Management System

A comprehensive dairy management solution built with React and Node.js, featuring modern UI design, QR code functionality, and real-time inventory tracking.

## 🌟 Features

### Admin Dashboard
- **Modern Light Theme**: Beautiful light-colored design with smooth animations
- **Management Modules**: Access to all major business operations
- **Real-time Data**: Live system monitoring and statistics
- **Professional Branding**: Custom Dairy-Licious logo integration

### Inventory Management
- **Product Management**: Add, edit, and delete products with comprehensive details
- **Stock Tracking**: Real-time inventory levels and stock status monitoring
- **QR Code Integration**: Generate and scan QR codes for quick product addition
- **Low Stock Alerts**: Automatic notifications for reorder levels

### QR Code Functionality
- **Product QR Generation**: Create QR codes for existing products
- **QR Code Scanning**: Add products by scanning QR codes with camera
- **Mobile-Friendly**: Optimized for smartphone scanning
- **Downloadable QR Codes**: Export QR codes as PNG files

### Additional Features
- **Milk Collection Tracking**: Monitor daily milk collection data
- **Order Management**: Process and track customer orders
- **Financial Reports**: Budget management and financial analytics
- **HR Management**: Employee scheduling and management
- **Delivery Tracking**: Distribution and delivery management

## 🚀 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for modern styling
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **QR Code Libraries**: 
  - `qrcode`: QR code generation
  - `html5-qrcode`: Camera-based QR code scanning

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logger

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables
Create `.env` files in both frontend and backend directories:

**Backend `.env`:**
```
MONGODB_URI=mongodb://localhost:27017/dairy-licious
PORT=8000
NODE_ENV=development
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:8000
```

## 📱 Usage

### Admin Dashboard
1. Navigate to the admin portal
2. Access different management modules from the dashboard
3. Monitor real-time system statistics

### Product Management
1. Go to the Products section
2. Add new products or edit existing ones
3. Generate QR codes for products
4. Use "Add via QR" to scan existing product QR codes

### QR Code Workflow
1. **Generate QR**: Click the "QR" button on any product card
2. **Download**: Save QR codes as PNG files for printing
3. **Scan QR**: Use "Add via QR" button to scan product codes
4. **Auto-fill**: Scanned data automatically populates the product form

## 🎨 Design Features

- **Light Theme**: Modern, clean light-colored interface
- **Smooth Animations**: Floating elements and hover effects
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional Cards**: Glass-morphism design with subtle shadows
- **Brand Integration**: Custom Dairy-Licious logo throughout the app

## 🔒 Security Features

- Input validation and sanitization
- CORS configuration for secure API access
- Environment variable protection
- Secure file handling

## 📈 Performance

- Optimized React components with proper state management
- Efficient database queries with Mongoose
- Fast development and build times with Vite
- Responsive image handling and optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sadeepa Premarathna**
- GitHub: [@Sadeepa-Premarathna](https://github.com/Sadeepa-Premarathna)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB team for the flexible database solution
- All open-source contributors who made this project possible

---

Made with ❤️ for efficient dairy management
