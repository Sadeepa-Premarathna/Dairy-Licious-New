export interface MilkRecord {
  _id?: string;
  farmerName: string;
  farmerId: string;
  quantity: number;
  qualityGrade: 'A' | 'B' | 'C';
  fatContent?: number;
  pricePerLiter: number;
  totalAmount: number;
  collectionPoint: string;
  distributionStatus: 'collected' | 'in_transit' | 'delivered' | 'pending';
  notes?: string;
  collectedBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MilkResponse {
  records: MilkRecord[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface SummaryStats {
  totalRecords: number;
  totalQuantity: number;
  totalAmount: number;
  statusBreakdown: { _id: string; count: number }[];
}
