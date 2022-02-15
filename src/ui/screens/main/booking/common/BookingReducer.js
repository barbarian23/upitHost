import { CLEAR_DATA, GET_AIRPORT, GET_CAR_RENTAL_PRICE, GET_EXTRA_PRICE, GET_PRICE } from './BookingAction';
import { LOGOUT } from '../../../../../actions/commonActions';

export const initState = {
    action: '',
    airports: {
        loading: false,
        data: [],
    },
};

const bookingReducer = (state = initState, { type, data, ...responseData } = {}) => {
    let newState = { ...state };
    newState.action = type;
    switch (type) {
        case LOGOUT:
        case CLEAR_DATA: {
            return { ...newState, extraPrice: { loading: false, data: null }, price: { loading: false, data: null } };
        }

        case GET_AIRPORT.LOADING: {
            return { ...newState, airports: { loading: true, data: [] } };
        }
        case GET_AIRPORT.SUCCESS: {
            return { ...newState, airports: { loading: false, data: getAirportWithTerminal(data.airports) } };
        }
        case GET_AIRPORT.ERROR: {
            return { ...newState, airports: { loading: false, data: [] } };
        }
        default:
            return newState;
    }
};

export default bookingReducer;

export const getAirportWithTerminal = (airports: any): any => {
    let airportWithTerminals = [];
    airports.map((airport: any): any => {
        if (airport.terminal) {
            airport.terminal.map((terminal: any): any => {
                // eslint-disable-next-line camelcase
                let { name_vi, name_en } = terminal;
                airportWithTerminals.push(
                    {
                        ...airport,
                        id: `${airport.symbol}_${terminal.symbol}`,
                        terminal_name_vi: name_vi,
                        terminal_name_en: name_en,
                    },
                );
                return terminal;
            });
        } else {
            airportWithTerminals.push({ ...airport, id: airport.symbol });
        }
        return airport;
    });
    return airportWithTerminals;
};
