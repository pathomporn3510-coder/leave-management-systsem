"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { name: "ม.ค.", total: 1.0 },
  { name: "ก.พ.", total: 0 },
  { name: "มี.ค.", total: 2.0 },
  { name: "เม.ย.", total: 4.0 },
  { name: "พ.ค.", total: 0 },
  { name: "มิ.ย.", total: 3.0 },
  { name: "ก.ค.", total: 1.0 },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value.toFixed(1)}`}
          domain={[0, 4]}
          ticks={[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0]}
        />
        <Tooltip cursor={{ fill: 'transparent' }} />
        <Bar
          dataKey="total"
          fill="#00A2D4"
          radius={[0, 0, 0, 0]}
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
