import React from 'react'
import './InfoBox.css'
import { Card, CardContent, Typography } from '@material-ui/core'

function InfoBox({ title, cases, casesType, active, total, ...props }) {
    return (
        <Card 
            onClick={props.onClick} 
            className={`infoBox
                ${casesType === 'cases' && active && 'infoBox--cases'}
                ${casesType === 'recovered' && active && 'infoBox--recovered'}
                ${casesType === 'deaths' && active && 'infoBox--deaths'}`
            } 
        >
            <CardContent>
                <Typography className='infoBox__title' color='textSecondary'>
                    {title}
                </Typography>

                <h2 className={`infoBox__cases ${casesType === 'cases' && active && 'infoBox__cases--cases'}
                    ${casesType === 'recovered' && active && 'infoBox__cases--recovered'}
                    ${casesType === 'deaths' && active && 'infoBox__cases--deaths'}`}>{cases}</h2>

                <Typography className='infoBox__total' color='textSecondary'>
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox