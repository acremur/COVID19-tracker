import React from 'react'
import numeral from 'numeral'
import { Circle, Popup } from 'react-leaflet'

const casesTypeColors = {
    cases: {
         hex: "#40F6FF",
        rgb: "rgb(64, 246, 255)",
        half_op: "rgba(64, 246, 255, 0.5)",
        totalMultiplier: 300,
        dayMultiplier: 2000
    },
    recovered: {
        hex: "#adff2f",
        rgb: "rgb(173, 255, 47)",
        half_op: "rgba(173, 255, 47, 0.5)",
        totalMultiplier: 500,
        dayMultiplier: 6000
    },
    deaths: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
        totalMultiplier: 1500,
        dayMultiplier: 30000
    },
};

export const sortData = (data, casesType, today) => {
    const sortedData = [...data]

    if (today) {
        if (casesType === 'cases') return sortedData.sort((a, b) => a.todayCases > b.todayCases ? -1 : 1)
        else if (casesType === 'recovered') return sortedData.sort((a, b) => a.todayRecovered > b.todayRecovered ? -1 : 1)
        else return sortedData.sort((a, b) => a.todayDeaths > b.todayDeaths ? -1 : 1)
    } else {
        if (casesType === 'cases') return sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1)
        else if (casesType === 'recovered') return sortedData.sort((a, b) => a.recovered > b.recovered ? -1 : 1)
        else return sortedData.sort((a, b) => a.deaths > b.deaths ? -1 : 1)
    }
} 

// DRAW circles on the map with interactive tooltop
export const showDataOnMap = (data, casesType, today) => (
    data.map((country, index) => (
        <Circle
            key={index}
            center={[country.countryInfo.lat, country.countryInfo.long]}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            fillOpacity={0.4}
            radius={today ? (
                Math.sqrt(country[`today${casesType.charAt(0).toUpperCase() + casesType.slice(1)}`]) * casesTypeColors[casesType].dayMultiplier
            ) : (
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].totalMultiplier
            )}
        >
            <Popup>
                <div className='info-container'>
                    <div 
                        style={{ backgroundImage: `url(${country.countryInfo.flag})` }} 
                        className='info-flag'
                    />
                    <div className='info-name'>{country.country}</div>
                    <div className='info-confirmed'>Cases: {today ? numeral(country.todayCases).format('0,0') : numeral(country.cases).format('0,0')}</div>
                    <div className='info-recovered'>Recovered: {today ? numeral(country.todayRecovered).format('0,0') : numeral(country.recovered).format('0,0')}</div>
                    <div className='info-deaths'>Deaths: {today ? numeral(country.todayDeaths).format('0,0') : numeral(country.deaths).format('0,0')}</div>                    
                </div>
            </Popup>
        </Circle>
    ))
)

export const prettyPrintStat = stat => stat ? `+${numeral(stat).format('0.0a')}` : '0'