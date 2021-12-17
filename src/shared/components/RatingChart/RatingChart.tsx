import {useEffect, useState} from "react";
import {Chart} from "react-google-charts";
import {ChartWrapperOptions} from "react-google-charts/dist/types";
import {ChartRating} from "../../models";
import styles from "./RatingChart.module.scss";

const initialData = [
  ["Stars", "Number of reviews", {role: "style"}],
  ["1 ★", 0, "color: red"],
  ["2 ★", 0, "color: red"],
  ["3 ★", 0, "color: orange"],
  ["4 ★", 0, "color: green"],
  ["5 ★", 0, "color: green"],
];

const options: ChartWrapperOptions["options"] = {
  legend: "none",
  bar: {groupWidth: "35%"},
  hAxis: {
    textPosition: "none",
    gridlines: {count: 0},
    baselineColor: "none",
  },
  vAxis: {
    textPosition: "",
  },
};

export const RatingChart = ({
  rating,
  height,
}: {
  rating: ChartRating;
  height: string;
}) => {
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
        height={height}
        chartType="PieChart"
        data={data}
        options={{
          is3D: true,
        }}
      />
      <Chart
        chartType="BarChart"
        height={height}
        data={data}
        options={options}
      />
    </div>
  );
};
