import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { t } from "./i18n";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function colorByClass(code) {
  switch (code) {
    case "good":
      return "#22c55e";
    case "moderate":
      return "#facc15";
    case "unhealthy":
      return "#f97316";
    case "very-unhealthy":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

export default function AirIndexChart({ history, lang }) {
  const labels = history
    .slice()
    .reverse()
    .map((h) => new Date(h.datetime).toLocaleString());

  const dataValues = history
    .slice()
    .reverse()
    .map((h) => h.I);

  const pointColors = history
    .slice()
    .reverse()
    .map((h) => colorByClass(h.classCode));

  const data = {
    labels,
    datasets: [
      {
        label: "I",
        data: dataValues,
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.25,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: pointColors,
        pointBorderWidth: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const idx = ctx.dataIndex;
            const item = history[history.length - 1 - idx];
            const cls = t(lang, `class_${item.classCode || "good"}`);
            return `I=${ctx.parsed.y}; ${cls}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "I",
        },
      },
    },
  };

  return (
    <div className="airindex-chart">
      <Line data={data} options={options} />
    </div>
  );
}