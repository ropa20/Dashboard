import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";

interface IChart {
  data?: any[];
  colors?: any;
  labels?: any[];
  bar?: Boolean;
  line?: Boolean;
  height: number;
  width: number;
}
function Chart(props: IChart) {
  const chartData: any = canvas => {
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(20, 600, 1000, 0);
    gradient.addColorStop(0, props.colors.color2);
    gradient.addColorStop(0.5, props.colors.color1);
    gradient.addColorStop(0.7, props.colors.color1);
    gradient.addColorStop(1, props.colors.color2);
    return {
      labels: props.labels,
      datasets: [
        {
          barPercentage: 0.5,
          barThickness: 30,
          maxBarThickness: 100,
          minBarLength: 2,
          // label: 'Confirmed',
          data: props.data,
          backgroundColor: gradient,
          borderWidth: 2,
        },
      ],
    };
  };

  const options: any = {
    responsive: true,
    tooltips: {
      mode: "index",
      intersect: false,
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            display: false,
          },

          gridLines: {
            drawBorder: false,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            dispaly: false,
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
    legend: {
      display: false,
      position: "bottom",
      labels: {
        fontColor: "#734F96",
      },
    },
  };

  return (
    <>
      {props.bar ? (
        <Bar data={chartData} options={options} width={props.height} height={props.width} />
      ) : props.line ? (
        <Line
          width={props.width}
          height={props.height}
          data={{
            labels: props.labels,
            datasets: [
              {
                data: props.data,
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
              },
            ],
          }}
        />
      ) : null}
    </>
  );
}

export default Chart;
