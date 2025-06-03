import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PrintIcon from '@mui/icons-material/Print';
import BackspaceIcon from '@mui/icons-material/Backspace';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import SaveIcon from '@mui/icons-material/Save';
import SectionCard from '../Card/SectionCard';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SearchAndSelect from '../SearchAndSelect/SearchAndSelect';

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
import "./Format.css";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import TimeDate from "../TimeDate/TimeDate";
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';

import SchoolIcon from '@mui/icons-material/School';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CampaignIcon from '@mui/icons-material/Campaign';
import DrawIcon from '@mui/icons-material/Draw';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

// ---------------------- DATE ----------------------
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { border, width } from '@mui/system';

// ---------------------- LISTAS ----------------------
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

const Format = () => {

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

    const [dbConfig, setDbConfig] = useState({})
    const [open, setOpen] = useState(false);
    // const [areas, setAreas] = useState([]);
    const [areaSelected, setAreaSelected] = useState('');
    // const [cursos, setCursos] = useState([]);
    const [cursosSelect, setCursosSelect] = useState([]);

    // useEffect(() => {
    //     console.log("cursosSeleccionados");
    //     console.log(cursosSeleccionados);
    //     setDbConfig({ ...dbConfig, cursos: cursosSeleccionados });
    // }, [cursosSeleccionados]);

    // useEffect(() => {
    //     const downData = async () => {
    //         // console.log(rolFacultad.id);
    //         // console.log(rolFacultad.programas);
    //         const q = query(collection(db, "areasXprograma"), where("programa", "==", programa));
    //         const querySnapshot = await getDocs(q);
    //         const areasCons = [];
    //         querySnapshot.forEach((doc) => {
    //             areasCons.push({ ...doc.data(), id: doc.id });
    //         });
    //         // console.log(programa);
    //         // console.log(areas);
    //         if (areasCons.length > 0) {
    //             const areasFiltradas = areasCons.shift();
    //             setAreas(areasFiltradas.areas);
    //         } else {
    //             setAreas([]);
    //         }
    //     }
    //     downData();
    // }, [programa]);

    // useEffect(() => {
    //     const downData = async () => {
    //         const q = query(collection(db, "cursos"), where("facultad", "==", rolFacultad.id));
    //         const querySnapshot = await getDocs(q);
    //         const cursosEncontrados = [];
    //         querySnapshot.forEach((doc) => {
    //             cursosEncontrados.push({ ...doc.data(), id: doc.id });
    //         });
    //         // const cursosOrdenados=cursosEncontrados.sort();
    //         // setCursos(cursosOrdenados);
    //         setCursos([...cursosEncontrados].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    //     }
    //     downData();
    //     console.log(rolFacultad.id);
    //     console.log(cursos);
    // }, []);

    // function sumarNdias(fechaInicial, dias) {
    //     let fechaFinal = fechaInicial;
    //     let contador = 0;
    //     while (contador < dias) {
    //         fechaFinal = fechaFinal.add(1, 'day');
    //         // Verificar si es fin de semana (sábado o domingo)
    //         if (fechaFinal.day() !== 0 && fechaFinal.day() !== 6) {
    //             contador++;
    //         }
    //     }
    //     return fechaFinal;
    // }
    // function proximoLunes() {
    //     let fechaActual = dayjs(new Date());
    //     let diaActual = fechaActual.day();
    //     let diasQueFaltan = (8 - diaActual) % 7;
    //     return fechaActual.add(diasQueFaltan, 'day');
    // }

    useEffect(() => {
        const downData = async () => {
            // const docRef = doc(db, "config", `CONF-CONVOCATORIA`);
            const facultadMayuscula=rolFacultad.id.toUpperCase();
            const docRef = doc(db, "config", `CONF-${facultadMayuscula}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setDbConfig({ ...docSnap.data(), facultad: rolFacultad.id });
                setListRequirement(docSnap.data().requisitos_lista);
                setTextRequisitos(docSnap.data().requisitos);
                //----------------------------------------                                                                       
                setFecha(dayjs(new Date()));
                // const lunes = proximoLunes();
                // setFecha_insc_inicio(dayjs(new Date()));                
                // setFecha_insc_inicio(sumarNdias(dayjs(), 2));
                // setFecha_insc_fin(sumarNdias(dayjs(), 6));
                // setFecha_prueba(sumarNdias(dayjs(), 11));
                // setFecha_publicacion(sumarNdias(dayjs(), 13));
                //----------------------------------------
                setIsLoading(false);
            } else {
                console.log("No such document!");
            }
        }
        if (downData()) {
        }
    }, []);

    const [value, setValue] = useState(0);

    // const handleChange = (event, newValue) => {
    //     setValue(newValue);
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(".........." + dbConfig);
    // }

    // const handleAddData = () => {
    //     const upData = async () => {
    //         const cityRef = doc(db, "config", "CONF-CONVOCATORIA");
    //         await updateDoc(cityRef, {
    //             requisitos: dbConfig.requisitos
    //         });
    //     }
    //     upData();
    // }

    const handleSaveData = (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Salvar cambios",
            text: "Se guardarán todos los cambios realizados a la plantilla de convocatoria!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "No, cancelar!",
            confirmButtonText: "Si, continuar!"
        }).then((result) => {
            if (result.isConfirmed) {
                const idAsignado = rolFacultad.id + "_otro";
                const upData = async () => {
                    await setDoc(doc(db, "config", idAsignado), dbConfig);  // para guardar cada facultad x defecto                    
                }
                upData();
            }
        });
    }

    // const handleOpen = () => {
    //     setOpen(true);
    // };
    // const handleClose = () => setOpen(false);

    // const handleChangeProgram = (event) => {
    //     setPrograma(event.target.value);
    //     setDbConfig({ ...dbConfig, programa: event.target.value });
    // }

    // const handleChangeTipoDocente = (event) => {
    //     setTipoDocente(event.target.value);
    //     setDbConfig({ ...dbConfig, vinculacion: event.target.value });
    // }

    // const handleChangeAreas = (event) => {
    //     setAreaSelected(event.target.value);
    //     setDbConfig({ ...dbConfig, area: event.target.value });
    // }

    // const handleCancel = () => {
    //     setDataValue(!dataValue);
    //     setCursosSeleccionados([]);
    // }

    return (
        <div className='callForm'>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
                noValidate
                autoComplete="off"
                onSubmit={handleSaveData}
            >
                <div className='Superior'>
                    <div style={{ display: "flex", width: "100%", alignItems: "center"}}>
                        <CardActions sx={{ width: "100%", height: "80px", position: "fixed", top: "60px", background: "white", zIndex: "3" }}>
                            <Stack direction="row" spacing={2}>
                                <Button variant="outlined" type='submit' endIcon={<SaveIcon />} onClick={() => { handleSaveData() }}>
                                    Guardar
                                </Button>
                            </Stack>
                            <div style={{ width: "100%", color: "#1876D1" }}>
                                <Typography gutterBottom variant="h5" component="div" sx={{ marginTop: 2}}>
                                    Configuración del formato de Convocatoria
                                </Typography>
                            </div>
                        </CardActions>
                    </div>
                    <CardContent >
                        <br />
                        <br />
                        <Box sx={{ width: '100%' }}>
                            {isLoading && <LinearProgress />}
                        </Box>
                        <Typography gutterBottom variant="h6" component="div">
                            Años de Experiencia Mínima Requerida
                        </Typography>
                        <Box
                            component="div"
                            sx={{ '& > :not(style)': { m: 1, width: '20%' } }}
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
                        <br />
                        <Typography gutterBottom variant="h6" component="div">
                            Competencias Requeridas
                        </Typography>
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
                        <br />
                        <Typography gutterBottom variant="h6" component="div">
                            Requisitos mínimos de Inscripción
                        </Typography>
                        <Box
                            component="section"
                            sx={{ '& .MuiTextField-root': { width: '80%' } }}
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
                        <br />
                        <Typography gutterBottom variant="h6" component="div">
                            Inscripción de Candidatos
                        </Typography>
                        <Box
                            component="div"
                            sx={{ '& > :not(style)': { m: 1, width: '80%' } }}
                            noValidate
                            autoComplete="off"
                        >

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
                        <br />
                        <Typography gutterBottom variant="h6" component="div">
                            Publicación de Resultados
                        </Typography>
                        <Box
                            component="div"
                            sx={{ '& > :not(style)': { m: 1, width: '80%' } }}
                            noValidate
                            autoComplete="off"
                        >
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
                        <br />
                        <Typography gutterBottom variant="h6" component="div">
                            Prueba de Conocimientos
                        </Typography>
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
                                    label="Prueba de Conocimiento"
                                    placeholder="Explique brevemente en qué consiste la prueba de conocimiento"
                                    value={"" + dbConfig.prue_descripcion}
                                    disabled={isLoading}
                                    multiline
                                    onChange={(event) => {
                                        setDbConfig({ ...dbConfig, prue_descripcion: event.target.value });
                                    }}
                                />

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
                        </Box>
                        <br />
                        <Typography gutterBottom variant="h6" component="div">
                            Firmas
                        </Typography>
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
                                <div style={{ marginLeft: "20px", display: "flex", alignItems: "center", justifyContent: "start", width: "60%" }}>
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
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "start" }}>
                                <TextField
                                    required
                                    id="outlined-controlled"
                                    label="Vicerector"
                                    value={"" + dbConfig.vicerector}
                                    disabled={isLoading}
                                    sx={{ width: "40%" }}
                                    onChange={(event) => {
                                        setDbConfig({ ...dbConfig, vicerector: event.target.value });
                                    }}
                                />
                                <div style={{ marginLeft: "20px", display: "flex", alignItems: "center", justifyContent: "start", width: "60%" }}>
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
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "start" }}>
                                <TextField
                                    required
                                    id="outlined-controlled"
                                    label="Decano"
                                    value={"" + dbConfig.decano}
                                    disabled={isLoading}
                                    sx={{ width: "40%" }}
                                    onChange={(event) => {
                                        setDbConfig({ ...dbConfig, decano: event.target.value });
                                    }}
                                />
                                <div style={{ marginLeft: "20px", display: "flex", alignItems: "center", justifyContent: "start", width: "60%" }}>
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
                                </div>
                            </div>
                        </Box>
                    </CardContent>
                </div>
            </Box>
        </div >
    )
}

export default Format