import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AttendanceChartProps {
  data: {
    months: string[];
    attendanceRates: number[];
  };
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  const chartData = {
    labels: data.months,
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: data.attendanceRates,
        backgroundColor: 'rgba(250, 204, 21, 0.8)',
        borderColor: 'rgba(250, 204, 21, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
      title: {
        display: true,
        text: 'Monthly Attendance Rate',
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 16,
          weight: '600',
        },
        padding: 20,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
          },
          callback: function(value) {
            return value + '%';
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AttendanceChart;