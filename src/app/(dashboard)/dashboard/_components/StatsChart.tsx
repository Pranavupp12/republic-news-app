'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface StatsChartProps {
  totalArticles: number;
  featuredCount: number;
  trendingCount: number;
}

const COLORS = ['#8884d8', '#ffc658', '#82ca9d']; // Purple (Featured), Yellow (Trending), Green (Regular)

export function StatsChart({ totalArticles, featuredCount, trendingCount }: StatsChartProps) {
  const regularArticles = totalArticles - featuredCount - trendingCount;
  
  const allData = [
    { name: 'Featured', value: featuredCount },
    { name: 'Trending', value: trendingCount },
    { name: 'Regular', value: regularArticles },
  ];

  // THE FIX 1: Filter out any categories with a value of 0 to prevent rendering issues.
  const data = allData.filter(entry => entry.value > 0);

  return (
    <div className="relative" style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            //  Shift the chart's vertical center up from 50% to 40%
            cy="40%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={(props: any) => `${props.name}: ${props.value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm font-medium">Total Articles: <span className="font-bold text-lg">{totalArticles}</span></p>
      </div>
    </div>
  );
}