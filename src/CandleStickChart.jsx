import React from "react";
import Chart from "react-apexcharts";

const CandleStickChart = () => {
  const series = [
    {
      data: [
        {
          x: new Date(2023, 3, 5),
          y: [135, 140, 132, 138], // [open, high, low, close]
        },
        {
          x: new Date(2023, 3, 6),
          y: [138, 145, 137, 142],
        },
        {
          x: new Date(2023, 3, 7),
          y: [142, 150, 140, 148],
        },
        {
          x: new Date(2023, 3, 8),
          y: [148, 155, 146, 152],
        },
      ],
    },
  ];

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
      background: "transparent",
      toolbar: { show: true },
    },
    title: {
      text: "Candlestick Pattern",
      align: "left",
      style: { color: "#fff" },
    },
    xaxis: {
      type: "datetime",
      labels: { style: { colors: "#fff" } },
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: { style: { colors: "#fff" } },
    },
    grid: {
      borderColor: "#333",
    },
  };

  return (
    <div className="bg-gray-900 p-4 rounded-2xl shadow-lg">
      <Chart options={options} series={series} type="candlestick" height={350} />
    </div>
  );
};

export default CandleStickChart;
