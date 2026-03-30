import React from 'react';
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChart = ({ data, dataKey, xAxisKey, stroke = '#EF4444', strokeWidth = 2 }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={strokeWidth} />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;