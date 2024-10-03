import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import './charts.css';

// Register Chart.js components
Chart.register(...registerables);

const ChartComponent = () => {
    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);
    const [id742Usage, setId742Usage] = useState([]);
    const [id735Usage, setId735Usage] = useState([]);
    const [id742Value, setId742Value] = useState([]);
    const [id735Value, setId735Value] = useState([]);
    const [myChart1, setMyChart1] = useState(null);
    const [myChart2, setMyChart2] = useState(null);

    useEffect(() => {
        fetch('./output.json')
            .then(response => response.json())
            .then(data => {
                const usageData1 = data.ID742.data.map(item => ({ x: item.ts, y: item.usage }));
                const usageData2 = data.ID735.data.map(item => ({ x: item.ts, y: item.usage }));
                const valueData1 = data.ID742.data.map(item => ({ x: item.ts, y: item.value }));
                const valueData2 = data.ID735.data.map(item => ({ x: item.ts, y: item.value }));

                setId742Usage(usageData1);
                setId735Usage(usageData2);
                setId742Value(valueData1);
                setId735Value(valueData2);

                initChart1(usageData1, usageData2);
                initChart2(valueData1, valueData2);
            })
            .catch(error => console.error('Error fetching JSON:', error));
    }, []);

    // Adding event listener for button pressed state
    Array.from(document.getElementsByClassName("chart-button")).forEach(button => {
        button.addEventListener("click", (event) => {
            Array.from(event.currentTarget.parentNode.children).forEach(buttonFromCurrentChart => {
                buttonFromCurrentChart.classList.remove("pressed");
            });
            event.currentTarget.classList.add("pressed");
        });
    });


    const initChart1 = (usageData1, usageData2) => {
        const data = {
            datasets: [
                {
                    label: 'Verbrauch',
                    data: usageData1,
                    backgroundColor: 'rgba(255, 26, 104, 0.2)',
                    borderColor: 'rgba(255, 26, 104, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Einspeisung',
                    data: usageData2,
                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
                    borderColor: 'rgba(0, 255, 0, 1)',
                    borderWidth: 1
                }
            ]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                scales: {
                    x: { type: 'time', time: { unit: 'year' } },
                    y: { min: 0, max: 350 }
                }
            }
        };

        const chart1 = new Chart(chartRef1.current, config);
        setMyChart1(chart1);
    };

    const initChart2 = (valueData1, valueData2) => {
        const data = {
            datasets: [
                {
                    label: 'Zählerstand Verbrauch',
                    data: valueData1,
                    backgroundColor: 'rgba(26, 99, 255, 0.2)',
                    borderColor: 'rgba(26, 99, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Zählerstand Einspeisung',
                    data: valueData2,
                    backgroundColor: 'rgba(26, 221, 255, 0.2)',
                    borderColor: 'rgba(26, 221, 255, 1)',
                    borderWidth: 1
                }
            ]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                scales: {
                    x: { type: 'time', time: { unit: 'year' } },
                    y: { min: 0, max: 100000 }
                }
            }
        };

        const chart2 = new Chart(chartRef2.current, config);
        setMyChart2(chart2);
    };

    const dateFilter = (unit, targetChart) => {
        const target = targetChart === 1 ? myChart1 : myChart2;
        const newestDate = targetChart === 1 ? getNewestDate(id742Usage) : getNewestDate(id742Value);

        if (unit === "hour") {
            const prevHour = new Date(newestDate.getTime());
            prevHour.setHours(prevHour.getHours() - 1);
            target.config.options.scales.x.time.unit = "minute";
            target.config.options.scales.x.min = prevHour;
            target.config.options.scales.x.max = newestDate;
        } else if (unit === "day") {
            const yesterday = new Date(newestDate.getTime());
            yesterday.setDate(yesterday.getDate() - 1);
            target.config.options.scales.x.time.unit = "hour";
            target.config.options.scales.x.min = yesterday;
            target.config.options.scales.x.max = newestDate;
        } else if (unit === "month") {
            const lastMonth = new Date(newestDate.getTime());
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            target.config.options.scales.x.time.unit = "day";
            target.config.options.scales.x.min = lastMonth;
            target.config.options.scales.x.max = newestDate;
        } else if (unit === "year") {
            const lastYear = new Date(newestDate.getTime());
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            target.config.options.scales.x.time.unit = "year";
            target.config.options.scales.x.min = lastYear;
            target.config.options.scales.x.max = newestDate;
        } else if (unit === "max") {
            target.config.options.scales.x.time.unit = "year";
            target.config.options.scales.x.min = undefined;
            target.config.options.scales.x.max = undefined;
        }

        target.update();
    };

    const getNewestDate = (data) => {
        return data.reduce((latest, item) => (new Date(item.x) > latest ? new Date(item.x) : latest), new Date(0));
    };

    return (
        <div className='chart-container'>
            <div className="chartCard">
                <div className="chartBox">
                    <canvas ref={chartRef1}></canvas>
                    <div className='button-container'>
                        <div className='button-wrapper'>
                            {["hour", "day", "month", "year", "max"].map((unit, index) => (
                                <button
                                    key={unit}
                                    className={`chart-button ${index === 2 ? 'pressed' : ''}`}
                                    onClick={() => dateFilter(unit, 1)}
                                >
                                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="chartCard">
                <div className="chartBox">
                    <canvas ref={chartRef2}></canvas>
                    <div className='button-container'>
                        <div className='button-wrapper'>
                            {["hour", "day", "month", "year", "max"].map((unit, index) => (
                                <button
                                    key={unit}
                                    className={`chart-button ${index === 2 ? 'pressed' : ''}`}
                                    onClick={() => dateFilter(unit, 2)}
                                >
                                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartComponent;
