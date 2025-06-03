import { createContext, useState } from "react";


export const DataContext= createContext();



export const DataProvider = ({children}) => {

    const [numConvocatoria, setNumConvocatoria]=useState(0);
    const [dataValue, setDataValue]=useState(false);
    const [rolFacultad, setRolFacultad]= useState({id:"cargando...",correo:"cargando...",facultad:"cargando..."});
    const [anio, setAnio]= useState(2025);
    const [cursosSeleccionados, setCursosSeleccionados]= useState([]);

  return (
    <DataContext.Provider value={{
        numConvocatoria, setNumConvocatoria,
        dataValue, setDataValue,
        rolFacultad, setRolFacultad,
        anio, setAnio,
        cursosSeleccionados, setCursosSeleccionados,
    }}>
        {children}
    </DataContext.Provider>
  )
}