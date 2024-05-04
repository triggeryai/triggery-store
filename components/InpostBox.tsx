import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function InpostBox({ closeModal }) {
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://geowidget.easypack24.net/js/sdk-for-javascript.js';
    script.onload = initEasyPack; 
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://geowidget.easypack24.net/css/easypack.css';
    document.head.appendChild(link);

    function initEasyPack() {
      if (window.easyPack) {
        window.easyPack.init({
          mapType: 'osm',
          searchType: 'osm',
        });
        window.easyPack.mapWidget('easypack-map', function(point) {
          // Update the state with selected point details
          setSelectedPoint(point);
          // Save selected point to localStorage
          localStorage.setItem('selectedPaczkomat', JSON.stringify(point));
          // Show toast notification
          toast.success(`You have selected Paczkomat: ${point.name}`);
        });
      }
    }

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div style={{
      display: 'block',
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#fff',
      border: '1px solid #ccc',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '20px',
      zIndex: 1050,
      width: '95%',  
      height: '95%', 
      borderRadius: '8px',
      overflow: 'auto'
    }}>
      <div id="easypack-map" style={{ height: '75%', width: '100%' }}></div>
      {selectedPoint && (
        <div style={{ paddingTop: '20px' }}>
          <p><strong>Selected Paczkomat:</strong></p>
          <p>ID: {selectedPoint.name}</p>
          <p>Address: {selectedPoint.address.line1}, {selectedPoint.address.line2}</p>
        </div>
      )}
      <button onClick={closeModal} style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '5px 10px',
        fontSize: '16px',
        background: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>Close</button>
    </div>
  );
}
