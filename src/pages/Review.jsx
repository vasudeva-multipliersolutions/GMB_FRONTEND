import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import manipalLogo from '../assets/Logos/manipalLogo.png'
import careLogo from '../assets/Logos/careLogo.png'
import { SharedContext } from '../context/SharedContext'
import ReviewManagement from '../components/ReviewManagement'

export default function Review() {
    const username1 = localStorage.getItem('username')
    const logo = username1 == 'Manipal' ? manipalLogo : careLogo;
    const [getDrName, setDrName] = useState('')    
    return (
        <>
            <SharedContext.Provider value={{getDrName, setDrName}}>
                <Navbar logoimg={logo} username={username1} serach={false} bkupload={false}></Navbar>
                <ReviewManagement></ReviewManagement>
            </SharedContext.Provider>
        </>
  )
}

