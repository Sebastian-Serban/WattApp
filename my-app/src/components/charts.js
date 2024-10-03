import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import './charts.css';

// Register Chart.js components
Chart.register(...registerables);

const ChartComponent = () => {
    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);
    const myChart1 = useRef(null);
    const myChart2 = useRef(null);
    const id742Usage = [];
    const id735Usage = [];
    const id742Value = [];
    const id735Value = [];

    useEffect(() => {
        fetch('http://localhost:4000/data')
            .then(response => response.json())
            .then(data => {
                data.ID742.data.forEach(item => {
                    id742Usage.push({ x: item.ts, y: item.usage });
                });
                data.ID735.data.forEach(item => {
                    id735Usage.push({ x: item.ts, y: item.usage });
                });


                myChart1.current.data.datasets[0].data = id742Usage;
                myChart1.current.data.datasets[1].data = id735Usage;

                dateFilter("month", 1);

                myChart1.current.update();

                data.ID742.data.forEach(item => {
                    id742Value.push({ x: item.ts, y: item.value });
                });
                data.ID735.data.forEach(item => {
                    id735Value.push({ x: item.ts, y: item.value });
                });

                myChart2.current.data.datasets[0].data = id742Value;
                myChart2.current.data.datasets[1].data = id735Value;

                dateFilter("month", 2);

                myChart2.current.update();
            })
            .catch(error => console.error('Error fetching JSON:', error));

        // Initialize the charts
        const data1 = {
            datasets: [{
                label: 'Verbrauch',
                data: [],
                backgroundColor: [
                    'rgba(255, 26, 104, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 26, 104, 1)',
                ],
                borderWidth: 1
            }, {
                label: "Einspeisung",
                data: [],
                backgroundColor: [
                    "rgba(0, 255, 0, 0.2)"
                ],
                borderColor: [
                    'rgba(0, 255, 0, 1)',
                ],
                borderWidth: 1
            }]
        };

        const config1 = {
            type: 'line',
            data: data1,
            options: {
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "year"
                        }
                    },
                    y: {
                        min: 0,
                        max: 350
                    }
                }
            }
        };

        myChart1.current = new Chart(chartRef1.current, config1);

        const data2 = {
            datasets: [{
                label: 'Zählerstand Verbrauch',
                data: [],
                backgroundColor: [
                    'rgba(26,99,255,0.2)'
                ],
                borderColor: [
                    'rgba(26,99,255, 1)',
                ],
                borderWidth: 1
            }, {
                label: 'Zählerstand Einspeisung',
                data: [],
                backgroundColor: [
                    'rgba(26,221,255,0.2)'
                ],
                borderColor: [
                    'rgba(26,221,255, 1)',
                ],
                borderWidth: 1
            }]
        };

        const config2 = {
            type: 'line',
            data: data2,
            options: {
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "year"
                        }
                    },
                    y: {
                        min: 0,
                        max: 100000
                    }
                }
            }
        };

        myChart2.current = new Chart(chartRef2.current, config2);

        // Adding event listener for button pressed state
        Array.from(document.getElementsByClassName("chart-button")).forEach(button => {
            button.addEventListener("click", (event) => {
                Array.from(event.currentTarget.parentNode.children).forEach(buttonFromCurrentChart => {
                    buttonFromCurrentChart.classList.remove("pressed");
                });
                event.currentTarget.classList.add("pressed");
            });
        });

        return () => {
            // Clean up event listeners on unmount
            Array.from(document.getElementsByClassName("chart-button")).forEach(button => {
                button.removeEventListener("click", (event) => {
                    Array.from(event.currentTarget.parentNode.children).forEach(buttonFromCurrentChart => {
                        buttonFromCurrentChart.classList.remove("pressed");
                    });
                    event.currentTarget.classList.add("pressed");
                });
            });
        };
    }, []);

    function getNewestDate(data) {
        let newest = undefined;
        data.forEach(item => {
            const currentDate = new Date(item.x);
            if (newest === undefined || new Date(item.x) > newest) {
                newest = currentDate;
            }
        });
        return newest;
    }

    function dateFilter(unit, targetChart) {
        const newestDate = getNewestDate(targetChart === 1 ? id742Usage : id742Value);
        let target = targetChart === 1 ? myChart1.current : myChart2.current;
        if (! newestDate) {
            return null
        }
        if (unit === "hour") {
            const prevHour = new Date(newestDate.getTime());
            prevHour.setHours(prevHour.getHours() - 1);
            target.config.options.scales.x.time.unit = "minute";
            target.config.options.scales.x.min = prevHour;
            target.config.options.scales.x.max = newestDate;
            target.update();
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
    }

    return (
        <div className='chart-container'>
            <div className="chartCard">
                <div className="chartBox">
                    <canvas ref={chartRef1}></canvas>
                    <div className='button-container'>
                        <div className='button-wrapper'>
                            <button className="chart-button" onClick={() => dateFilter("hour", 1)}>Hour</button>
                            <button className="chart-button" onClick={() => dateFilter("day", 1)}>Day</button>
                            <button className="chart-button pressed" onClick={() => dateFilter("month", 1)}>Month</button>
                            <button className="chart-button" onClick={() => dateFilter("year", 1)}>Year</button>
                            <button className="chart-button" onClick={() => dateFilter("max", 1)}>All time</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chartCard">
                <div className="chartBox">
                    <canvas ref={chartRef2}></canvas>
                    <div className='button-container'>
                        <div className='button-wrapper'>
                            <button className="chart-button" onClick={() => dateFilter("hour", 2)}>Hour</button>
                            <button className="chart-button" onClick={() => dateFilter("day", 2)}>Day</button>
                            <button className="chart-button pressed" onClick={() => dateFilter("month", 2)}>Month</button>
                            <button className="chart-button" onClick={() => dateFilter("year", 2)}>Year</button>
                            <button className="chart-button" onClick={() => dateFilter("max", 2)}>All time</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartComponent;
