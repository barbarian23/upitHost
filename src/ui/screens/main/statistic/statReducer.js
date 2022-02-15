import { GET_DAILY_STAT, GET_MONTHLY_STAT, GET_YEARLY_STAT } from './statAction';
import { DAILY, MONTHLY } from '../../../../commons/const';
import { LOGOUT } from '../../../../actions/commonActions';

const initState = ({
    action: null,
    daily: {
        loading: false,
        data: [],
        dataDescription: [],
        totalAmount: [],
    },
    monthly: {
        loading: false,
        data: [],
        dataDescription: [],
        totalAmount: [],
    },
    yearly: {
        loading: false,
        data: [],
        dataDescription: [],
        totalAmount: [],
    },
});

const statState = (dataType) => {
    switch (dataType) {
        case DAILY: {
            return 'daily';
        }
        case MONTHLY: {
            return 'monthly';
        }
        default: {
            return 'yearly';
        }
    }
};

const MAX_PAGE = 20;
const PAGE_SIZE = 14;

const createEmptyArray = (page) => {
    let value = [];
    let dataDescription = [];
    let totalAmount = [];

    [...Array(PAGE_SIZE * page).keys()].forEach((i) => {
        value.push({ y: 0 });
        dataDescription.push('.');
        totalAmount.push(0);
    });

    return {
        value,
        dataDescription,
        totalAmount,
    };
};

const statReducer = (state = initState, { type, error, number, type_get, data }) => {
    let newState = { ...state, action: type };
    switch (type) {
        case LOGOUT: {
            return {
                ...initState,
            };
        }
        case GET_DAILY_STAT.LOADING:
        case GET_MONTHLY_STAT.LOADING:
        case GET_YEARLY_STAT.LOADING: {
            if (number === 0) {
                const { value, dataDescription, totalAmount } = createEmptyArray(MAX_PAGE);
                newState[statState(type_get)] = {
                    loading: true,
                    number,
                    data: value,
                    dataDescription,
                    totalAmount,
                };
            } else {
                newState[statState(type_get)] = {
                    ...newState[statState(type_get)],
                    loading: true,
                    number,
                };
            }

            return newState;
        }
        case GET_DAILY_STAT.SUCCESS:
        case GET_MONTHLY_STAT.SUCCESS:
        case GET_YEARLY_STAT.SUCCESS: {
            const stat = newState[statState(type_get)];
            // const { daily } = newState;
            let { value, dataDescription, totalAmount } = createEmptyArray(MAX_PAGE - number - 1);

            data.data.reverse().forEach((d) => {
                const { time } = d;
                dataDescription.push(`${time}`);
                value.push({ y: d.number_trip });
                totalAmount.push(d.price);
            });

            [...Array(PAGE_SIZE * number).keys()]
                .map((i) => i + PAGE_SIZE * (MAX_PAGE - number))
                .forEach((i) => {
                    value.push(stat.data[i]);
                    dataDescription.push(stat.dataDescription[i]);
                    totalAmount.push(stat.totalAmount[i]);
                });

            newState[statState(type_get)] = {
                ...newState[statState(type_get)],
                loading: false,
                data: value,
                dataDescription,
                totalAmount,
            };
            return newState;
        }

        case GET_DAILY_STAT.ERROR: {
            return newState;
        }
        case GET_MONTHLY_STAT.ERROR: {
            return newState;
        }
        case GET_YEARLY_STAT.ERROR: {
            return newState;
        }
        default: {
            return newState;
        }
    }
};

export default statReducer;
