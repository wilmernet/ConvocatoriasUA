import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PrintIcon from '@mui/icons-material/Print';
import BackspaceIcon from '@mui/icons-material/Backspace';
// import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import SaveIcon from '@mui/icons-material/Save';
import SectionCard from '../Card/SectionCard';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Divider from '@mui/material/Divider';
import SearchAndSelect from '../SearchAndSelect/SearchAndSelect';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DateField } from '@mui/x-date-pickers/DateField';

import Swal from 'sweetalert2'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

//----- fireBase -------
import db from "../../Firebase/FirebaseConfig";
import { collection, query, where, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import PrintPage from '../PrintPage/PrintPage';

//----------------------
import React, { useState, useEffect, useContext } from "react";
import { DataContext } from '../../context/DataContext';
// import "./CallForm.css";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import TimeDate from "../TimeDate/TimeDate";
// import FormControl from '@mui/material/FormControl';
// import { InputLabel, Input, FormHelperText } from "@mui/material";

import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';

import SchoolIcon from '@mui/icons-material/School';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CampaignIcon from '@mui/icons-material/Campaign';
import DrawIcon from '@mui/icons-material/Draw';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
// import DesignServicesIcon from '@mui/icons-material/DesignServices';

// ---------------------- TABS CONFIG ----------------------

import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import ConstructionIcon from '@mui/icons-material/Construction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// ---------------------- DATE ----------------------
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

import Modal from '@mui/material/Modal';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';


import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { border, display, margin, width } from '@mui/system';


// ---------------------- LISTAS ----------------------
// import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
// import { Logger } from 'html2canvas/dist/types/core/logger';

const label = { inputProps: { 'aria-label': 'Funcionario Encargado' } };

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Editor = ({ numero_Convotatoria }) => {

    const { rolFacultad, dataValue, setDataValue, cursosSeleccionados, setCursosSeleccionados } = useContext(DataContext);
    const [isLoading, setIsLoading] = useState(true);
    const [listRequirement, setListRequirement] = useState([])
    const [verRectorEncargado, setVerRectorEncargado] = useState(false);
    const [verVicerectorEncargado, setVerVicerectorEncargado] = useState(false);
    const [verDecanoEncargado, setVerDecanoEncargado] = useState(false);
    const [textRequisitos, setTextRequisitos] = useState(``);
    const [programa, setPrograma] = React.useState('');
    const [tipoDocente, setTipoDocente] = React.useState('');
    const [fecha_insc_inicio, setFecha_insc_inicio] = React.useState(null);
    const [fecha_insc_fin, setFecha_insc_fin] = React.useState(null);
    const [fecha_prueba, setFecha_prueba] = React.useState(null);
    const [fecha_publicacion, setFecha_publicacion] = React.useState(null);
    const [fecha, setFecha] = React.useState(null);    

    // setFecha_insc_inicio(docSnap.data().insc_inicio); //kkkkkkkkkkkk
    // setFecha_insc_fin(docSnap.data().insc_fin); //kkkkkkkkkkkk
    // setFecha_prueba(docSnap.data().prue_fecha); //kkkkkkkkkkkk
    // setFecha_publicacion(docSnap.data().publ_fecha); //kkkkkkkkkkkk

    const [dbConfig, setDbConfig] = useState({})
    const [open, setOpen] = useState(false);
    const [areas, setAreas] = useState([]);
    const [areaSelected, setAreaSelected] = useState('');
    const [cursos, setCursos] = useState([]);
    // const [cursosSelect, setCursosSelect] = useState([]);

    useEffect(() => {
        setDbConfig({ ...dbConfig, cursos: cursosSeleccionados });
    }, [cursosSeleccionados]);

    useEffect(() => {
        const downData = async () => {
            const docRef = doc(db, "areasXprograma", programa);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setAreas(docSnap.data().areas)
            } else {
                setAreas([]);
            }
        }
        downData();
    }, [programa]);

    useEffect(() => {
        const downData = async () => {
            const q = query(collection(db, "cursos"), where("facultad", "==", rolFacultad.id));
            const querySnapshot = await getDocs(q);
            const cursosEncontrados = [];
            querySnapshot.forEach((doc) => {
                cursosEncontrados.push({ ...doc.data(), id: doc.id });
            });
            setCursos([...cursosEncontrados].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        }
        downData();
    }, []);

    function sumarNdias(fechaInicial, dias) {
        let fechaFinal = fechaInicial;
        let contador = 0;
        while (contador < dias) {
            fechaFinal = fechaFinal.add(1, 'day');
            // Verificar si es fin de semana (sábado o domingo)
            if (fechaFinal.day() !== 0 && fechaFinal.day() !== 6) {
                contador++;
            }
        }
        return fechaFinal;
    }
    function proximoLunes() {
        let fechaActual = dayjs(new Date());
        let diaActual = fechaActual.day();
        let diasQueFaltan = (8 - diaActual) % 7;
        return fechaActual.add(diasQueFaltan, 'day');
    }

    useEffect(() => {
        const downData = async () => {
            // const docRef = doc(db, "convocatorias", "001-2025-ingenieria");
            const docRef = doc(db, "convocatorias", numero_Convotatoria);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setDbConfig({ ...docSnap.data(), facultad: rolFacultad.id });
                setListRequirement(docSnap.data().requisitos_lista);
                setTextRequisitos(docSnap.data().requisitos);
                setTipoDocente(docSnap.data().vinculacion);
                setPrograma(docSnap.data().programa);
                setAreaSelected(docSnap.data().area);
                setCursosSeleccionados([...docSnap.data().cursos]);
                setFecha(dayjs(new Date()));
                const lunes = proximoLunes();
                setFecha_insc_inicio(sumarNdias(dayjs(), 2));
                setFecha_insc_fin(sumarNdias(dayjs(), 6));
                setFecha_prueba(sumarNdias(dayjs(), 11));
                setFecha_publicacion(sumarNdias(dayjs(), 13));
                setIsLoading(false);
            } else {
                console.log("No such document!");
            }
        }
        downData();
    }, []);

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(".........." + dbConfig);
    }

    const handleSaveData = (e) => {
        e.preventDefault();
        let i = 1;
        const camposFaltantes = [];
        if (dbConfig.numero == "") {
            camposFaltantes.push(`${i++}) Número de la convocatoria<br/>`);
        }
        if (dbConfig.programa == "") {
            camposFaltantes.push(`${i++}) Programa academico<br/>`);
        }
        if (dbConfig.vinculacion == "") {
            camposFaltantes.push(`${i++}) Tipo de vinculación docente<br/>`);
        }
        if (dbConfig.area == "") {
            camposFaltantes.push(`${i++}) Área convocada<br/>`);
        }
        if (dbConfig.pregrado == "") {
            camposFaltantes.push(`${i++}) Título Profesional del aspirante<br/>`);
        }
        if (dbConfig.posgrado == "") {
            camposFaltantes.push(`${i++}) Título de posgrado del aspirante<br/>`);
        }
        if (dbConfig.conocimientos == "") {
            camposFaltantes.push(`${i++}) Conocimientos específicos del aspirante<br/>`);
        }
        if (dbConfig.expe_docencia == "") {
            camposFaltantes.push(`${i++}) experiencia mínima requerida en docencia<br/>`);
        }
        if (dbConfig.expe_investigacion == "") {
            camposFaltantes.push(`${i++}) experiencia mínima requerida en investigación<br/>`);
        }
        if (dbConfig.expe_profesional == "") {
            camposFaltantes.push(`${i++}) experiencia mínima requerida como profesional<br/>`);
        }
        if (dbConfig.comp_personales == "") {
            camposFaltantes.push(`${i++}) Competencias personales requeridas<br/>`);
        }
        if (dbConfig.comp_comportamentales == "") {
            camposFaltantes.push(`${i++}) Competencias comportamentales requeridas<br/>`);
        }
        if (dbConfig.comp_tecnicas == "") {
            camposFaltantes.push(`${i++}) Competencias técnicas requeridas<br/>`);
        }
        if (dbConfig.comp_tecnicas == "") {
            camposFaltantes.push(`${i++}) Requisitos mínimos para inscripción<br/>`);
        }
        if (dbConfig.insc_lugar == "") {
            camposFaltantes.push(`${i++}) Lugar de inscripción<br/>`);
        }
        if (dbConfig.insc_horario == "") {
            camposFaltantes.push(`${i++}) Horario de inscripción<br/>`);
        }
        if (dbConfig.prue_descripcion == "") {
            camposFaltantes.push(`${i++}) Descripción de la prueba de conocimiento<br/>`);
        }
        if (dbConfig.prue_lugar == "") {
            camposFaltantes.push(`${i++}) Lugar de la prueba de conocimiento<br/>`);
        }
        if (dbConfig.publ_lugar == "") {
            camposFaltantes.push(`${i++}) Lugar de publicación de los resultados de la convocatoria<br/>`);
        }
        if (dbConfig.rector == "") {
            camposFaltantes.push(`${i++}) Rector que firma la convocatoria<br/>`);
        }
        if (dbConfig.vicerector == "") {
            camposFaltantes.push(`${i++}) Vicerector que firma la convocatoria<br/>`);
        }
        if (dbConfig.decano == "") {
            camposFaltantes.push(`${i++}) Decano que firma la convocatoria<br/>`);
        }
        if (camposFaltantes.length == 0) {
            let duplicado = false;
            const upData = async () => {
                await setDoc(doc(db, "convocatorias", numero_Convotatoria), dbConfig);
            }
            upData();
            setDataValue(false);
            setCursosSeleccionados([]);
            Swal.fire({
                // position: "top-end",
                position: "center",
                icon: "success",
                title: "Cambios guardados con éxito",
                showConfirmButton: false,
                timer: 1500
            });            
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                html: `Falta información por diligenciar: <br/><br/> ${camposFaltantes}`,
            });
        }
    }

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleActivarEncargoRector = () => {
        setVerRectorEncargado(!verRectorEncargado);
        if (verRectorEncargado == true) {
            setDbConfig({ ...dbConfig, rector_encargado: "" })
        }
    }

    const handleActivarEncargoVicerector = () => {
        setVerVicerectorEncargado(!verVicerectorEncargado);
        if (verVicerectorEncargado == true) {
            setDbConfig({ ...dbConfig, vicerector_encargado: "" })
        }
    }

    const handleActivarEncargoDecano = () => {
        setVerDecanoEncargado(!verDecanoEncargado);
        if (verDecanoEncargado == true) {
            setDbConfig({ ...dbConfig, decano_encargado: "" })
        }
    }

    const handleChangeProgram = (event) => {
        setPrograma(event.target.value);
        setDbConfig({ ...dbConfig, programa: event.target.value });
    }

    const handleChangeTipoDocente = (event) => {
        setTipoDocente(event.target.value);
        setDbConfig({ ...dbConfig, vinculacion: event.target.value });
    }

    const handleChangeAreas = (event) => {
        setAreaSelected(event.target.value);
        setDbConfig({ ...dbConfig, area: event.target.value });
    }

    const handleChangePrimeraVez = (event) => {
        // setAreaSelected(event.target.value);
        setDbConfig({ ...dbConfig, primera_vez: event.target.value });
    }

    const handleCancel = () => {
        setDataValue(false);
        setCursosSeleccionados([]);
    }
    return (
        <div className='callForm'>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
                noValidate
                autoComplete="off"
                onSubmit={handleSaveData}
            // onSubmit={handleSubmit}
            >
                <div className='Superior'>

                    <Typography gutterBottom variant="h5" component="div" sx={{ color: "#1876D1", display: "flex", alignItems: "center" }}>
                        Editando la convocatoria <span style={{ margin: "5px", color: "red", fontWeight: "bold" }}>{dbConfig.numero}</span> del
                        <div sx={{ width: "20px", border: "solid" }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {/* {fecha ? <div style={{margin:"5px", width: "150px", marginRight: "20px" }}>                                    
                                        <DatePicker                                            
                                            defaultValue={fecha}
                                            onChange={(newDate) => {
                                                setFecha(newDate);
                                                setDbConfig({ ...dbConfig, fecha: new Date(newDate) });
                                            }}
                                            format="DD/MM/YYYY"
                                        />
                                    </div> : <p>cargando Fecha</p>
                                    }                                 */}
                                {fecha ? <div style={{ margin: "5px", width: "150px", marginRight: "20px" }}>
                                    <DateField
                                        label="Fecha"
                                        defaultValue={dayjs('2022-04-17')}
                                        format="DD-MM-YYYY"
                                    />
                                </div> : <p>cargando Fecha</p>
                                }
                            </LocalizationProvider>
                        </div>
                    </Typography>
                    <Box
                        component="div"
                        sx={{ '& > :not(style)': { m: 2, width: '10%' } }}
                        noValidate
                        autoComplete="off"
                    >
                        <div style={{ display: "flex", width: "100%" }}>
                            <Stack direction="row" spacing={2}>
                                <Button variant="outlined" startIcon={<BackspaceIcon />} onClick={handleCancel}>
                                    Cancelar
                                </Button>
                                {/* <Button variant="outlined" endIcon={<SaveIcon />} onClick={() => { handleSaveData() }} ss> */}
                                <Button variant="outlined" type='submit' endIcon={<SaveIcon />} onClick={handleSaveData}>
                                    Guardar
                                </Button>
                                <Button variant="outlined" endIcon={<PrintIcon />} onClick={handleOpen}>
                                    Imprimir
                                </Button>
                                <Modal
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="modal-title"
                                        aria-describedby="modal-description"
                                    >
                                        <Box sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: 800,
                                            height: "100vh",
                                            bgcolor: 'background.paper',
                                            border: '2px solid #000',
                                            boxShadow: 24,
                                            p: 4,
                                            overflowY: 'auto',
                                        }}>
                                            {/* <PrintPage data={dbConfig}/> */}
                                            <PrintPage convocatoria={numero_Convotatoria} />
                                            {/* <PrintPage data={{ ...dbConfig }} convocatoria={"CONF-CONVOCATORIA"} /> */}
                                        </Box>
                                    </Modal>
                                
                            </Stack>
                        </div>
                    </Box>
                    <Divider></Divider>
                </div>

                <Box sx={{ width: '100%' }}>
                    {/* <CustomTabPanel value={value} index={0}> */}
                    <span id='inicio'></span>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ m: 0, color: "#1876D1", fontWeight: "3px" }}>
                            Generalidades de la Convocatoria
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Características de la vacante convocada.
                        </Typography>
                        <br />

                        <Box sx={{ width: '100%' }}>
                            {isLoading && <LinearProgress />}
                        </Box>
                        <Box
                            component="section"
                            sx={{ '& > :not(style)': { m: 2, width: '80%' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <FormControl fullWidth>
                                <InputLabel required id="demo-simple-select-label1">Tipo de Docente</InputLabel>
                                {console.log(tipoDocente)}
                                <Select
                                    labelId="demo-simple-select-label1"
                                    id="demo-simple-select1"
                                    value={tipoDocente}
                                    defaultValue={tipoDocente}
                                    label="Tipo de Docente"
                                    onChange={handleChangeTipoDocente}
                                >
                                    <MenuItem value={"Catedrático"}>CATEDRÁTICO</MenuItem>
                                    <MenuItem value={"Ocasional Medio Tiempo"}>OCASIONAL MEDIO TIEMPO</MenuItem>
                                    <MenuItem value={"Ocasional Tiempo Completo"}>OCASIONAL TIEMPO COMPLETO</MenuItem>
                                    <MenuItem value={"Carrera Medio Tiempo"}>CARRERA MEDIO TIEMPO</MenuItem>
                                    <MenuItem value={"Carrera Tiempo Completo"}>CARRERA TIEMPO COMPLETO</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel required id="demo-simple-select-label2">Programa</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label2"
                                    id="demo-simple-select2"
                                    value={programa}
                                    defaultValue={programa}
                                    label="Programa"
                                    onChange={handleChangeProgram}
                                >
                                    {rolFacultad.programas ? rolFacultad.programas.map((item) => {
                                        return (<MenuItem value={item} key={item}>{item.toUpperCase()}</MenuItem>)
                                    }) : <p>Cargando programas</p>}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel required id="demo-simple-select-label3">Area del conocimiento</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label3"
                                    id="demo-simple-select3"
                                    value={areaSelected}
                                    defaultValue={areaSelected}
                                    label="Area del conocimiento"
                                    onChange={handleChangeAreas}
                                >
                                    {areas.map((item) => {
                                        return (<MenuItem value={item} key={item}>{item.toUpperCase()}</MenuItem>)
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ color: 'text.secondary' }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{ margin: "10px" }}>Convocada por:</span>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        // defaultValue="true"                                                                            
                                        name="row-radio-buttons-group"
                                        // defaultValue={"" + dbConfig.primera_vez}
                                        value={"" + dbConfig.primera_vez}
                                        defaultValue="true"
                                        onChange={handleChangePrimeraVez}
                                    >
                                        <FormControlLabel value="true" control={<Radio />} label="Primera vez" />
                                        <FormControlLabel value="false" control={<Radio />} label="Segunda vez" />
                                    </RadioGroup>
                                </div>
                            </FormControl>
                        </Box>
                    </CardContent>
                    {/* </Card> */}
                    {/* </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}> */}
                    {/* <Card sx={{ maxWidth: "100%", height: "500px", overflowY: "auto" }}> */}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ m: 0, color: "#1876D1", fontWeight: "3px" }}>
                            Cursos Convocados
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Listado de cursos ofertados por la facultad.
                        </Typography>
                        <br />
                        <Box sx={{ width: '100%' }}>
                            {isLoading && <LinearProgress />}
                        </Box>
                        <Box
                            component="section"
                            sx={{ '& > :not(style)': { m: 1, width: '80%' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <FormControl sx={{ color: 'text.secondary' }}>
                                <SearchAndSelect data={cursos} />
                            </FormControl>

                            {/* <div style={{marginTop: "20px", width:"80vw", backgroundColor: "red"}}> */}
                            <Divider></Divider>
                            {/* <Typography gutterBottom variant="h5" component="div" sx={{ marginTop: 2, color: "#1876D1", fontWeight: "3px" }}>                                 */}
                            <Typography gutterBottom variant="h5" component="div" sx={{ m: 1, color: "#1876D1", fontWeight: "3px" }}>
                                Labor Complementaria
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Labor complementaria que deberá atender durante el periodo convocado.
                            </Typography>
                            <TextField
                                id="outlined-controlled"
                                label="Labor Complementaria"
                                value={"" + dbConfig.complementaria}
                                disabled={isLoading}
                                multiline
                                onChange={(event) => {
                                    setDbConfig({ ...dbConfig, complementaria: event.target.value });
                                }}
                            />
                            <br />
                            <br />
                        </Box>
                    </CardContent>
                    {/* </Card> */}
                    {/* </CustomTabPanel> */}
                    {/* <CustomTabPanel value={value} index={2}> */}
                    {/* <Card sx={{ maxWidth: "100%", height: "500px", overflowY: "auto" }}> */}
                    <CardContent >

                        {/* XXXXXXXXXXXXXXXXXXXXX */}
                        <Typography gutterBottom variant="h5" component="div" sx={{ m: 0, color: "#1876D1", fontWeight: "3px" }}>
                            Formación Profesional
                        </Typography>
                        <Typography className='PanelTest2' variant="body2" sx={{ color: 'text.secondary', marginBottom: 1 }}>
                            Títulos y conocimientos necesarios para ejercer como docente en las áreas convocadas.
                        </Typography>

                        <Box sx={{ width: '100%' }}>
                            {isLoading && <LinearProgress />}
                        </Box>
                        <Box
                            component="section"
                            sx={{ '& > :not(style)': { paddingTop: 0, m: 1, width: '80%' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                required
                                id="outlined-controlled"
                                label="Título de Pregrado"
                                value={"" + dbConfig.pregrado}
                                disabled={isLoading}
                                multiline
                                onChange={(event) => {
                                    setDbConfig({ ...dbConfig, pregrado: event.target.value });
                                }}
                            />
                            <TextField
                                required
                                id="outlined-controlled"
                                label="Título de Posgrado"
                                value={"" + dbConfig.posgrado}
                                disabled={isLoading}
                                multiline
                                onChange={(event) => {
                                    setDbConfig({ ...dbConfig, posgrado: event.target.value });
                                }}
                            />
                            <TextField
                                required
                                id="outlined-controlled"
                                label="Conocimientos Específicos"
                                value={"" + dbConfig.conocimientos}
                                disabled={isLoading}
                                multiline
                                onChange={(event) => {
                                    setDbConfig({ ...dbConfig, conocimientos: event.target.value });
                                }}
                            />
                        </Box>
                        {/* XXXXXXXXXXXXXXXXXXXXX */}
                        <Typography gutterBottom variant="h5" component="div" sx={{ m: 1, color: "#1876D1", fontWeight: "3px" }}>
                            Experiencia Mínima Requerida
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 1 }}>
                            Experiencia mínima del candidato o su equivalente según la normatividad interna vigente.
                        </Typography>

                        <Box
                            component="div"
                            sx={{ '& > :not(style)': { m: 1, width: '20%' }, marginBottom: "50px" }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                required
                                id="outlined-controlled"
                                label="Docencia Universitaria"
                                placeholder="Años de experiencia docente universitaria"
                                value={"" + dbConfig.expe_docencia}
                                disabled={isLoading}
                                onChange={(event) => {
                                    setDbConfig({ ...dbConfig, expe_docencia: event.target.value });
                                }}
                            />
                            <TextField
                                required
                                id="outlined-controlled"
                                label="Profesional"
                                placeholder="Años de experiencia profesional"
                                value={"" + dbConfig.expe_profesional}
                                disabled={isLoading}
                                onChange={(event) => {
                                    setDbConfig({ ...dbConfig, expe_profesional: event.target.value });
                                }}
                            />
                            <TextField
                                required
                                id="expe_investigacion"
                                label="Investigacion"
                                placeholder="Años de experiencia certificada en investigación"
                                value={"" + dbConfig.expe_investigacion}
                                disabled={isLoading}
                                onChange={(event) => {
                                    setDbConfig({ ...dbConfig, expe_investigacion: event.target.value });
                                }}
                            />
                        </Box>
                    </CardContent>
                    {/* </Card> */}
                    {/* </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}> */}
                    {/* <Card sx={{ maxWidth: "100%", height: "500px", overflowY: "auto" }}> */}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ m: 0, color: "#1876D1", fontWeight: "3px" }}>
                            Competencias Requeridas
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Competencias con las que debe contar cada aspirante a ocupar el cargo docente convocado.
                        </Typography>
                        <br />
                        <Box
                            component="section"
                            sx={{ '& .MuiTextField-root': { m: 1, width: '80%' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <div>
                                <TextField
                                    required
                                    id="outlined-controlled"
                                    label="Personales"
                                    placeholder="Ingrese las competencias Personales requeridas"
                                    value={"" + dbConfig.comp_personales}
                                    disabled={isLoading}
                                    multiline
                                    onChange={(event) => {
                                        setDbConfig({ ...dbConfig, comp_personales: event.target.value });
                                    }}
                                />
                                <TextField
                                    required
                                    id="outlined-controlled"
                                    label="Comportamentales"
                                    placeholder="Ingrese las competencias Comportamentales requeridas"
                                    value={"" + dbConfig.comp_comportamentales}
                                    disabled={isLoading}
                                    multiline
                                    onChange={(event) => {
                                        setDbConfig({ ...dbConfig, comp_comportamentales: event.target.value });
                                    }}
                                />
                                <TextField
                                    required
                                    id="outlined-controlled"
                                    label="Técnicas"
                                    placeholder="Ingrese las competencias Técnicas requeridas"
                                    value={"" + dbConfig.comp_tecnicas}
                                    disabled={isLoading}
                                    multiline
                                    onChange={(event) => {
                                        setDbConfig({ ...dbConfig, comp_tecnicas: event.target.value });
                                    }}
                                />
                            </div>
                        </Box>
                    </CardContent>

                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ m: 0, color: "#1876D1", fontWeight: "3px" }}>
                            Requisitos mínimos de Inscripción
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Características y Elementos con los que deben contar los candidatos para participar en la convocatoria.
                        </Typography>
                        <br />
                        <Box
                            component="section"
                            sx={{ '& .MuiTextField-root': { m: 1, width: '80%' }, marginBottom: "50px" }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                required
                                sx={{ width: "80%" }}
                                component="pre"
                                id="outlined-controlled"
                                label="Requisitos mínimos"
                                placeholder="Ingrese los requisitos mínimos exigidos para la inscripción"
                                value={"" + dbConfig.requisitos}
                                disabled={isLoading}
                                multiline
                                // rows={21}
                                onChange={(event) => {
                                    setDbConfig({ ...dbConfig, requisitos: event.target.value });
                                }}
                            >
                            </TextField>
                        </Box>
                    </CardContent>
                    {/* </Card> */}
                    {/* </CustomTabPanel>
                    <CustomTabPanel value={value} index={4}> */}
                    {/* <Card sx={{ maxWidth: "100%", height: "500px", overflowY: "auto" }}> */}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ m: 0, color: "#1876D1", fontWeight: "3px" }}>
                            Inscripción de Candidatos
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Términos para el proceso de insctipción.
                        </Typography>
                        <br />
                        <Box
                            component="div"
                            sx={{ '& > :not(style)': { m: 2, width: '80%' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div id="intervalDate" style={{ width: "50%", display: "flex", justifyContent: "space-between" }}>
                                    {fecha_insc_inicio ? <DatePicker
                                        label="Fecha de inicio"
                                        required
                                        defaultValue={fecha_insc_inicio}
                                        // onChange={(newDate)=>setSelectedDate(newDate)}
                                        onChange={(newDate) => {
                                            setDbConfig({ ...dbConfig, insc_inicio: new Date(newDate) });
                                            setFecha_insc_inicio(new Date(newDate))
                                        }}
                                        format="DD/MM/YYYY"
                                    /> : <p>cargando Fecha</p>
                                    }
                                    {fecha_insc_fin ? <DatePicker
                                        label="Fecha de finalización"
                                        required
                                        defaultValue={fecha_insc_fin}
                                        onChange={(newDate) => {
                                            setDbConfig({ ...dbConfig, insc_fin: new Date(newDate) });
                                            setFecha_insc_fin(new Date(newDate))
                                        }}
                                        format="DD/MM/YYYY"
                                    /> : <p>cargando Fecha</p>
                                    }
                                </div>
                            </LocalizationProvider>
                            <TextField
                                required
                                id="outlined-controlled"
                                label="Lugar"
                                value={"" + dbConfig.insc_lugar}
                                disabled={isLoading}
                                onChange={(event) => {
                                    setDbConfig({ ...dbConfig, insc_lugar: event.target.value });
                                }}
                            />
                            <TextField
                                id="outlined-controlled"
                                required
                                label="Horario"
                                value={"" + dbConfig.insc_horario}
                                disabled={isLoading}
                                onChange={(event) => {
                                    setDbConfig({ ...dbConfig, insc_horario: event.target.value });
                                }}
                            />
                        </Box>
                    </CardContent>
                    {/* </Card> */}
                    {/* </CustomTabPanel>
                    <CustomTabPanel value={value} index={5}> */}
                    {/* <Card sx={{ maxWidth: "100%", height: "500px", overflowY: "auto" }}> */}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ m: 0, color: "#1876D1", fontWeight: "3px" }}>
                            Prueba de Conocimientos
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Tiempo, modo y lugar donde se realizará la prueba de conocimientos de los candidatos.
                        </Typography>
                        <br />
                        <Box
                            component="section"
                            sx={{ '& .MuiTextField-root': { m: 2, width: '80%' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <div>
                                <TextField
                                    required
                                    id="outlined-controlled"
                                    label="Prueba de Conocimiento"
                                    placeholder="Explique brevemente en qué consiste la prueba de conocimiento"
                                    value={"" + dbConfig.prue_descripcion}
                                    disabled={isLoading}
                                    multiline
                                    onChange={(event) => {
                                        setDbConfig({ ...dbConfig, prue_descripcion: event.target.value });
                                    }}
                                />
                                <div id="infoTest">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        {fecha_prueba ? <DateTimePicker
                                            required
                                            label="Fecha y Hora de la prueba"
                                            defaultValue={fecha_prueba}
                                            onChange={(newDate) => {
                                                setDbConfig({ ...dbConfig, prue_fecha: new Date(newDate) });
                                                setFecha_prueba(new Date(newDate))
                                            }}
                                            format="DD/MM/YYYY HH:mm A"
                                        /> : <p>cargando Fecha</p>
                                        }
                                    </LocalizationProvider>
                                    <TextField
                                        required
                                        id="outlined-controlled"
                                        label="Lugar"
                                        value={"" + dbConfig.prue_lugar}
                                        disabled={isLoading}
                                        onChange={(event) => {
                                            setDbConfig({ ...dbConfig, prue_lugar: event.target.value });
                                        }}
                                    />
                                </div>
                            </div>
                        </Box>
                    </CardContent>
                    {/* </Card> */}
                    {/* </CustomTabPanel>
                    <CustomTabPanel value={value} index={6}> */}
                    {/* <Card sx={{ maxWidth: "100%", height: "500px", overflowY: "auto" }}> */}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ m: 0, color: "#1876D1", fontWeight: "3px" }}>
                            Publicación de Resultados
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Términos de publicación del proceso de convocatoria.
                        </Typography>
                        <br />
                        <Box
                            component="div"
                            sx={{ '& > :not(style)': { m: 2, width: '80%' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <div id="infoTest">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {fecha_publicacion ? <div style={{ marginRight: "20px" }}>
                                        <DatePicker
                                            required
                                            label="Fecha para publicación de resultados"
                                            defaultValue={fecha_publicacion}
                                            onChange={(newDate) => {
                                                setDbConfig({ ...dbConfig, publ_fecha: new Date(newDate) });
                                                setFecha_publicacion(new Date(newDate))
                                            }}
                                            format="DD/MM/YYYY"
                                        />
                                    </div> : <p>cargando Fecha</p>
                                    }
                                </LocalizationProvider>
                            </div>

                            <TextField
                                required
                                id="outlined-controlled"
                                label="Lugar"
                                value={"" + dbConfig.publ_lugar}
                                disabled={isLoading}
                                multiline
                                rows={2}
                                onChange={(event) => {
                                    setDbConfig({ ...dbConfig, publ_lugar: event.target.value });
                                }}
                            />
                        </Box>
                    </CardContent>
                    {/* </Card> */}
                    {/* </CustomTabPanel>
                    <CustomTabPanel value={value} index={7}> */}
                    {/* <Card sx={{ maxWidth: "100%", height: "500px" }}> */}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ m: 0, color: "#1876D1", fontWeight: "3px" }}>
                            Firmas
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Funcionarios responsables de autorizar la convocatoria
                        </Typography>
                        <br />
                        <Box
                            component="div"
                            sx={{ '& > :not(style)': { m: 2, width: '100%' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <div style={{ display: "flex", justifyContent: "start" }}>
                                <TextField
                                    required
                                    id="outlined-controlled"
                                    label="Rector"
                                    value={"" + dbConfig.rector}
                                    disabled={isLoading}
                                    sx={{ width: "40%" }}
                                    onChange={(event) => {
                                        setDbConfig({ ...dbConfig, rector: event.target.value });
                                    }}
                                />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "start", width: "50%" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "start", width: "30%" }}>
                                        {/* <Checkbox {...label} onClick={() => { setVerRectorEncargado(!verRectorEncargado) }} /> */}
                                        <Checkbox {...label} onClick={() => { handleActivarEncargoRector() }} />
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Encargado
                                        </Typography>
                                    </div>
                                    {verRectorEncargado &&
                                        <TextField
                                            id="outlined-controlled"
                                            label="Acto administrativo de Encargo"
                                            value={"" + dbConfig.rector_encargado}
                                            disabled={isLoading}
                                            sx={{ width: "40%" }}
                                            onChange={(event) => {
                                                setDbConfig({ ...dbConfig, rector_encargado: event.target.value });
                                            }}
                                        />
                                    }
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "start" }}>
                                <TextField
                                    required
                                    id="outlined-controlled"
                                    label="Rector"
                                    value={"" + dbConfig.vicerector}
                                    disabled={isLoading}
                                    sx={{ width: "40%" }}
                                    onChange={(event) => {
                                        setDbConfig({ ...dbConfig, vicerector: event.target.value });
                                    }}
                                />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "start", width: "50%" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "start", width: "30%" }}>
                                        {/* <Checkbox {...label} onClick={() => { setVerVicerectorEncargado(!verVicerectorEncargado) }} /> */}
                                        <Checkbox {...label} onClick={() => { handleActivarEncargoVicerector() }} />
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Encargado
                                        </Typography>
                                    </div>
                                    {verVicerectorEncargado &&
                                        <TextField
                                            id="outlined-controlled"
                                            label="Acto administrativo de Encargo"
                                            value={"" + dbConfig.vicerector_encargado}
                                            disabled={isLoading}
                                            sx={{ width: "40%" }}
                                            onChange={(event) => {
                                                setDbConfig({ ...dbConfig, vicerector_encargado: event.target.value });
                                            }}
                                        />
                                    }
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "start" }}>
                                <TextField
                                    required
                                    id="outlined-controlled"
                                    label="Rector"
                                    value={"" + dbConfig.decano}
                                    disabled={isLoading}
                                    sx={{ width: "40%" }}
                                    onChange={(event) => {
                                        setDbConfig({ ...dbConfig, decano: event.target.value });
                                    }}
                                />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "start", width: "50%" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "start", width: "30%" }}>
                                        {/* <Checkbox {...label} onClick={() => { setVerDecanoEncargado(!verDecanoEncargado) }} /> */}
                                        <Checkbox {...label} onClick={() => { handleActivarEncargoDecano() }} />
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Encargado
                                        </Typography>
                                    </div>
                                    {verDecanoEncargado &&
                                        <TextField
                                            id="outlined-controlled"
                                            label="Acto administrativo de Encargo"
                                            value={"" + dbConfig.decano_encargado}
                                            disabled={isLoading}
                                            sx={{ width: "40%" }}
                                            onChange={(event) => {
                                                setDbConfig({ ...dbConfig, decano_encargado: event.target.value });
                                            }}
                                        />
                                    }
                                </div>
                            </div>
                        </Box>
                    </CardContent>
                    <CardActions sx={{ position: "fixed", right: "100px", top: "90vh", background: "white", borderRadius: "15px", boxShadow: "5px 5px 10px black", zIndex: "3" }}>
                        <Button size="small" onClick={() => { setValue(value - 1) }}><ArrowCircleUpIcon /><a href="#inicio">Inicio</a></Button>
                    </CardActions>
                    {/* </Card> */}
                    {/* </CustomTabPanel> */}
                </Box>
            </Box>

        </div >
    )
}

export default Editor
