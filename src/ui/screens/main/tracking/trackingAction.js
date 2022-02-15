import { createActionSet } from '../../../../actions';

export const FETCH_RIDING = createActionSet('FETCH_RIDING');
export const TRACK_RIDE = createActionSet('TRACK_RIDE');
export const DRIVER_LOCATION = 'DRIVER_LOCATION';

export const fetchRiding = (callback) => ({
    type: FETCH_RIDING.actionName,
    callback,
});

export const trackRide = (data, completeCallback) => ({
    type: TRACK_RIDE.actionName,
    requestData: data,
    completeCallback,
});

export const updateDriverLocation = (data) => ({
    type: DRIVER_LOCATION,
    data,
});
