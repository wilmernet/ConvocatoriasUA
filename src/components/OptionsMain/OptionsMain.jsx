import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PrintIcon from '@mui/icons-material/Print';

import React, { useState, useContext } from 'react';
import CallForm from '../CallForm/CallForm';
import { DataContext } from '../../context/DataContext';

import "./OptionsMain.css"

const viewsMode= React.createContext();


const OptionsMain = () => {

    const { dataValue, setDataValue, anio, setAnio, rolFacultad }=useContext(DataContext);
    console.log(dataValue);
    

    const handleClick = () => {
        // setShowForm(!showCallForm); 
        // console.log(views);
               
    };


    const viewMain = () => {
        return (
            <div style={{ height:"100vh", maxWidth:"100vw", display:"flex", justifyContent:"center"}}>
            <div className="optionsMain" style={{maxWidth:"60vw"}}>
                    <h1 className='main_font' >Convocatorias Universidad de la Amazonia</h1>
                    <h2 className='main_font'>FACULTAD DE {rolFacultad.facultad}</h2>
                    <h2 className='main_font'>{anio}</h2>
                    <p className='main_font main_description'>Esta aplicación permite la administración de las Convocatorias publicadas por parte de las
                        Facultades de la Universidad de la Amazonia para los Concursos públicos abiertos y de méritos
                        del personal docente.
                    </p>      
                    

                    <p id='about-me'>
                        Desarrollado por:<br/> Wilmer Arley Patiño Perdomo - Emmy Johanna Cruz Trujillo - Parcival Peña Torres <br />Docentes de la Universidad de la Amazonia
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* {temsContext ? <CallForm /> :viewMain()} */}
            {viewMain()}
             {/* <CallForm />  */}
        </div>
    );
}

export default OptionsMain;