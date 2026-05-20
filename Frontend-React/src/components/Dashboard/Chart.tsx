import { Card, CardContent, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

interface ChartProps {
  data: {
    sales: number[];
    revenue: number[];
    profit: number[];
  };
  labels: string[];
}

export default function Chart({ data, labels }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw Y-axis labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "12px sans-serif";
    for (let i = 0; i <= 10; i++) {
      const y = height - padding - (i / 10) * chartHeight;
      ctx.fillText(`${i * 10}`, padding - 30, y + 3);
      ctx.beginPath();
      ctx.strokeStyle = "#f3f4f6";
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw X-axis labels
    const step = chartWidth / (labels.length - 1);
    labels.forEach((label, i) => {
      const x = padding + i * step;
      ctx.fillStyle = "#6b7280";
      ctx.fillText(label, x - 10, height - padding + 20);
    });

    // Draw lines
    const datasets = [
      { data: data.sales, color: "#ef4444", name: "Sales" },
      { data: data.revenue, color: "#3b82f6", name: "Revenue" },
      { data: data.profit, color: "#10b981", name: "Profit" },
    ];

    datasets.forEach((dataset) => {
      const maxValue = 100;
      ctx.beginPath();
      dataset.data.forEach((value, i) => {
        const x = padding + i * step;
        const y = height - padding - (value / maxValue) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw points
      dataset.data.forEach((value, i) => {
        const x = padding + i * step;
        const y = height - padding - (value / maxValue) * chartHeight;
        ctx.beginPath();
        ctx.fillStyle = dataset.color;
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    });

    // Draw legend
    const legendX = width - 150;
    let legendY = 30;
    datasets.forEach((dataset) => {
      ctx.fillStyle = dataset.color;
      ctx.fillRect(legendX, legendY, 12, 12);
      ctx.fillStyle = "#374151";
      ctx.fillText(dataset.name, legendX + 20, legendY + 10);
      legendY += 25;
    });
  }, [data, labels]);

  return (
    <Card sx={{ borderRadius: "12px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)", border: "1px solid #f3f4f6" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "semibold", color: "#020339", mb: 2 }}>
          Chart
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
          Title: $1250
        </Typography>
        <canvas ref={canvasRef} width={800} height={400} style={{ width: "100%", height: "auto" }}></canvas>
      </CardContent>
    </Card>
  );
}