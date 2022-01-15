import {useEffect, useState} from 'react';
import {Chart} from 'react-google-charts';
import {ChartWrapperOptions} from 'react-google-charts/dist/types';
import {RATING_MAP} from '../../immutables';

import {ChartRating} from '../../models';
import {Overlay} from '../Overlay/Overlay';
import styles from './RatingChart.module.scss';

// data for BAR CHART
const headerData = [['Stars', 'Number of reviews', {role: 'style'}]];

const initialData = [1, 2, 3, 4, 5].reduce((acc, item) => {
  const rowData = [`${item} ★`, 0, `color: ${RATING_MAP[item - 1]}`];
  acc.push(rowData);
  return acc;
}, headerData as any[]);

// data for PIE CHART
const slices = RATING_MAP.reduce((acc, item, index) => {
  const color = item;
  return {...acc, ...{[index]: {color}}};
}, {});

const options: ChartWrapperOptions['options'] = {
  legend: 'none',
  bar: {groupWidth: '35%'},
  hAxis: {
    textPosition: 'none',
    gridlines: {count: 0},
    baselineColor: 'none',
  },
  vAxis: {
    textPosition: '',
  },
};

export const RatingChart = ({rating}: {rating: ChartRating}) => {
  function setRatingData() {
    const clonedData = [...data];
    clonedData.forEach((ratingData, index) => {
      if (index !== 0) {
        ratingData[1] = rating[`star${index}`];
      }
    });
    setData(clonedData);
  }

  const [data, setData] = useState(initialData);
  useEffect(() => {
    setRatingData();
  }, [rating]);

  return (
    <div className={styles.charts}>
      <Chart
        chartType="PieChart"
        loader={<Overlay showBackdrop={true} />}
        data={data}
        options={{is3D: true, slices}}
      />
      <Chart chartType="BarChart" data={data} options={options} />
    </div>
  );
};
