import {useEffect} from "react";
import {Chart} from "react-google-charts";
import {ChartWrapperOptions} from "react-google-charts/dist/types";
import styles from "./RatingChart.module.scss";

const data = [
  ["Stars", "Number of reviews", {role: "style"}],
  ["5 ★", 100, "color: green"],
  ["4 ★", 90, "color: green"],
  ["3 ★", 70, "color: orange"],
  ["2 ★", 22, "color: red"],
  ["1 ★", 19, "color: red"],
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

export const RatingChart = (props) => {
  function setData() {}

  useEffect(() => {
    setData();
  }, [props.rating]);

  return (
    <div className={styles.charts}>
      <Chart
        height={props.height}
        chartType="PieChart"
        data={data}
        options={{
          is3D: true,
        }}
      />
      <Chart
        chartType="BarChart"
        height={props.height}
        data={data}
        options={options}
      />
    </div>
  );
};
