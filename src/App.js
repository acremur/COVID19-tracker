import React, { useState, useEffect } from 'react'
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core'
import data from './data.json'
import InfoBox from './InfoBox'
import './App.css';
import Map from './Map'
import Table from './Table'
import { sortData } from './util'
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css'
import { prettyPrintStat } from './util'

function App() {

  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState([50, 10])
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')
  const [today, setToday] = useState(false)

  useEffect(() => {
    fetch(data.all)
    .then(res => res.json())
    .then(data => setCountryInfo(data))
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch(data.countries)
        .then(res => res.json())
        .then(data => {
          const countries = data.map(country => (
            {
              id: country.countryInfo._id,
              name: country.country, // USA, India ...
              value: country.countryInfo.iso2 // ES, IT, FR ...
            }
          ))  
          const sortedData = sortData(data, casesType, today)
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries)
          setTableData(sortedData)
        })
    }
    getCountriesData()
  }, [casesType, today])

  const onCountryChange = async e => {
    const countryCode = e.target.value
    
    const url = countryCode === 'worldwide' ? data.all : `${data.countries}/${countryCode}`
    await fetch(url)
    .then(res => res.json())
    .then(data => {
      if (countryCode === 'worldwide') {
        setCountry('worldwide')
        setCountryInfo({})
        setMapCenter([50, 10])
        setMapZoom(3)
      } else {
        setCountry(countryCode)
        setCountryInfo(data)
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
      }
    })
  }
  
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1 onClick={e => setToday(!today)} className='app__title'>COVID-19 {today ? 'TODAY' : 'TOTAL'}</h1>
          <FormControl className='app__dropdown'>
            <Select
              style={{color: "white"}}
              variant='outlined' 
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem style={{color: "white"}} key='worldwide' value='worldwide'>Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem style={{color: "white"}} key={country.id} value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            casesType={casesType}
            active= {casesType === 'cases'}
            onClick={e => setCasesType('cases')} 
            title={'Cases'} 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={countryInfo.cases} 
          />
          <InfoBox
            casesType={casesType}
            active= {casesType === 'recovered'}
            onClick={e => setCasesType('recovered')} 
            title={'Recovered'} 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={countryInfo.recovered} 
          />
          <InfoBox
            casesType={casesType}
            active= {casesType === 'deaths'}
            onClick={e => setCasesType('deaths')} 
            title={'Deaths'} 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={countryInfo.deaths} 
          />
        </div>

        <Map 
          key={Math.random()}
          casesType={casesType} 
          countries={mapCountries} 
          center={mapCenter} 
          zoom={mapZoom} 
          today={today}
        />
      </div>

      <div className="app__right">
        <Card>
          <CardContent>
              <h3  className='app_tableTitle' onClick={e => setToday(!today)}>Live {today ? 'today' : 'total'} {casesType} by country </h3>
            <Table countries={tableData} casesType={casesType} today={today} />
              <h3 style={{color: "whitesmoke"}}>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </CardContent>
        </Card>
      </div>            

    </div>
  );
}

export default App;