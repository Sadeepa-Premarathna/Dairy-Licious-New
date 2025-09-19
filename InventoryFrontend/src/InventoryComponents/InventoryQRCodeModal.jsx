import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeModal = ({ isOpen, onClose, onProductSelect, mode = 'generate', productData = null }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [scannedResult, setScannedResult] = useState('');
  const [scannedProductData, setScannedProductData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (isOpen && mode === 'generate' && productData) {
      generateQRCode();
    }
    
    if (isOpen && mode === 'scan') {
      startScanning();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [isOpen, mode, productData]);

  const generateQRCode = async () => {
    try {
      const qrData = JSON.stringify({
        id: productData._id,
        name: productData.name,
        sku: productData.sku,
        category: productData.category,
        price: productData.price
      });
      
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        try {
          const productData = JSON.parse(decodedText);
          setScannedResult(decodedText);
          setScannedProductData(productData);
          scanner.clear();
          setIsScanning(false);
        } catch (error) {
          // If it's not JSON, treat as simple text
          setScannedResult(decodedText);
          setScannedProductData(null);
          scanner.clear();
          setIsScanning(false);
        }
      },
      (error) => {
        console.warn('QR code scan error:', error);
      }
    );

    scannerRef.current = scanner;
  };

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      setIsScanning(false);
    }
    setScannedResult('');
    setScannedProductData(null);
    setQrDataUrl('');
    onClose();
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${productData.name}-qr-code.png`;
    link.click();
  };

  const handleAddScannedProduct = () => {
    if (scannedProductData) {
      onProductSelect(scannedProductData);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {mode === 'generate' ? 'Product QR Code' : 'Scan QR Code'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {mode === 'generate' && (
          <div className="text-center">
            {productData && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-800">{productData.name}</h4>
                <p className="text-sm text-gray-600">SKU: {productData.sku}</p>
                <p className="text-sm text-gray-600">Category: {productData.category}</p>
                <p className="text-sm text-gray-600">Price: Rs. {productData.price}</p>
              </div>
            )}
            
            {qrDataUrl && (
              <div className="mb-4">
                <img 
                  src={qrDataUrl} 
                  alt="Product QR Code" 
                  className="mx-auto border rounded-lg shadow-sm"
                />
              </div>
            )}
            
            <div className="flex gap-2 justify-center">
              <button
                onClick={downloadQRCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download QR
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {mode === 'scan' && (
          <div>
            {!scannedResult && (
              <div>
                <p className="text-gray-600 mb-4 text-center">Position your camera over a QR code to scan it</p>
                <div id="qr-reader" className="mb-4"></div>
              </div>
            )}
            
            {scannedResult && !scannedProductData && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-2">Raw QR Code Data:</p>
                <p className="text-sm text-yellow-700 break-all">{scannedResult}</p>
                <p className="text-xs text-yellow-600 mt-2">This doesn't appear to be product data. Please scan a product QR code.</p>
              </div>
            )}

            {scannedProductData && (
              <div className="mb-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <h4 className="font-medium text-green-800 mb-2">✅ Product Scanned Successfully!</h4>
                  <div className="space-y-2 text-sm text-green-700">
                    <p><span className="font-medium">Name:</span> {scannedProductData.name}</p>
                    <p><span className="font-medium">SKU:</span> {scannedProductData.sku}</p>
                    <p><span className="font-medium">Category:</span> {scannedProductData.category}</p>
                    <p><span className="font-medium">Price:</span> Rs. {scannedProductData.price}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleAddScannedProduct}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Add This Product
                  </button>
                  <button
                    onClick={() => {
                      setScannedResult('');
                      setScannedProductData(null);
                      startScanning();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Scan Another
                  </button>
                </div>
              </div>
            )}
            
            {!scannedResult && (
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeModal;
