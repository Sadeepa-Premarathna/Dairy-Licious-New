export interface TrackingRecord {
  _id?: string;
  trackingId: string;
  orderId: string;
  driverId?: string;
  currentStatus: 'pickup' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed';
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  estimatedArrival?: string;
  statusHistory: TrackingStatus[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrackingStatus {
  status: string;
  location: string;
  timestamp: string;
  notes?: string;
}

export interface TrackingResponse {
  trackings: TrackingRecord[];
  totalPages: number;
  currentPage: number;
  total: number;
}
