export interface Driver {
  _id?: string;
  driverName: string;
  driverId: string;
  phoneNumber: string;
  email?: string;
  licenseNumber: string;
  vehicleNumber: string;
  vehicleType: 'truck' | 'van' | 'motorcycle';
  status: 'active' | 'inactive' | 'on_route';
  currentLocation?: string;
  assignedRoute?: string;
  totalDeliveries: number;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DriverResponse {
  drivers: Driver[];
  totalPages: number;
  currentPage: number;
  total: number;
}
