import { Icon } from 'leaflet';
import React from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import Modal from 'react-modal';
import MapDataModel from '../../types/MapDataModel';
import './MapDialog.sass';

interface MapDialogProps {
  isActive: boolean,
  mapData: MapDataModel,
  onCloseClick: any
}

const MapDialog: React.FC<MapDialogProps> = ({isActive, mapData, onCloseClick}) => {
  
  const mapIcon = new Icon({
    iconUrl: "/favicon-32x32.png",
    iconSize: [32, 32]
  });

  return (
    <Modal isOpen={isActive}>
      <div className='dialog-header'>
        <h2 className='subtitle has-text-centered'>{mapData.title}</h2>
      </div>
      <div className='dialog-content'>
        <Map center={[28.681389, -82.46]} zoom={5}>
          {mapData.latitude && mapData.longitude ? 
            <Marker
              key={`${mapData.latitude}${mapData.longitude}`}
              position={[ mapData.latitude, mapData.longitude ]}
              onClick={() => {}}
              icon={mapIcon}
            /> 
          : null}
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
