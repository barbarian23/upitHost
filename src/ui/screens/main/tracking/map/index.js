import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import React, { useState } from 'react';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';
import { Utils } from '../../../../../commons';
import { normalize } from '../../../../../commons/utils';

function convertLatToLatitude(obj) {
    if (!obj) return { latitude: 0, longitude: 0 };
    return {
        latitude: obj.lat,
        longitude: obj.lng,
    };
}

const locationMarkerImage = (ride) => {
    if (ride && !ride.is_to_airport === !ride.time_riding) {
        return require('../../../../../assets/icons/ic_airport_marker.png');
    }
    return require('../../../../../assets/icons/ic_address_marker.png');
};

const getLocationGeoPoint = (data) => {
    const timeRiding = data.time_riding;
    const geoPointFrom = data.geopoint_from;
    const geoPointTo = data.geopoint_to;
    if (timeRiding) {
        return {
            icon: locationMarkerImage(data),
            geoPoint: convertLatToLatitude(geoPointTo),
        };
    }
    return {
        icon: locationMarkerImage(data),
        geoPoint: convertLatToLatitude(geoPointFrom),
    };
};

export default function Map(props) {
    const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
    const driverLocation = useSelector((state) => state.trackingReducer.trackRide.driverLocation);
    const { ride } = props;
    // const driver = ride ? ride.driver : null;
    // const driverLocation = driver ? driver.location : null;
    const driverMarker = driverLocation && (
        <Marker
            coordinate={driverLocation}
            title="Driver location"
        >
            <Image
                source={require('../../../../../assets/icons/ic_driver_marker.png')}
                style={{
                    width: normalize(32),
                    height: normalize(32),
                    resizeMode: 'contain',
                }}
            />
        </Marker>
    );

    const { icon, geoPoint } = ride ? getLocationGeoPoint(ride) : {
        icon: null,
        geoPoint: { longitude: 0, latitude: 0 },
    };

    const locationMarker = geoPoint && (
        <Marker
            coordinate={geoPoint}
            title="Driver location"
        >
            <Image
                source={icon}
                style={{
                    width: normalize(32),
                    height: normalize(32),
                    resizeMode: 'contain',
                }}
            />
        </Marker>
    );

    const region = Utils.calculateRegion(mapSize, driverLocation, geoPoint);

    return (
        <MapView
            style={{ flex: 1 }}
            onLayout={(event) => {
                let { width, height } = event.nativeEvent.layout;
                setMapSize({ width, height });
            }}
            provider={PROVIDER_GOOGLE}
            region={region}
            customMapStyle={require('./mapStyle.json')}
        >
            {driverMarker}
            {locationMarker}
        </MapView>
    );
}
