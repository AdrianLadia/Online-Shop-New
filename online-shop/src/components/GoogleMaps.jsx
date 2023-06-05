import { useState } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import React from 'react';
import { useEffect } from 'react';
import AppContext from '../AppContext';
import firestoredb from '../firestoredb';
import { CircularProgress } from '@mui/material';
import Geocode from 'react-geocode';
import dataManipulation from '../../utils/dataManipulation';
import UpdateMapMarkerModal from './UpdateMapMarkerModal';

// NOTES
// How to set up marker on click
// https://react-google-maps-api-docs.netlify.app/

const GoogleMaps = (props) => {

  let { isLoaded } = useLoadScript({
    // googleMapsApiKey: 'AIzaSyAM-GEFgvP7ge4_P15OOSjYslrC-Seroro',
    googleMapsApiKey: 'AIzaSyCSe_aW1KBvOn-2j9GNOEiSJ4Fp52dOM-I',
  });

  const [noAddressHistory, setNoAddressHistory] = useState(undefined);
  const setSelectedAddress = props.setSelectedAddress;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [rerendercount, setRerenderCount] = useState(0);
  const datamanipulation = new dataManipulation();
  const locallatitude = props.locallatitude;
  const locallongitude = props.locallongitude;
  const setLocalLatitude = props.setLocalLatitude;
  const setLocalLongitude = props.setLocalLongitude;
  const zoom = props.zoom;
  const setZoom = props.setZoom;
  const setLocalDeliveryAddress = props.setLocalDeliveryAddress;
  const setAddressText = props.setAddressText;
  const [containerClassName, setContainerClassName ] = useState("w-full h-[calc(100vh-200px)]") 

  const { firestore, userId, deliveryaddress, latitude, setLatitude, longitude, setLongitude } =
    React.useContext(AppContext);

  useEffect(()=>{
    if(props.forFooter){
      setContainerClassName("w-full h-[calc(45vh-200px)]") 
    }
  },[props.forFooter])

  let getLocation = () => {
    if(locallatitude && locallongitude) {
      setLocalLatitude(10.3622224);
      setLocalLongitude(123.9192341);
      setZoom(7);
    }else{
      navigator.geolocation.getCurrentPosition((position) => {
        setLocalLatitude(position.coords.latitude);
        setLocalLongitude(position.coords.longitude);
      });
    }
  };

  function onMapClick(e) {
    if (noAddressHistory) {
      setSelectedAddress(true);
    }
    setLatitude(e.latLng.lat());
    setLongitude(e.latLng.lng());
    setLocalDeliveryAddress('');

    let address = undefined;
    firestore.updateLatitudeLongitude(userId, e.latLng.lat(), e.latLng.lng());

    if (deliveryaddress.address === undefined) {
      address = deliveryaddress.address;
    } else {
      address = '';
    }
  }

  useEffect(() => {
    setRerenderCount(rerendercount + 1);
    if (latitude === 0 && longitude === 0) {
      getLocation();
      setSelectedAddress(false);
      setZoom(7);
    } else {
      setLocalLatitude(latitude);
      setLocalLongitude(longitude);
      setSelectedAddress(true);

      if (rerendercount >= 1) {
        setOpen(true);
      }
      // setZoom(18)
    }
  }, [latitude, longitude]);

  

  useEffect(() => {
    Geocode.setApiKey('AIzaSyCSe_aW1KBvOn-2j9GNOEiSJ4Fp52dOM-I');
    Geocode.setLanguage('en');
    Geocode.setLocationType('ROOFTOP');
    Geocode.fromLatLng(locallatitude, locallongitude).then(
      (response) => {
        // const address = datamanipulation.cleanGeocode(response.results[0].formatted_address)
        const address = response.results[0].formatted_address;
        setAddressText(address);
      },
      (error) => {
        console.error(error);
      }
    );
  }, [locallatitude, locallongitude]);

  return (
    <React.Fragment>
      {isLoaded ? (
        <React.Fragment>
          <GoogleMap
            clickableIcons={false}
            zoom={zoom}
            center={{ lat: locallatitude, lng: locallongitude }}
            onClick={(e) => {
              onMapClick(e);
            }}
            mapContainerClassName={containerClassName}
            disableDefaultUI={true}
            mapTypeControl={false}
          >
            <MarkerF position={{ lat: locallatitude, lng: locallongitude }} />
          </GoogleMap>
          <UpdateMapMarkerModal open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} />
        </React.Fragment>
      ) : (
        <div className="flex h-screen">
          <div className="flex flex-col justify-center m-auto">
            <CircularProgress size="20vh" />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default GoogleMaps;
