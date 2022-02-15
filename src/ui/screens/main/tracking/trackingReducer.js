import { DRIVER_LOCATION, FETCH_RIDING, TRACK_RIDE } from './trackingAction';
import { ADD_STATUS_COMPLETE } from '../status/statusActions';
import { Utils } from '../../../../commons';
import Strings from '../../../../utils/LocalizationConfig';
import { LOGOUT } from '../../../../actions/commonActions';

function convertLatToLatitude(obj) {
    if (!obj) return { latitude: 0, longitude: 0 };
    return {
        latitude: obj.lat,
        longitude: obj.lng,
    };
}

export const initState = {
    action: '',
    riding: {
        loading: false,
        data: [],
    },
    trackRide: {
        loading: false,
        driverLocation: null,
        ride: null,
        completeCallback: null,
    },
};

export default function trackingReducer(state = initState, { type, data, error, ...args }) {
    let newState = { ...state, action: type };
    switch (type) {
        case LOGOUT: {
            return {
                ...initState,
            };
        }
        case ADD_STATUS_COMPLETE: {
            const { trackRide } = newState;
            const { ride, completeCallback } = trackRide;

            if (ride === data.id_trip && completeCallback) {
                completeCallback();
            } else {
                Utils.showToast(Strings('message.ride_complete'));
            }
            return newState;
        }

        case DRIVER_LOCATION: {
            newState = {
                ...newState,
                trackRide: {
                    ...newState.trackRide,
                    driverLocation: convertLatToLatitude(data.location),
                },
            };
            return newState;
        }
        case TRACK_RIDE.LOADING: {
            const { completeCallback, tripId } = args;
            console.log(completeCallback, 'loading');
            newState = {
                ...newState,
                trackRide: {
                    loading: true,
                    driverLocation: null,
                    ride: tripId,
                    completeCallback,
                },
            };
            return newState;
        }
        case TRACK_RIDE.SUCCESS: {
            const { driver } = data;
            const { location } = driver;

            newState = {
                ...newState,
                trackRide: {
                    ...newState.trackRide,
                    loading: false,
                    driverLocation: {
                        latitude: location.lat,
                        longitude: location.lng,
                    },
                },
            };
            return newState;
        }
        case TRACK_RIDE.ERROR: {
            newState = {
                ...newState,
                trackRide: {
                    ...newState.trackRide,
                    loading: false,
                    driverLocation: null,
                    ride: null,
                },
            };
            return newState;
        }
        case FETCH_RIDING.LOADING: {
            newState = {
                ...newState,
                riding: {
                    loading: true,
                    data: [],
                },
            };
            return newState;
        }
        case FETCH_RIDING.SUCCESS: {
            newState = {
                ...newState,
                riding: {
                    loading: false,
                    data: data.trips,
                },
            };
            return newState;
        }
        case FETCH_RIDING.ERROR: {
            newState = {
                riding: {
                    loading: false,
                    data: [],
                },
            };
            return newState;
        }
        default:
            return newState;
    }
};
