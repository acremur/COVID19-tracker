import React from 'react'
import './Map.css'
import { MapContainer, TileLayer} from 'react-leaflet' 
import { showDataOnMap } from './util'

function Map({ countries, casesType, center, zoom, today }) {
   
    return (
        <div className="map">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {showDataOnMap(countries, casesType, today)}
            </MapContainer>
        </div>
    )
}

export default Map