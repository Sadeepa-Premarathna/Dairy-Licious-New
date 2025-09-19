import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { milkApi } from '../services/api';
import { MilkRecord } from '../types/milk';
import './MilkRecordForm.css';

const MilkRecordForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    farmerName: '',
    farmerId: '',
    quantity: '',
    qualityGrade: 'A' as MilkRecord['qualityGrade'],
    fatContent: '',
    pricePerLiter: '',
    collectionPoint: '',
    distributionStatus: 'collected' as MilkRecord['distributionStatus'],
    notes: '',
    collectedBy: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qualityGrades: MilkRecord['qualityGrade'][] = ['A', 'B', 'C'];
  const statusOptions: MilkRecord['distributionStatus'][] = ['collected', 'in_transit', 'delivered', 'pending'];

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        const record = await milkApi.getRecordById(id!);
        setFormData({
          farmerName: record.farmerName,
          farmerId: record.farmerId,
          quantity: record.quantity.toString(),
          qualityGrade: record.qualityGrade,
          fatContent: record.fatContent?.toString() || '',
          pricePerLiter: record.pricePerLiter.toString(),
          collectionPoint: record.collectionPoint,
          distributionStatus: record.distributionStatus,
          notes: record.notes || '',
          collectedBy: record.collectedBy
        });
      } catch (err) {
        setError('Failed to fetch milk record');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isEditing && id) {
      fetchRecord();
    }
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.farmerName.trim() || !formData.farmerId.trim() || !formData.quantity || 
        !formData.pricePerLiter || !formData.collectionPoint.trim() || !formData.collectedBy.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const recordData = {
        farmerName: formData.farmerName.trim(),
        farmerId: formData.farmerId.trim(),
        quantity: parseFloat(formData.quantity),
        qualityGrade: formData.qualityGrade,
        fatContent: formData.fatContent ? parseFloat(formData.fatContent) : undefined,
        pricePerLiter: parseFloat(formData.pricePerLiter),
        collectionPoint: formData.collectionPoint.trim(),
        distributionStatus: formData.distributionStatus,
        notes: formData.notes.trim(),
        collectedBy: formData.collectedBy.trim()
      };

      if (isEditing && id) {
        await milkApi.updateRecord(id, recordData);
      } else {
        await milkApi.createRecord(recordData);
      }

      navigate('/');
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} milk record`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Loading milk record...</div>;
  }

  return (
    <div className="milk-record-form">
      <div className="form-header">
        <h2>{isEditing ? 'Edit Milk Record' : 'New Milk Collection Record'}</h2>
        <p>Enter the details of the milk collection</p>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="record-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="farmerName">Farmer Name *</label>
            <input
              type="text"
              id="farmerName"
              name="farmerName"
              value={formData.farmerName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="farmerId">Farmer ID *</label>
            <input
              type="text"
              id="farmerId"
              name="farmerId"
              value={formData.farmerId}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantity">Quantity (Liters) *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="0"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pricePerLiter">Price per Liter (Rs.) *</label>
            <input
              type="number"
              id="pricePerLiter"
              name="pricePerLiter"
              value={formData.pricePerLiter}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="qualityGrade">Quality Grade</label>
            <select
              id="qualityGrade"
              name="qualityGrade"
              value={formData.qualityGrade}
              onChange={handleInputChange}
            >
              {qualityGrades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fatContent">Fat Content (%)</label>
            <input
              type="number"
              id="fatContent"
              name="fatContent"
              value={formData.fatContent}
              onChange={handleInputChange}
              min="0"
              max="10"
              step="0.1"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="collectionPoint">Collection Point *</label>
            <input
              type="text"
              id="collectionPoint"
              name="collectionPoint"
              value={formData.collectionPoint}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="collectedBy">Collected By *</label>
            <input
              type="text"
              id="collectedBy"
              name="collectedBy"
              value={formData.collectedBy}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="distributionStatus">Distribution Status</label>
          <select
            id="distributionStatus"
            name="distributionStatus"
            value={formData.distributionStatus}
            onChange={handleInputChange}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            placeholder="Additional notes or comments..."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Record' : 'Save Record')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MilkRecordForm;
