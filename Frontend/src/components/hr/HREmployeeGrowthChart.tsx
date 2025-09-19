import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface EmployeeGrowthChartProps {
  data: {
    months: string[];
    employeeCounts: number[];
  };
}

const EmployeeGrowthChart: React.FC<EmployeeGrowthChartProps> = ({ data }) => {
  const chartData = {
    labels: data.months,
    datasets: [
      {
        label: 'Total Employees',
        data: data.employeeCounts,
        backgroundColor: 'rgba(30, 58, 138, 0.8)',
        borderColor: 'rgba(30, 58, 138, 1)',
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
        text: 'Employee Growth Trend',
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
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
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

export default EmployeeGrowthChart;