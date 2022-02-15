import { processColor } from 'react-native';
import moment from 'moment';
import { normalize } from '../../../../../commons/utils';
import { Colors } from '../../../../../commons';
import { DAILY } from '../../../../../commons/const';

export const legend = {
    enabled: false,
};

export const chartData = (data) => ({
    dataSets: [{
        values: data,
        label: '',
        config: {
            drawValues: false,
            color: processColor(Colors.COLOR_NEUTRAL_3),
            highlightAlpha: 255,
            highlightColor: processColor(Colors.COLOR_PRIMARY_1),
        },
    }],
    config: {
        barWidth: 0.6,
    },
});

export const highlights = [{ x: 3 }, { x: 6 }];

export const xAxis = (labels, type) => ({
    valueFormatter: type === DAILY ? labels.map((l) => moment(l, 'MM/DD/YYYY').format('DD/MM')) : labels,
    granularityEnabled: true,
    granularity: 1,
    position: 'BOTTOM',
    textSize: normalize(12),
    axisLineWidth: 1,
    axisLineColor: processColor(Colors.COLOR_NEUTRAL_2),
    gridLineWidth: 0,
    gridColor: processColor(Colors.COLOR_TRANSPARENT),
});

export const yAxis = {
    right: {
        enabled: false,
    },
    left: {
        axisLineWidth: 1,
        axisLineColor: processColor(Colors.COLOR_BLACK),
        gridLineWidth: 1,
        gridColor: processColor(Colors.COLOR_TRANSPARENT),
        enabled: true,
        granularity: 1,
        axisMinimum: 0,
    },
};

export const zoom = {
    scaleX: 4,
    scaleY: 1,
    xValue: 500,
    yValue: 1,
    axisDependency: 'RIGHT',
};

export const visibleRange = (type) => ({ x: { min: type === DAILY ? 7 : 5, max: type === DAILY ? 7 : 5 } });
