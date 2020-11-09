import React, { useState, useEffect } from 'react'
import './LineGraph.css'
import { Line } from 'react-chartjs-2'
import links from './data.json'
import numeral from 'numeral'

const options = {
    legend: {
        display: false
    },
    elements: {
        point: {
            radius: 0
        }
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format('+0,0')
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: 'time',
                time: {
                    format: 'MM/DD/YY',
                    tooltipFormat: 'll'
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return numeral(value).format('0a')
                    }
                }
            }
        ]
    }
}

function LineGraph({ casesType='cases', country }) {

    const [data, setData] = useState({})
    const [graphColor, setGraphColor] = useState('204, 16, 52')

    useEffect(() => {
        const fetchData = async () => {
            const url = country === undefined ? links.last : `https://disease.sh/v3/covid-19/historical/${country}?lastdays=120`
            await fetch(url)
                .then(res => res.json())
                .then(data => {
                    const chartData = buildChartData(data, casesType)
                    setData(chartData)
                })
        }
        fetchData()
    }, [casesType, country])

    useEffect(() => {
        if (casesType === 'cases') {
            setGraphColor('64, 246, 255')
        } else if (casesType === 'recovered') {
            setGraphColor('173, 255, 47')
        } else {
            setGraphColor('204, 16, 52')
        }
    }, [casesType])

    const buildChartData = (data, casesType) => {
        const chartData = []
        let lastDataPoint
        if (country === undefined) {
            for (let date in data[casesType]) {
                if (lastDataPoint) {
                    const newDataPoint = {
                        x: date,
                        y: data[casesType][date] - lastDataPoint
                    }
                    chartData.push(newDataPoint)
                } 
                lastDataPoint = data[casesType][date]
            }
        } else {
            for (let date in data.timeline[casesType]) {
                if (lastDataPoint) {
                    const newDataPoint = {
                        x: date,
                        y: data.timeline[casesType][date] - lastDataPoint
                    }
                    chartData.push(newDataPoint)
                } 
                lastDataPoint = data.timeline[casesType][date]
            }
        }
        
        return chartData
    }

    return (
        <div className='lineGraph'>
            {data?.length > 0 && (
                <Line data={{
                    datasets: [{
                        backgroundColor: `rgba(${graphColor}, 0.7)`,
                        borderColor: `rgb(${0})`,
                        data: data
                    }]
                }} options={options} />
            )}
        </div>
    )
}

export default LineGraph