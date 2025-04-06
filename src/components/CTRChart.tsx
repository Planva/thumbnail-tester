import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Thumbnail } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CTRChartProps {
  thumbnails: Thumbnail[];
}

export function CTRChart({ thumbnails }: CTRChartProps) {
  const data = {
    labels: thumbnails.map((_, index) => `Thumbnail ${index + 1}`),
    datasets: [
      {
        label: 'Click-Through Rate (%)',
        data: thumbnails.map(t => t.ctr),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Thumbnail CTR Comparison',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Bar data={data} options={options} />
    </div>
  );
}