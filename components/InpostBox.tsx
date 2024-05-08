// components\InpostBox.tsx
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function InpostBox({ closeModal }) {
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    const scriptId = 'easyPackScript';
    if (!document.getElementById(scriptId)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://geowidget.easypack24.net/css/easypack.css';
      link.onload = appendScript;
      document.head.appendChild(link);
    }

    function appendScript() {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://geowidget.easypack24.net/js/sdk-for-javascript.js';
      script.onload = initEasyPack;
      document.body.appendChild(script);
    }

    function initEasyPack() {
      if (window.easyPack) {
        window.easyPack.init({
          mapType: 'osm',
          searchType: 'osm',
        });
        window.easyPack.mapWidget('easypack-map', function(point) {
          setSelectedPoint(point);
          localStorage.setItem('selectedPaczkomat', JSON.stringify(point));
          toast.success(`You have selected Paczkomat: ${point.name}`);
          setTimeout(() => {
            closeModal();
            window.location.reload();  // Refresh the page after modal closes
          }, 2000);  // Delay before closing the modal and refreshing
        });
      }
    }

    return () => {
      const script = document.getElementById(scriptId);
      if (script) document.body.removeChild(script);
      const styles = document.querySelector('link[href="https://geowidget.easypack24.net/css/easypack.css"]');
      if (styles) document.head.removeChild(styles);
    };
  }, [closeModal]);

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
      padding: '5px',
      zIndex: 1050,
      width: '100%',  
      height: '100%', 
      borderRadius: '8px',
      overflow: 'auto'
    }}>
      <div id="easypack-map" style={{ height: '100%', width: '100%' }}></div>
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
        padding: '1px 1px',
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
