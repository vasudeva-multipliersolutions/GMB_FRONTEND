import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function CombinedLineChart({ data }) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Get the first (and only) entry from the data
  const [[rawName, values]] = Object.entries(data);

  // Convert to readable name
  const readableName = rawName
    .replace(/^graphData/, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim();

  const lineData = months.map(month => values?.[month] ?? null);

  const options = {
    chart: {
      type: 'line',
      height: 600
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
      enabled: false
    },
    series: [
      {
        name: readableName,
        data: lineData
      }
    ]
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "1em",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        minHeight: "600px",
        opacity: 0.8,
      }}
    >
      <div className="graphs3">
        <h3 style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
          {readableName} Performance
        </h3>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
