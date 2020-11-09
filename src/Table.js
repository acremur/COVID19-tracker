import React from 'react'
import './Table.css'
import numeral from 'numeral'

function Table({ countries, casesType, today }) {

    const getTableData = country => {
        const { cases, todayCases, deaths, todayDeaths, recovered, todayRecovered } = country
        let tableData = null

        if (today) {
            if (casesType === 'cases') {
                tableData = todayCases
            } else if (casesType === 'recovered') {
                tableData = todayRecovered
            } else {
                tableData = todayDeaths
            }
        } else {
            if (casesType === 'cases') {
                tableData = cases
            } else if (casesType === 'recovered') {
                tableData = recovered
            } else {
                tableData = deaths
            }
        }
        return tableData
    }
    
    return (
        <div className='table'>
            {countries.map((country, index) => (
                <tr key={index}>
                    <td>{country.country}</td>
                    <td><strong>{numeral(getTableData(country)).format("0,0")}</strong></td>
                </tr>
            ))}
        </div>
    )
}

export default Table