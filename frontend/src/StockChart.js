import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

export default React.memo(function StockChart({ data, accuracy }) {
  useEffect(() => {}, [data]);

  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: "Stock Price",
        data: data.map((entry) => entry.price),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(75,192,192,1)",
        pointRadius: 3,
        pointHitRadius: 10,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Stock Price",
        },
      },
    },
  };
  return (
    <div>
      <Line key={Math.random()} data={chartData} options={chartOptions} />
      <p>
        This is the price forecast for the following week from now based on our
        machine learning model with an accuracy of {accuracy}%.
      </p>
      <p>
        Disclaimer: This application is meant for entertainment purposes only
        and in no one way is meant to replace a sound financial advice and
        philosophy. It is not advised to invest on the basis of this graph. If
        you do though, it will be in your own risk because the result might not
        be accurate.
      </p>
    </div>
  );
});
