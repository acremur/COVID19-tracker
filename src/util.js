import React from 'react'
import numeral from 'numeral'
import { Circle, Popup } from 'react-leaflet'

const casesTypeColors = {
    cases: {
      hex: "#000",
      rgb: "rgb(0, 0, 0)",
      half_op: "rgba(0, 0, 0, 0.5)",
      multiplier: 400,
    },
    recovered: {
      hex: "#adff2f",
      rgb: "rgb(173, 255, 47)",
      half_op: "rgba(173, 255, 47, 0.5)",
      multiplier: 600,
    },
    deaths: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
      multiplier: 2000,
    },
};

export const sortData = data => {
    const sortedData = [...data]

    return sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1)
} 

// DRAW circles on the map with interactive tooltop
export const showDataOnMap = (data, casesType) => (
    data.map((country, index) => (
        <Circle
            key={index}
            center={[country.countryInfo.lat, country.countryInfo.long]}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            fillOpacity={0.4}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <div className='info-container'>
                    <div 
                        style={{ backgroundImage: `url(${country.countryInfo.flag})` }} 
                        className='info-flag'
                    />
                    <div className='info-name'>{country.country}</div>
                    <div className='info-confirmed'>Cases: {numeral(country.case).format('0,0')}</div>
                    <div className='info-recovered'>Recovered: {numeral(country.recovered).format('0,0')}</div>
                    <div className='info-deaths'>Deaths: {numeral(country.deaths).format('0,0')}</div>                    
                </div>
            </Popup>
        </Circle>
    ))
)

export const prettyPrintStat = stat => stat ? `+${numeral(stat).format('0.0a')}` : '0'