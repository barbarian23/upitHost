import { createActionSet } from '../../../../actions';

export const GET_DAILY_STAT = createActionSet('GET_DAILY_STAT');
export const GET_MONTHLY_STAT = createActionSet('GET_MONTHLY_STAT');
export const GET_YEARLY_STAT = createActionSet('GET_YEARLY_STAT');

export const getDailyStat = (params) => ({
    type: GET_DAILY_STAT.actionName,
    params,
});

export const getMonthlyStat = (params) => ({
    type: GET_MONTHLY_STAT.actionName,
    params,
});

export const getYearlyStat = (params) => ({
    type: GET_YEARLY_STAT.actionName,
    params,
});
