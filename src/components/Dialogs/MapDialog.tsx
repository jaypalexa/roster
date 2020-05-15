import { Icon } from 'leaflet';
import MapDataModel from 'models/MapDataModel';
import MapPointModel from 'models/MapPointModel';
import React, { useEffect, useRef, useState } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { handleModalKeyDownEvent } from 'utils';
import './MapDialog.sass';

interface MapDialogProps {
  isActive: boolean,
  mapData: MapDataModel,
  onCloseClick: any
}

const MapDialog: React.FC<MapDialogProps> = ({isActive, mapData, onCloseClick}) => {
  const [activeMarker, setActiveMarker] = useState<MapPointModel | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isActive) return;
    closeButtonRef?.current?.focus();
    document.addEventListener('keydown', handleModalKeyDownEvent);
    return () => {
      document.removeEventListener('keydown', handleModalKeyDownEvent);
    }
  }, [isActive]);

  const mapIcon = new Icon({
    iconUrl: '/favicon-32x32.png',
    iconSize: [32, 32]
  });

  const center = mapData.center || [{latitude: 0, longitude: 0}];

  return (
    isActive ?
      <div className={`modal ${isActive ? 'is-active' : ''}`}>
        <div className='modal-background'></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <h2 className='subtitle has-text-centered map-header'>{mapData.title || ''}</h2>
            {mapData.subtitle ? <h3 className='subtitle has-text-centered map-header'>{mapData.subtitle || ''}</h3> : null}
            {/* {mapData.subtitle ? <><br /><h2 className='subtitle has-text-centered'>{mapData.subtitle || ''}</h2></> : null}
            <button className='close-icon-button' aria-label='close' onClick={onCloseClick}>
              <i className='fa fa-window-close'></i>
            </button> */}
          </header>
          <section className='modal-card-body'>
            <Map center={[center.latitude, center.longitude]} zoom={mapData.initialZoom || 7}>
              {mapData.markers ? 
                mapData.markers.map(marker => (
                  <Marker
                    key={`${marker.latitude}${marker.longitude}`}
                    position={[ marker.latitude, marker.longitude ]}
                    onClick={() => setActiveMarker(marker)}
                    icon={mapIcon}
                  /> 
                ))
              : null}

              {activeMarker && (
                <Popup
                  position={[ activeMarker.latitude, activeMarker.longitude ]}
                  onClose={() => setActiveMarker(null)}
                >
                  <div>
                    {activeMarker.description ?
                      <p className='marker-description'>{activeMarker.description}</p>
                    : null}
                    <p>{`Lat: ${activeMarker.latitude}`}</p>
                    <p>{`Lon: ${activeMarker.longitude}`}</p>
                  </div>
                </Popup>
              )}

              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
            </Map>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-danger' onClick={onCloseClick} ref={closeButtonRef}>Close</button>
          </footer>
        </div>
      </div> 
    : null
  );
};

export default MapDialog;
