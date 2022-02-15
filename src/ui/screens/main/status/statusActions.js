import { createActionSet } from '../../../../actions';
import { Constants } from '../../../../commons';

export const FETCH_BOOKING = createActionSet('FETCH_BOOKING');
export const FETCH_ASSIGN = createActionSet('FETCH_ASSIGN');
export const FETCH_COMPLETED = createActionSet('FETCH_COMPLETED');
export const APPLY_FILTER = 'APPLY_FILTER';

export const ADD_STATUS_BOOKING = 'ADD_BOOKING';
export const ADD_STATUS_CONFIRM = 'ADD_CONFIRM';
export const ADD_STATUS_COMPLETE = 'ADD_COMPLETE';
export const ADD_STATUS_UPDATE = 'ADD_UPDATE';
// Passenger has been picked up
export const PSG_PICKED_UP = 'PSG_PICKED_UP';

export const applyFilter = (data) => ({
    type: APPLY_FILTER,
    data,
});

export const fetchBooking = () => ({
    type: FETCH_BOOKING.actionName,
    dataType: Constants.STATUS_BOOKING,
});

export const fetchAssign = () => ({
    type: FETCH_ASSIGN.actionName,
    dataType: Constants.STATUS_CONFIRM,
});

export const fetchCompleted = () => ({
    type: FETCH_COMPLETED.actionName,
    dataType: Constants.STATUS_COMPLETE,
});

export const addNewBookingRide = (data) => ({
    type: ADD_STATUS_BOOKING,
    data,
});

export const addNewConfirmRide = (data) => ({
    type: ADD_STATUS_CONFIRM,
    data,
});

export const addNewCompleteRide = (data) => ({
    type: ADD_STATUS_COMPLETE,
    data,
});

export const updateRide = (data) => ({
    type: ADD_STATUS_UPDATE,
    data,
});

export const ridingTrip = (data) => ({
    type: PSG_PICKED_UP,
    data,
});
