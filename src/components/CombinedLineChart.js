import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function CombinedLineChart({ data }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun" , "Jul", "Aug", "Sep" ];

  // Build series for Highcharts
  const series = Object.entries(data).map(([name, values]) => ({
    name,
    data: months.map(month => values?.[month] ?? null)
  }));

  // Determine chart heading
  let heading = "";
  const keys = Object.keys(data);

  if (keys.length === 1) {
    // Single series → direct name + Performance
    heading = `${keys[0]} Performance`;
  } else {
    // Multiple series → find common part (Mobile / Desktop)
    if (keys.every(k => k.toLowerCase().includes("mobile"))) {
      heading = "Mobile (Searches + Maps) Performance";
    } else if (keys.every(k => k.toLowerCase().includes("desktop"))) {
      heading = "Desktop (Searches + Maps) Performance";
    } else {
      heading = "Combined Performance";
    }
  }

  const options = {
    chart: { type: "line", height: 600 },
    title: { text: null },
    xAxis: { categories: months },
    yAxis: { title: { text: "Value" } },
    tooltip: { shared: true, crosshairs: true },
    plotOptions: {
      line: { dataLabels: { enabled: true }, enableMouseTracking: true }
    },
    credits: { enabled: false },
    series
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "1em",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        minHeight: "600px",
        opacity: 0.8
      }}
    >
      <div className="graphs3">
        <h3 style={{ padding: "20px", textAlign: "center", color: "white" }}>
          {heading}
        </h3>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

