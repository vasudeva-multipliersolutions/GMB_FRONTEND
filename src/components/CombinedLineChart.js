import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function CombinedLineChart({ data }) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const series = Object.entries(data).map(([key, values]) => {
    const lineData = months.map(month => values?.[month] ?? null);
    const readableName = key
      .replace(/^graphData/, '')
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim();

    return {
      name: readableName,
      data: lineData
    };
  });

  const options = {
    chart: {
      type: 'line',
      height: 600 // ✅ Increase height here
    },
    title: {
      text: null
    },
    xAxis: {
      categories: months
    },
    yAxis: {
      title: {
        text: 'Value'
      }
    },
    tooltip: {
      shared: true,
      crosshairs: true
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: true
      }
    },
    credits: {
      enabled: false // ✅ Remove watermark
    },
    series: series
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        marginRight: "20%",
        borderRadius: "1em 1em 1em 1em",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        margin: "20px 45px 0px 10px",
        minHeight: "600px", // Optional container fallback
        opacity: 0.8,
      }}
    >
      <div className="graphs3"><h3  style={{ padding: '20px', textAlign: 'center', color: 'white', }}>Unit Profile Performance</h3></div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
