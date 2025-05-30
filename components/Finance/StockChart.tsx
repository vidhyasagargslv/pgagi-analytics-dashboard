// src/components/Finance/StockChart.tsx
import React, { useEffect, useRef } from 'react';
import {
    createChart,
    IChartApi,
    ISeriesApi,
    LineData,
    CandlestickData,
    UTCTimestamp,
    DeepPartial,
    TimeChartOptions,
    ColorType,
    LineSeries,
    CandlestickSeries,
} from 'lightweight-charts';
import { ChartDataPoint } from '@/store/services/alphaVantageApi';
import { ChartType } from '@/store/slices/financeSlice';

interface StockChartProps {
    data: ChartDataPoint[];
    chartType: ChartType;
    symbol: string;
}

// Helper to convert your ChartDataPoint to Lightweight Charts format
const formatDataForLightweightCharts = (
    data: ChartDataPoint[],
    type: ChartType
): (LineData | CandlestickData)[] => {
    return data.map(d => {
        const time = d.time as unknown as UTCTimestamp;
        if (type === 'line') {
            return { time, value: d.value ?? 0 };
        }
        return {
            time,
            open: d.open ?? 0,
            high: d.high ?? 0,
            low: d.low ?? 0,
            close: d.close ?? 0,
        };
    });
};

const StockChart: React.FC<StockChartProps> = ({ data, chartType, symbol }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<any> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chartOptions: DeepPartial<TimeChartOptions> = {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            layout: {
                background: { type: ColorType.Solid, color: '#2A303C' },
                textColor: 'rgba(255, 255, 255, 0.9)',
            },
            grid: { 
                vertLines: { color: '#424752' }, 
                horzLines: { color: '#424752' } 
            },
            crosshair: { mode: 0 },
            timeScale: { borderColor: '#424752' },
            rightPriceScale: { borderColor: '#424752', autoScale: true },
        };

        if (!chartRef.current) {
            chartRef.current = createChart(chartContainerRef.current, chartOptions);
        } else {
            chartRef.current.applyOptions(chartOptions);
        }
          const chart = chartRef.current;

        // Remove existing series if any
        if (chart && seriesRef.current !== null && seriesRef.current !== undefined) {
            try {
                chart.removeSeries(seriesRef.current);
            } catch (error) {
                console.warn('Error removing series:', error);
            }
            seriesRef.current = null;
        }
        
        if (data.length === 0) {
            return; 
        }
          // Use the correct lightweight-charts v5 API syntax
        try {
            if (chartType === 'line') {
                const newSeries = chart.addSeries(LineSeries, {
                    color: '#29D6B6',
                    lineWidth: 2,
                });
                const formattedData = formatDataForLightweightCharts(data, 'line') as LineData[];
                newSeries.setData(formattedData);
                seriesRef.current = newSeries;
            } else { // 'candlestick'
                const newSeries = chart.addSeries(CandlestickSeries, {
                    upColor: '#26A69A',
                    downColor: '#EF5350',
                    borderDownColor: '#EF5350',
                    borderUpColor: '#26A69A',
                    wickDownColor: '#EF5350',
                    wickUpColor: '#26A69A',
                });
                const formattedData = formatDataForLightweightCharts(data, 'candlestick') as CandlestickData[];
                newSeries.setData(formattedData);
                seriesRef.current = newSeries;
            }
            
            chart.timeScale().fitContent();
        } catch (error) {
            console.error('Error creating chart series:', error);
            seriesRef.current = null;
        }

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
               chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [data, chartType, symbol]);    useEffect(() => {
        return () => {
            if (chartRef.current) {
                try {
                    chartRef.current.remove();
                } catch (error) {
                    console.warn('Error removing chart:', error);
                }
                chartRef.current = null;
            }
            seriesRef.current = null;
        };
    }, []);

    return <div ref={chartContainerRef} className="w-full h-[400px] rounded-md shadow-inner bg-base-300" />;
};

export default StockChart;