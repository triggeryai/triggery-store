// components\PocztexBox.tsx
import React, { useEffect, useState, useRef } from 'react';

const PocztexBox = ({ closeModal }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [cssLoaded, setCssLoaded] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapContainerRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://mapa.ecommerce.poczta-polska.pl/widget/scripts/ppwidget.js";
        script.async = true;
        script.onerror = () => alert("Failed to load the map script. Please check your network connection.");
        document.body.appendChild(script);

        script.onload = () => {
            setScriptLoaded(true);
            // Ładowanie CSS po załadowaniu skryptu
            const link = document.createElement('link');
            link.href = "https://mapa.ecommerce.poczta-polska.pl/widget/map-widget-v016.html?v=002";
            link.type = "text/css";
            link.rel = "stylesheet";
            document.head.appendChild(link);

            link.onload = () => {
                setCssLoaded(true);
            };

            link.onerror = () => {
                alert("Failed to load the CSS. Please check your network connection.");
            };
        };

        return () => {
            document.body.removeChild(script);
            if (cssLoaded) {
                // Przyjmujemy, że tag <link> został dodany, więc go usuwamy
                document.head.removeChild(document.head.lastChild);
            }
        };
    }, []);

    useEffect(() => {
        if (scriptLoaded && cssLoaded && mapContainerRef.current) {
            if (typeof PPWidgetApp !== 'undefined') {
                PPWidgetApp.toggleMap({
                    elementId: 'pocztaMap',
                    callback: function (point) {
                        console.log('Received point data:', point);
                        if (!point) {
                            console.error('No point data received.');
                            return;
                        }
                        setMapLoaded(true);
                    },
                    type: ["POCZTA", "ORLEN", "AUTOMAT_POCZTOWY", "RUCH", "ZABKA", "FRESHMARKET", "AUTOMAT_BIEDRONKA", "AUTOMAT_CARREFOUR", "AUTOMAT_PLACOWKA", "AUTOMAT_SPOLEM", "SKRZYNKA_POCZTOWA", "AUTOMAT_LEWIATAN", "ABC", "DELIKATESY_CENTRUM", "LEWIATAN", "BIEDRONKA", "KAUFLAND"]
                });
            }
        }
    }, [scriptLoaded, cssLoaded, mapContainerRef]);

    return (
        <div className="modal-background">
            <div className="modal-content">
                <button onClick={closeModal} className="close-modal">Zamknij X</button>
                <div ref={mapContainerRef} id="mapContainer" style={{ width: '100%', height: '400px' }}>
                    {mapLoaded ? (
                        <div id="pocztaMap" style={{ width: '100%', height: '100%' }}></div>
                    ) : (
                        <p>Wczytuje mape....</p> // Wyświetlanie informacji o ładowaniu, gdy mapa nie jest jeszcze gotowa
                    )}
                </div>
            </div>
        </div>
    );
};

export default PocztexBox;
