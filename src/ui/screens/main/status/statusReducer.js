import {
    ADD_STATUS_BOOKING,
    ADD_STATUS_COMPLETE,
    ADD_STATUS_CONFIRM,
    ADD_STATUS_UPDATE,
    APPLY_FILTER,
    FETCH_ASSIGN,
    FETCH_BOOKING,
    FETCH_COMPLETED,
} from './statusActions';
import { LOGOUT } from '../../../../actions/commonActions';

export const initialState = {
    filterDate: '',
    booking: {
        filterData: [],
        data: [],
        loading: false,
        success: false,
    },
    assign: {
        filterData: [],
        data: [],
        loading: false,
        success: false,
    },
    complete: {
        filterData: [],
        data: [],
        loading: false,
        success: false,
    },
};

const reformatDateToFilter = (date) => {
    if (date === '') return date;
    const components = date.split('-');
    return `${components[2]}/${components[1]}/${components[0]}`;
};

export const statusReducer = (state = initialState, { type, data, error }) => {
    let newState = { ...state, action: type };
    switch (type) {
        case LOGOUT: {
            return {
                ...initialState,
            };
        }
        case APPLY_FILTER: {
            const query = reformatDateToFilter(data);
            const { booking, assign, complete } = newState;
            booking.filterData = booking.data.filter((trip) => trip.time_leave.includes(query));

            assign.filterData = assign.data.filter((trip) => trip.time_leave.includes(query));

            complete.filterData = complete.data.filter((trip) => trip.time_leave.includes(query));

            newState = {
                ...newState,
                booking,
                assign,
                complete,
                filterDate: query,
            };
            return newState;
        }

        case ADD_STATUS_BOOKING: {
            const { filterDate } = newState;

            newState = {
                ...newState,
                booking: {
                    ...newState.booking,
                    data: [data, ...newState.booking.data],
                    filterData: (data.time_leave.includes(filterDate))
                        ? [data, ...newState.booking.filterData] : newState.booking.filter,
                },
            };
            return newState;
        }

        case ADD_STATUS_CONFIRM: {
            const { filterDate } = newState;

            newState = {
                ...newState,
                assign: {
                    ...newState.assign,
                    data: [data, ...newState.assign.data],
                    filterData: (data.time_leave.includes(filterDate))
                        ? [data, ...newState.assign.filterData] : newState.assign.filter,
                },
            };
            return newState;
        }

        case ADD_STATUS_COMPLETE: {
            const { filterDate } = newState;

            newState = {
                ...newState,
                complete: {
                    ...newState,
                    complete: {
                        ...newState.complete,
                        data: [data, ...newState.complete.data],
                        filterData: (data.time_leave.includes(filterDate))
                            ? [data, ...newState.complete.filterData] : newState.complete.filter,
                    },
                },
            };
            return newState;
        }

        case ADD_STATUS_UPDATE: {
            const bookingRides = newState.booking.data.filter((ride) => ride.serial !== data.serial);
            const bookingRidesFilter = newState.booking.filterData.filter((ride) => ride.serial !== data.serial);

            const assignRides = newState.assign.data.filter((ride) => ride.serial !== data.serial);
            const assignRidesFilter = newState.assign.filterData.filter((ride) => ride.serial !== data.serial);

            const { filterDate } = newState;

            newState = {
                ...newState,
                booking: {
                    ...newState.booking,
                    data: [data, ...bookingRides],
                    filterData: (data.time_leave.includes(filterDate))
                        ? [data, ...bookingRidesFilter] : newState.booking.filter,
                },
                assign: {
                    ...newState.assign,
                    data: assignRides,
                    filterData: (data.time_leave.includes(filterDate))
                        ? [data, ...assignRidesFilter] : newState.assign.filter,
                },
            };

            return newState;
        }

        case FETCH_BOOKING.LOADING: {
            newState = {
                ...newState,
                booking: {
                    loading: true,
                    success: false,
                    data: [],
                    filterData: [],
                },
            };
            return newState;
        }
        case FETCH_BOOKING.SUCCESS: {
            const { trips } = data;
            newState = {
                ...newState,
                booking: {
                    loading: false,
                    success: true,
                    data: trips,
                    filterData: trips,
                },
            };
            return newState;
        }
        case FETCH_BOOKING.ERROR: {
            console.log('error fetching booking', error);
            newState = {
                ...newState,
                booking: {
                    loading: false,
                    success: false,
                    data: [],
                    filterData: [],
                },
            };
            return newState;
        }
        case FETCH_ASSIGN.LOADING: {
            newState = {
                ...newState,
                assign: {
                    loading: true,
                    success: false,
                    data: [],
                    filterData: [],
                },
            };
            return newState;
        }
        case FETCH_ASSIGN.SUCCESS: {
            const { trips } = data;
            newState = {
                ...newState,
                assign: {
                    loading: false,
                    success: true,
                    data: trips,
                    filterData: trips,
                },
            };
            return newState;
        }
        case FETCH_ASSIGN.ERROR: {
            console.log('error fetching assign', error);
            newState = {
                ...newState,
                assign: {
                    loading: false,
                    success: false,
                    data: [],
                    filterData: [],
                },
            };
            return newState;
        }
        case FETCH_COMPLETED.LOADING: {
            newState = {
                ...newState,
                complete: {
                    loading: true,
                    success: false,
                    data: [],
                    filterData: [],
                },
            };
            return newState;
        }
        case FETCH_COMPLETED.SUCCESS: {
            const { trips } = data;
            newState = {
                ...newState,
                complete: {
                    loading: false,
                    success: true,
                    data: trips,
                    filterData: trips,
                },
            };
            return newState;
        }
        case FETCH_COMPLETED.ERROR: {
            console.log('error fetching booking', error);
            newState = {
                ...newState,
                complete: {
                    loading: false,
                    success: false,
                    data: [],
                    filterData: [],
                },
            };
            return newState;
        }
        default:
            return newState;
    }
};
