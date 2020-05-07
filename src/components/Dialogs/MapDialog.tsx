import useMount from 'hooks/UseMount';
import { Icon } from 'leaflet';
import React, { useState } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Modal from 'react-modal';
import MapDataModel from 'types/MapDataModel';
import MapPointModel from 'types/MapPointModel';
import './MapDialog.sass';

interface MapDialogProps {
  isActive: boolean,
  mapData: MapDataModel,
  onCloseClick: any
}

const MapDialog: React.FC<MapDialogProps> = ({isActive, mapData, onCloseClick}) => {
  
  const [activeMarker, setActiveMarker] = useState<MapPointModel | null>(null);

  useMount(() => {
    Modal.setAppElement('#app')
  });

  const mapIcon = new Icon({
    iconUrl: '/favicon-32x32.png',
    iconSize: [32, 32]
  });

  const center = mapData.center || [{latitude: 0, longitude: 0}];

  return (
    <Modal isOpen={isActive}>
      <div className='dialog-header'>
        <h2 className='subtitle has-text-centered'>{mapData.title || ''}</h2>
      </div>
      <div className='dialog-content'>
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
      </div>
      <div className='dialog-footer'>
        <button className='button is-danger is-centered-both' onClick={onCloseClick}>Close</button>
      </div>
    </Modal>
  );
};

export default MapDialog;
