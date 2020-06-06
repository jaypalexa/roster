import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Theme } from '@material-ui/core';
import { Icon } from 'leaflet';
import MapDataModel from 'models/MapDataModel';
import MapPointModel from 'models/MapPointModel';
import React, { useEffect, useState } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import sharedStyles from 'styles/sharedStyles';

interface MapDialogProps {
  isOpen: boolean,
  mapData: MapDataModel,
  onCloseClick: any
}

const MapDialog: React.FC<MapDialogProps> = ({isOpen, mapData, onCloseClick}) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(
      {
        ...sharedStyles(theme),
        dialogContent: {
          overflow: 'hidden',
        },
        dialogTitle: {
          fontSize: 'large',
          textAlign: 'center',
        },
        dialogSubtitle: {
          textAlign: 'center',
        },
        '@global': {
          '.leaflet-container': {
            width: '100%',
            height: '80vh',
          },
          '.leaflet-popup-content p': {
            margin: '0 ! important',
          },
          '.marker-description': {
            fontSize: 'larger',
            marginBottom: '.25rem ! important',
          },
        },
      })
  );
  const classes = useStyles();

  const [activeMarker, setActiveMarker] = useState<MapPointModel | null>(null);
  const [centerMapPoint, setCenterMapPoint] = useState<MapPointModel>({latitude: 0, longitude: 0});

  useEffect(() => {
    if (!isOpen) return;
    /* prefer to center on first marker, if present; else, use specified center */
    const firstMarker = (mapData.markers && mapData.markers.length > 0) ? mapData.markers[0] : null;
    setCenterMapPoint(firstMarker || mapData.center || {latitude: 0, longitude: 0});
  }, [isOpen, mapData.center, mapData.markers]);

  useEffect(() => {
    /* prevent map scroll-jump on first click */
    document.getElementById('mapComponent')?.focus();
  });

  const mapIcon = new Icon({
    iconUrl: '/favicon-32x32.png',
    iconSize: [32, 32]
  });

  return (
    isOpen ?
      <Dialog
        open={isOpen}
        aria-labelledby='map-dialog-title'
        aria-describedby='map-dialog-description'
        fullWidth={true}
      >
        <DialogTitle id='map-dialog-title'>
          <p className={classes.dialogTitle}>{mapData.title || ''}</p>
          {mapData.subtitle ? <p className={classes.dialogSubtitle}>{mapData.subtitle || ''}</p> : null}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Map id='mapComponent' center={[centerMapPoint.latitude, centerMapPoint.longitude]} zoom={mapData.initialZoom || 7}>
            {mapData.markers ? 
              mapData.markers.map(marker => (
                <Marker
                  key={`${marker.latitude}${marker.longitude}`}
                  position={[marker.latitude, marker.longitude]}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseClick} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog> 
    : null
  );
};

export default MapDialog;
