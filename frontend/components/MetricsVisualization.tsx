"use client";

import React, { useEffect, useState } from "react";

interface Metrics {
  impact: number;
  brevity: number;
  style: number;
  skills: number;
}

interface MetricsVisualizationProps {
  metrics: Metrics;
  overallScore: number;
}

export function MetricsVisualization({ metrics, overallScore }: MetricsVisualizationProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedMetrics, setAnimatedMetrics] = useState<Metrics>({
    impact: 0,
    brevity: 0,
    style: 0,
    skills: 0,
  });

  useEffect(() => {
    // Trigger smooth count-up animations on mount
    const scoreTimer = setTimeout(() => setAnimatedScore(overallScore), 100);
    const metricsTimer = setTimeout(() => setAnimatedMetrics(metrics), 300);

    return () => {
      clearTimeout(scoreTimer);
      clearTimeout(metricsTimer);
    };
  }, [metrics, overallScore]);

  // Overall Score Circular Gauge Calculation
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Radar Chart Calculations (Centered at 120, 120 within a 240x240 viewbox)
  const cx = 120;
  const cy = 120;
  const rMax = 80;

  // Axis coordinates mapping: Top (Style), Right (Skills), Bottom (Brevity), Left (Impact)
  const getCoordinates = (m: Metrics) => {
    return {
      top: { x: cx, y: cy - (m.style / 100) * rMax },
      right: { x: cx + (m.skills / 100) * rMax, y: cy },
      bottom: { x: cx, y: cy + (m.brevity / 100) * rMax },
      left: { x: cx - (m.impact / 100) * rMax, y: cy },
    };
  };

  const coords = getCoordinates(animatedMetrics);
  const pointsString = `${coords.top.x},${coords.top.y} ${coords.right.x},${coords.right.y} ${coords.bottom.x},${coords.bottom.y} ${coords.left.x},${coords.left.y}`;

  // Grid Concentric Diamonds
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-around gap-8 p-6 md:p-8 bg-white border border-gray-200/80 rounded-xl shadow-sm">
      
      {/* 1. Overall Match Gauge */}
      <div className="flex flex-col items-center text-center">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Overall Fitness</h4>
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* SVG circle track */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-gray-100"
              strokeWidth="8"
              fill="transparent"
            />
            {/* SVG circle progress */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-heading font-black text-gray-900 leading-none">
              {animatedScore}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
              Score
            </span>
          </div>
        </div>
        <p className="text-[12px] font-medium text-gray-500 mt-4 max-w-[200px]">
          Target score is 75+ for general ATS suitability.
        </p>
      </div>

      {/* Vertical divider */}
      <div className="hidden lg:block w-px h-36 bg-gray-100"></div>

      {/* 2. SVG Radar Chart */}
      <div className="flex flex-col items-center">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Competency Breakdown</h4>
        <div className="relative w-[280px] h-[260px] flex items-center justify-center">
          <svg width="270" height="250" className="overflow-visible">
            {/* Grid concentric levels */}
            {gridLevels.map((level, idx) => {
              const r = rMax * level;
              return (
                <polygon
                  key={idx}
                  points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
                  fill="transparent"
                  stroke={idx === gridLevels.length - 1 ? "#e5e7eb" : "#f3f4f6"}
                  strokeWidth={idx === gridLevels.length - 1 ? "1.5" : "1"}
                  strokeDasharray={idx !== gridLevels.length - 1 ? "3 3" : undefined}
                />
              );
            })}

            {/* Grid Axis Lines */}
            <line x1={cx} y1={cy - rMax} x2={cx} y2={cy + rMax} stroke="#f3f4f6" strokeWidth="1" />
            <line x1={cx - rMax} y1={cy} x2={cx + rMax} y2={cy} stroke="#f3f4f6" strokeWidth="1" />

            {/* Score Polygon Fill */}
            <polygon
              points={pointsString}
              fill="url(#radarGradient)"
              fillOpacity="0.15"
              stroke="#111827"
              strokeWidth="2"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="100%" stopColor="#6b7280" />
              </linearGradient>
            </defs>

            {/* Points (Circles) */}
            <circle cx={coords.top.x} cy={coords.top.y} r="4" fill="#111827" className="transition-all duration-1000 ease-out" />
            <circle cx={coords.right.x} cy={coords.right.y} r="4" fill="#111827" className="transition-all duration-1000 ease-out" />
            <circle cx={coords.bottom.x} cy={coords.bottom.y} r="4" fill="#111827" className="transition-all duration-1000 ease-out" />
            <circle cx={coords.left.x} cy={coords.left.y} r="4" fill="#111827" className="transition-all duration-1000 ease-out" />

            {/* Axis Value Indicators */}
            <text x={coords.top.x} y={coords.top.y - 8} textAnchor="middle" className="text-[10px] font-bold text-gray-700">{animatedMetrics.style}</text>
            <text x={coords.right.x + 10} y={coords.right.y + 3} textAnchor="start" className="text-[10px] font-bold text-gray-700">{animatedMetrics.skills}</text>
            <text x={coords.bottom.x} y={coords.bottom.y + 14} textAnchor="middle" className="text-[10px] font-bold text-gray-700">{animatedMetrics.brevity}</text>
            <text x={coords.left.x - 10} y={coords.left.y + 3} textAnchor="end" className="text-[10px] font-bold text-gray-700">{animatedMetrics.impact}</text>

            {/* Labels */}
            <text x={cx} y={cy - rMax - 12} textAnchor="middle" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Style</text>
            <text x={cx + rMax + 14} y={cy + 4} textAnchor="start" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Skills</text>
            <text x={cx} y={cy + rMax + 24} textAnchor="middle" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Brevity</text>
            <text x={cx - rMax - 14} y={cy + 4} textAnchor="end" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Impact</text>
          </svg>
        </div>
      </div>
      
    </div>
  );
}
