import React, { useState, useContext, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import { DataContext } from "../../context/DataContext";
import './SearchAndSelect.css';

import db from "../../Firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const SearchAndSelect = ({ data }) => {

    const { rolFacultad, cursosSeleccionados, setCursosSeleccionados } = useContext(DataContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [cities, setCities] = useState([]);
    // const [citieSelected, setCitieSelected] = useState("Ciudad1");

    useEffect(() => {
        const downCities = async () => {
            let facultad = rolFacultad.id;
            if (facultad === '') return;
            const docRef = doc(db, "usuarioXfacultad", facultad);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCities(docSnap.data().ciudades)
            } else {
                setCities([]);
            }
        }
        downCities();        

    }, []);

    useEffect(() => {
        setSelectedItems([...cursosSeleccionados]);
    }, [cursosSeleccionados])

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelect = (value) => {
        console.log(value);

        setSelectedItems([...selectedItems, value]);
        setCursosSeleccionados([...selectedItems, value]);
    };

    const handleDeselect = (value) => {
        setSelectedItems(selectedItems.filter((item) => item !== value));
    };

    const filteredData = data.filter((item) => {
        return (
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toString().includes(searchTerm) ||
            item.intensidad.toString().includes(searchTerm)
        );
    });

    const handleCiudadChange = (index, nuevaCiudad) => {
        const nuevosCursos = [...selectedItems]; // copiar el array
        nuevosCursos[index] = {
            ...nuevosCursos[index],
            ciudad: nuevaCiudad, // actualizar ciudad
        };
        setSelectedItems(nuevosCursos); // actualizar el estado
        setCursosSeleccionados(nuevosCursos); // actualizar el estado
    };

    return (
        <div className='Container'>
            <TextField
                label="Filtrar Cursos Ofertados"
                value={searchTerm}
                fullWidth
                onChange={handleSearch}
            />
            <List sx={{ border: "solid", borderRadius: "6px", borderColor: "#c8c8c8", borderWidth: "1px", overflowY: "scroll", height: "200px", marginTop: "10px" }}>
                {filteredData.map((item) => (
                    <ListItem key={item.id} button>
                        <Checkbox
                            checked={selectedItems.includes(item)}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    handleSelect(item);
                                } else {
                                    handleDeselect(item);
                                }
                                setSearchTerm("")
                            }}
                        />
                        <ListItemText primary={item.nombre}
                            secondary={`Código: ${item.id}, Intensidad: ${item.intensidad} horas`} />
                    </ListItem>
                ))}
            </List>
            {/* Lista de elementos seleccionados */}
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Cursos Seleccionados:
            </Typography>
            <ul>
                {selectedItems.map((item, index) => (
                    <div key={item.id}><li className='ListadoSeleccionados'>
                        <div><span style={{ fontWeight: "bold", textDecoration: "true" }}>{item.nombre}</span>, Código: {item.id}, Intensidad: {item.intensidad} horas </div>
                        <FormControl fullWidth sx={{ margin: "10px", width: "30%" }}>
                            <InputLabel required id="demo-simple-select-label2">Ciudad</InputLabel>
                            <Select
                                labelId="demo-simple-select-label2"
                                id="demo-simple-select2"
                                value={item.ciudad || cities[0] || ""}
                                label="Ciudad"
                                // onChange={handleChangeCity}
                                onChange={(e) => handleCiudadChange(index, e.target.value)}
                            >
                                {cities.length > 0 ? cities.map((item) => {
                                    return (<MenuItem value={item} key={item}>{item}</MenuItem>)
                                }) : <p>Cargando ciudades</p>}
                            </Select>
                        </FormControl>
                        <Button onClick={() => {
                            const array = selectedItems.filter((element) => element !== item);
                            setSelectedItems(array);
                            setCursosSeleccionados(array);

                        }} ><DeleteForeverIcon /> Borrar</Button>
                    </li>
                        <hr />
                    </div>
                ))}
            </ul>
        </div>
    );
}


export default SearchAndSelect;