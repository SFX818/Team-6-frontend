import React, { useState, useRef } from 'react'
import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import CheckButton from 'react-validation/build/button'

import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';

//Components
import FormGroup from "./common/FormGroup"

//Helper
import { locationSearch } from '../services/location.services'
import { resMessage } from '../utilities/functions.utilities'
import searchTerm from './Search'

//CSS
// import '../css/SearchForm.css'

const axios = require('axios')
const GOOGLE_API_KEY = 'AIzaSyDbjklIejS9yn5KhRaEWen72vYpBu_0BZo'

//Function given to react-validator
const required = (value) => {
    if(!value){
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        )
    }
}


const SearchForm = (props) => {
    const form = useRef()
    const checkBtn = useRef()

    const [message, setMessage] = useState('')
    const [successful, setSuccessful] = useState(false)
    const [country, setCountry] = useState('')
    const [region, setRegion] = useState('')
    const [city, setCity] = useState('')
   
    

    const onChangeCountry = (val) => {
        console.log(val)
        setCountry(val)
    }

    const onChangeRegion = (val) => {
        console.log(val)
        setRegion(val)
    }

    const onChangeCity = (e) => {
        const city = e.target.value
        console.log(city)
        setCity(city)
    }

    const mapSearch = async (e) => {
        //Prevent reload of pressing the button
        e.preventDefault()
        //Prevent message clear them out
        setMessage("")
        setSuccessful(false)

        // validtes all the fields in your form
        form.current.validateAll()
        
        // Validator stores errors and we can check if errors exist
        
        if(checkBtn.current.context._errors.length === 0) {
            //Google API request
            const apiResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${city},${region}&key=${GOOGLE_API_KEY}`)
            //Parses over API and pulls out "____ County", replace removes county for disease API
            const county = Object.values(apiResponse.data.results[0])[0][1].long_name.replace(/County/g, '')
            locationSearch(country, region, city, county).then(
                (response) => {
                    // console.log("----ggh--", apiResponse)
                    setMessage(response.data.message)
                    setSuccessful(true)
                    console.log("country:", country)
                    console.log("region:", region)
                    console.log("city:", city)
                    console.log("county:", county)



                    
                    // searchTerm(apiResponse.data.results)
                },
                (error) => {
                    setMessage(resMessage(error))
                    setSuccessful(false)
                }
            )

        } else {
            successful(false)
        }


    }


    return(
            <div className="form-container container">
                <Form onSubmit={mapSearch} ref={form} className='container'>
                <div className='input-field'>
                    <CountryDropdown
                        value={country}
                        onChange={(val) => onChangeCountry(val)} />
                </div>
                <div className='input-field'>
                    <RegionDropdown
                        country={country}
                        value={region}
                        onChange={(val) => onChangeRegion(val)} />
                </div>
                <div className='input-field'>
                    <FormGroup text="city">
                        <Input
                            type="text"
                            className="form-control"
                            name="city"
                            value={city}
                            onChange={onChangeCity}
                            validations={[required]}
                        />
                    </FormGroup>
                </div>

                    <div className="form-group">
                        <button className="btn" >
                            <span>Search</span>
                        </button>   
                    </div>

                    {message && (
                        <div className="form-group">
                            <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                                {message}
                            </div>
                        </div>
                    )}

                    <CheckButton style={{display: "none"}} ref={checkBtn}/>
                </Form>
            </div>
    )
}

export default SearchForm