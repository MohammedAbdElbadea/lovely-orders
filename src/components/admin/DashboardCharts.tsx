"use client";

import { useState } from "react";
import { TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export interface MonthlyRevenuePoint {
  month: string;
  revenue: number;
}

export interface OrderStatusPoint {
  statusLabel: string;
  count: number;
  color: string;
}

interface DashboardChartsProps {
  revenueTrend: MonthlyRevenuePoint[];
  orderBreakdown: OrderStatusPoint[];
}

export function DashboardCharts({
  revenueTrend,
  orderBreakdown,
}: DashboardChartsProps) {
  const [hoveredPoint, setHoveredPoint] = useState<MonthlyRevenuePoint | null>(
    null
  );

  const maxRevenue = Math.max(...revenueTrend.map((d) => d.revenue), 1000);
  const totalOrders = orderBreakdown.reduce((sum, b) => sum + b.count, 0);

  // SVG dimensions
  const width = 500;
  const height = 180;
  const padding = 30;

  const points = revenueTrend.map((d, index) => {
    const x =
      padding +
      (index / Math.max(revenueTrend.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - (d.revenue / maxRevenue) * (height - padding * 2);
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1]?.x ?? width} ${
    height - padding
  } L ${points[0]?.x ?? padding} ${height - padding} Z`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Revenue Area Curve Chart */}
      <Card className="border-luxury-border/30 bg-surface-elevated/40 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-bold text-luxury-white">
              Revenue Trend (اتجاه الإيرادات)
            </CardTitle>
            <p className="text-xs text-luxury-muted">متابعة الأرباح الشهرية المؤكدة</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-tint text-gold">
            <TrendingUp className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative pt-2">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full overflow-visible"
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.33, 0.66, 1].map((ratio, i) => (
                <line
                  key={i}
                  x1={padding}
                  y1={padding + ratio * (height - padding * 2)}
                  x2={width - padding}
                  y2={padding + ratio * (height - padding * 2)}
                  stroke="#333"
                  strokeDasharray="4 4"
                  strokeWidth="0.5"
                />
              ))}

              {/* Area Fill */}
              <path d={areaD} fill="url(#revenueGradient)" />

              {/* Smooth Curve */}
              <path
                d={pathD}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Data Dots */}
              {points.map((pt, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#121212"
                    stroke="#D4AF37"
                    strokeWidth="2.5"
                    className="transition-all group-hover:r-7 group-hover:fill-gold"
                    onMouseEnter={() => setHoveredPoint(pt.data)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <text
                    x={pt.x}
                    y={height - 8}
                    textAnchor="middle"
                    fill="#888"
                    fontSize="10"
                    className="font-mono"
                  >
                    {pt.data.month}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip display */}
            <div className="mt-2 flex h-6 items-center justify-between border-t border-luxury-border/20 pt-2 text-xs">
              <span className="text-luxury-muted">
                {hoveredPoint
                  ? `شهر ${hoveredPoint.month}`
                  : "ضع المؤشر على النقاط للتفاصيل"}
              </span>
              <span className="font-mono font-bold text-gold">
                {hoveredPoint
                  ? formatPrice(hoveredPoint.revenue)
                  : formatPrice(
                      revenueTrend[revenueTrend.length - 1]?.revenue ?? 0
                    )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Breakdown Bar Chart */}
      <Card className="border-luxury-border/30 bg-surface-elevated/40 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-bold text-luxury-white">
              Orders Status (توزيع حالات الطلبات)
            </CardTitle>
            <p className="text-xs text-luxury-muted">إجمالي {totalOrders} طلب</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-tint text-gold">
            <BarChart3 className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 pt-2">
            {orderBreakdown.map((item, i) => {
              const percentage =
                totalOrders > 0
                  ? Math.round((item.count / totalOrders) * 100)
                  : 0;

              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-luxury-white">
                      {item.statusLabel}
                    </span>
                    <span className="font-mono text-luxury-muted">
                      {item.count} طلب ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
