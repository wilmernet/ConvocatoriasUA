import { useState, useEffect, useContext } from "react";
import { DataContext } from '../../context/DataContext';

// ---------------------- CSS Y OTROS COMPONENTES --------------------------------------------------------------------------------------
import "./CallForm.css";
import PrintPage from '../PrintPage/PrintPage';

// ---------------------- COMPONENTES MUI ----------------------------------------------------------------------------------------------
import { Box, Button, CardActions, CardContent, Checkbox, Divider, FormControl, FormControlLabel, InputLabel, LinearProgress } from '@mui/material';
import { MenuItem, Modal, Radio, RadioGroup, Select, Stack, Typography, TextField, Tabs, Tab } from '@mui/material';

// ---------------------- ICONS ---------------------------------------------------------------------------------------------------------
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BackspaceIcon from '@mui/icons-material/Backspace';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CampaignIcon from '@mui/icons-material/Campaign';
import DrawIcon from '@mui/icons-material/Draw';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import SchoolIcon from '@mui/icons-material/School';

// ---------------------- DATE --------------------------------------------------------------------------------------------------------
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

// ---------------------- UTILS -------------------------------------------------------------------------------------------------------
import PropTypes from 'prop-types';
import SearchAndSelect from '../SearchAndSelect/SearchAndSelect';

// ---------------------- SWAL --------------------------------------------------------------------------------------------------------
import Swal from 'sweetalert2'

// ---------------------- PDF RENDERER ------------------------------------------------------------------------------------------------
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

// ---------------------- FIREBASE ----------------------------------------------------------------------------------------------------
import db from "../../Firebase/FirebaseConfig";
import { collection, query, where, doc, getDoc, getDocs, setDoc, updateDoc, limit, Timestamp } from "firebase/firestore";


//=====================================================================================================================================
//   <<<<<<<<<<<<<<<|   FUNCIONES AUXILIARES    |>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//===================================================================================================================================== 


// ----------------------  SUMAR N DÍAS HÁBILES A UNA FECHA ----------------------------------------
const sumarNdias = (date, daysToAdd) => {
    let newDate = dayjs(date);
    let addedDays = 0;

    while (addedDays < daysToAdd) {
        newDate = newDate.add(1, 'day');
        const dayOfWeek = newDate.day();
        // Si no es sábado (6) ni domingo (0), cuenta como día hábil
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            addedDays++;
        }
    }
    return newDate;
};

// ----------------------  ADMINISTRAR LAS PESTAÑAS DEL FORMULARIO (PANEL) -------------------------------------

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

//=====================================================================================================================================
//   <<<<<<<<<<<<<<<|   COMPONENTE: FORMULARIO NUEVA CONVOCATORIA     |>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//===================================================================================================================================== 

const CallFormFinally = () => {

    const { rolFacultad, dataValue, setDataValue, cursosSeleccionados, setCursosSeleccionados } = useContext(DataContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isPrintable, setIsPrintable] = useState(false);
    const [verRectorEncargado, setVerRectorEncargado] = useState(false);
    const [verVicerectorEncargado, setVerVicerectorEncargado] = useState(false);
    const [verDecanoEncargado, setVerDecanoEncargado] = useState(false);
    const [textRequisitos, setTextRequisitos] = useState(``);
    const [programa, setPrograma] = useState('');  // para cargar los programas de la facultad en el Select
    const [tipoDocente, setTipoDocente] = useState(''); // para cargar el tipo de docente en el Select
    const [areaSelected, setAreaSelected] = useState(''); // para cargar el área de concurso en el Select
    const [update, setUpdate] = useState(false); //validar si se va a crear o modificar una convocatoria
    const [idAsignado, setIdAsignado] = useState('');   // id de la convocatoria que se va a editar
    const [value, setValue] = useState(0);   // empleado para avanzar o retroceder en las pestañas  
    //fecha de convocatoria, fechas de inicio y fin de inscripción, fecha de prueba y fecha de publicación de la convocatoria
    const [fecha, setFecha] = useState(dayjs());
    const [fecha_insc_inicio, setFecha_insc_inicio] = useState(sumarNdias(dayjs(), 2));
    const [fecha_insc_fin, setFecha_insc_fin] = useState(sumarNdias(dayjs(), 6));
    const [fecha_prueba, setFecha_prueba] = useState(sumarNdias(dayjs(), 11));
    const [fecha_publicacion, setFecha_publicacion] = useState(sumarNdias(dayjs(), 13));


    const [dbConfig, setDbConfig] = useState({})
    const [openModal, setOpenModal] = useState(false);  // abrir modal para imprimir convocatoria
    const [areas, setAreas] = useState([]);
    const [cursos, setCursos] = useState([]);

    //=====================================================================================================================================
    //   <<<<<<<<<<<<<<<|    HOOOKS useEffect()      |>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //===================================================================================================================================== 

    //----------- << FORMULARIO >>  CARGAR LAS ÁREAS DEL CONCURSO SEGÚN EL PROGRAMA SELECCIONADO  --------------------------------
    useEffect(() => {
        setIsPrintable(false);
    }, [dbConfig]);

    //----------- << FORMULARIO >>  CARGAR LAS ÁREAS DEL CONCURSO SEGÚN EL PROGRAMA SELECCIONADO  --------------------------------
    useEffect(() => {
        const downData = async () => {
            if (programa === '') return; // Si no hay programa seleccionado, no hacer nada
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

    //----------- << FORMULARIO >>  CARGAR LOS CURSOS QUE OFERTA LA FACULTAD -------------------------------------------------------
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

    //----------- << CONVOCATORIA >>  ACTUALIZAR LOS CURSOS SELECCIONADOS  --------------------------------------------------------
    useEffect(() => {
        setDbConfig({ ...dbConfig, cursos: cursosSeleccionados });
    }, [cursosSeleccionados]);

    //----------- << CONVOCATORIA >>  CARGAR LA PLANTILLA DE CONVOCATORIA DE LA FACULTAD -----------------------------------------
    useEffect(() => {
        const downData = async () => {
            const facultadMayuscula = rolFacultad.id.toUpperCase();
            const docRef = doc(db, "config", `CONF-${facultadMayuscula}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setTextRequisitos(docSnap.data().requisitos);
                setDbConfig({
                    ...docSnap.data(),
                    facultad: rolFacultad.id,
                    fecha: fecha.toDate(),
                    insc_inicio: fecha_insc_inicio.toDate(),
                    insc_fin: fecha_insc_fin.toDate(),
                    prue_fecha: fecha_prueba.toDate(),
                    publ_fecha: fecha_publicacion.toDate()
                });
                setIsLoading(false);
            } else {
                console.log(`No se encontró una plantilla para la convocatoria para la facultad ${facultadMayuscula} !`);
            }
        }
        downData();
    }, []);

    //=====================================================================================================================================
    //   <<<<<<<<<<<<<<<|    FUNCIONES MANEJADORAS      |>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //===================================================================================================================================== 

    //----------- << CONVOCATORIA >> GUARDAR LA CONVOCATORIA ------------------------------------------------------------------------
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
        // if (dbConfig.cursos.length == 0) {
        //     camposFaltantes.push("Cursos convocados");
        // }
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
            const listadoConvocatorias = [];
            const downData = async () => {
                const querySnapshot = await getDocs(collection(db, "convocatorias"));
                // const querySnapshot = await getDocs(collection(db, "config")); //Guardas la de cada facultad
                querySnapshot.forEach((doc) => {
                    listadoConvocatorias.push({ ...doc.data(), id: doc.id });
                });
                const convocatoriasRepetidas = listadoConvocatorias.filter((convocatoria) => { return convocatoria.id == idAsignado })
                if (convocatoriasRepetidas.length > 0) {
                    if (!update) {
                        duplicado = true;
                    }
                }
                if (!duplicado) {
                    const upData = async () => {
                        await setDoc(doc(db, "convocatorias", idAsignado), dbConfig);  // para SALVAR LA NUEVA CONVOCATORIA                                                
                    }
                    upData();
                    let texto;
                    if(update){
                        Swal.fire({
                            icon: 'success',
                            title: 'Modificada con éxito',
                            html: `Convocatoria Número ${dbConfig.numero} del ${dayjs().year()}`,
                        });
                    }else{
                        Swal.fire({
                            icon: 'success',
                            title: 'Creada con éxito',
                            html: `Convocatoria Número ${dbConfig.numero} del ${dayjs().year()}`,
                        });
                    } 
                    setUpdate(true);                    
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops algo ha ocurrido...',
                        html: `Ya existe una convocatoria con el número: <br/><br/> ${dbConfig.numero}<br/>para el año ${dayjs().year()}`,
                    });
                }
            }
            downData();
            setIsPrintable(true);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                html: `Falta información por diligenciar: <br/><br/> ${camposFaltantes}`,
            });
        }
    }

    //----------- << FORMULARIO >> BORRAR LOS DATOS CARGADOS DE LA CONVOCATORIA ------------------------------------------------------------------------
    const handleCancel = () => {
        setPrograma('');  // para cargar los programas de la facultad en el Select
        setTipoDocente(''); // para cargar el tipo de docente en el Select
        setAreaSelected(''); // para cargar el área de concurso en el Select
        setUpdate(false);
        setDataValue(false);
        setCursosSeleccionados([]);
        setFecha(dayjs());
        setFecha_insc_inicio(sumarNdias(dayjs(), 2));
        setFecha_insc_fin(sumarNdias(dayjs(), 6));
        setFecha_prueba(sumarNdias(dayjs(), 11));
        setFecha_publicacion(sumarNdias(dayjs(), 13));
        setIsLoading(false);
        setIsLoading(false);
        setTipoDocente('');
        setPrograma('');
        setAreaSelected('');
        setVerDecanoEncargado(false);
        setVerVicerectorEncargado(false);
        setVerRectorEncargado(false);
        const downData = async () => {
            const facultadMayuscula = rolFacultad.id.toUpperCase();
            const docRef = doc(db, "config", `CONF-${facultadMayuscula}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setTextRequisitos(docSnap.data().requisitos);
                setDbConfig({
                    ...docSnap.data(),
                    facultad: rolFacultad.id,
                    fecha: fecha,
                    insc_inicio: fecha_insc_inicio,
                    insc_fin: fecha_insc_fin,
                    prue_fecha: fecha_prueba,
                    publ_fecha: fecha_publicacion
                });
            } else {
                console.log(`No se encontró una plantilla para la convocatoria para la facultad ${facultadMayuscula} !`);
            }
        }
        downData();
    }

    //----------- << FORMULARIO >> ABRIR/CERRAR VISTA PRELIMINAR DE LA CONVOCATORIA ------------------------------------------------------------------------
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    //----------- << FORMULARIO >> SELECCIONAR UNA NUEVA PESTAÑA DEL FORMULARIO ---------------------------------------------------  
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    //----------- << FORMULARIO >> MOSTRAR/OCULTAR CAMPOS DE LOS ENCARGADOS  ------------------------------------------------------------------------
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

    //=====================================================================================================================================
    //   <<<<<<<<<<<<<<<|    FORMULARIO      |>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //===================================================================================================================================== 
    return (
        <div style={{ height: "100vh", maxWidth: "100vw", display: "flex", justifyContent: "center" }}>
            <div className='callForm'>
                <Box
                    component="form"
                    sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSaveData}
                >
                    <div className='Superior'>

                        <Box
                            component="div"
                            sx={{ '& > :not(style)': { m: 2, width: '10%' } }}
                            noValidate
                            autoComplete="off"
                        >
                            {/* <Typography gutterBottom variant="h5" component="div" ></Typography> */}
                            <div style={{ display: "flex", width: "100%" }}>
                                {update ?
                                    <TextField
                                        // sx={{ marginRight: "20px" }}
                                        sx={{ marginRight: "20px" }}
                                        id="numero"
                                        label="Número"
                                        value={"" + dbConfig.numero}
                                        disabled={true}
                                        variant="filled"
                                        onChange={(event) => {
                                            setDbConfig({ ...dbConfig, numero: event.target.value });
                                            setIdAsignado(event.target.value + "-" + (dayjs().format('YYYY')) + "-" + rolFacultad.id)
                                        }}
                                    />:
                                    <TextField
                                        // sx={{ marginRight: "20px" }}
                                        sx={{ marginRight: "20px" }}
                                        id="numero"
                                        label="Número"
                                        value={"" + dbConfig.numero}
                                        disabled={isLoading}
                                        variant="filled"
                                        onChange={(event) => {
                                            setDbConfig({ ...dbConfig, numero: event.target.value });
                                            setIdAsignado(event.target.value + "-" + (dayjs().format('YYYY')) + "-" + rolFacultad.id)
                                        }}
                                    />
                                }
                                <div sx={{ width: "20px", border: "solid" }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <div style={{ width: "150px", marginRight: "20px" }}>
                                            <DatePicker
                                                label="Fecha convocatoria"
                                                defaultValue={fecha}
                                                onChange={(newDate) => {
                                                    setFecha(newDate);
                                                    setDbConfig({ ...dbConfig, fecha: fecha.toDate() });
                                                }}
                                                format="DD/MM/YYYY"
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                            />
                                        </div>
                                    </LocalizationProvider>
                                </div>
                                <Stack direction="row" spacing={2}>
                                    <Button variant="outlined" startIcon={<BackspaceIcon />} onClick={handleCancel}>
                                        Cancelar
                                    </Button>
                                    {update ?
                                        <Button variant="outlined" type='submit' endIcon={<SaveIcon />} onClick={handleSaveData}>
                                            Modificar
                                        </Button> :
                                        <Button variant="outlined" type='submit' endIcon={<SaveIcon />} onClick={handleSaveData}>
                                            Guardar
                                        </Button>

                                    }
                                    {isPrintable ?
                                        <Button variant="outlined" endIcon={<PrintIcon />} onClick={handleOpenModal}>
                                            Imprimir
                                        </Button> :
                                        <Button variant="outlined" endIcon={<PrintIcon />} disabled>Imprimir</Button>
                                    }
                                    <Modal
                                        open={openModal}
                                        onClose={handleCloseModal}
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
                                            {name}
                                            <PDFDownloadLink document={<PrintPage convocatoria={idAsignado} />} fileName="Convocatoria.pdf">
                                                {({ loading }) => (loading ? 'Generando PDF...' : '')}
                                            </PDFDownloadLink>
                                            <PDFViewer style={{ width: '100%', height: "100%", display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                                <PrintPage convocatoria={idAsignado} />
                                            </PDFViewer>
                                        </Box>
                                    </Modal>
                                </Stack>
                            </div>
                        </Box>

                        <Box sx={{ width: '90%', borderBottom: 1, borderColor: 'divider', m: 0 }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable" scrollButtons="auto">
                                {/* <Tab icon={<AssignmentIndIcon />} label="Generalidades" {...a11yProps(7)} wrapped /> */}
                                <Tab icon={<AssuredWorkloadIcon />} label="Requerimiento" {...a11yProps(0)} wrapped />
                                <Tab icon={<SchoolIcon />} label="Cursos" {...a11yProps(1)} wrapped />
                                <Tab sx={{ width: "125px" }} icon={<HomeRepairServiceIcon />} label="Formación y Experiencia" {...a11yProps(2)} wrapped />
                                <Tab sx={{ width: "100px" }} icon={<AutoStoriesIcon />} label="Competencias y Requisitos" {...a11yProps(3)} wrapped />
                                <Tab icon={<BorderColorIcon />} label="Inscripción" {...a11yProps(4)} wrapped />
                                <Tab icon={<EmojiPeopleIcon />} label="Prueba" {...a11yProps(5)} wrapped />
                                <Tab icon={<CampaignIcon />} label="Publicación" {...a11yProps(6)} wrapped />
                                <Tab icon={<DrawIcon />} label="Firmas" {...a11yProps(7)} wrapped />
                            </Tabs>
                        </Box>
                    </div>

                    <Box sx={{ width: '100%' }}>
                        <CustomTabPanel value={value} index={0}>
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
                                        <Select
                                            labelId="demo-simple-select-label1"
                                            id="demo-simple-select1"
                                            value={tipoDocente}
                                            label="Tipo de Docente"
                                            onChange={(event) => {
                                                setTipoDocente(event.target.value);
                                                setDbConfig({ ...dbConfig, vinculacion: event.target.value });
                                            }
                                            }
                                        // onChange={handleChangeTipoDocente}
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
                                            label="Programa"
                                            // onChange={handleChangeProgram}
                                            onChange={(event) => {
                                                setPrograma(event.target.value);
                                                setDbConfig({ ...dbConfig, programa: event.target.value });
                                            }
                                            }
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
                                            label="Area del conocimiento"
                                            // onChange={handleChangeAreas}
                                            onChange={
                                                (event) => {
                                                    setAreaSelected(event.target.value);
                                                    setDbConfig({ ...dbConfig, area: event.target.value });
                                                }
                                            }
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
                                                // onChange={handleChangePrimeraVez}
                                                onChange={
                                                    (event) => {
                                                        setDbConfig({ ...dbConfig, primera_vez: event.target.value });
                                                    }
                                                }
                                            >
                                                <FormControlLabel value="true" control={<Radio />} label="Primera vez" />
                                                <FormControlLabel value="false" control={<Radio />} label="Segunda vez" />
                                            </RadioGroup>
                                        </div>
                                    </FormControl>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ position: "fixed", top: "90vh", background: "white", borderRadius: "15px", boxShadow: "5px 5px 10px black", zIndex: "3" }}>
                                <Button size="small" disabled onClick={() => { setValue(value - 1) }}><ArrowCircleLeftIcon />ANTERIOR</Button>
                                <Button size="small" onClick={() => { setValue(value + 1) }}>SIGUIENTE <ArrowCircleRightIcon /></Button>
                            </CardActions>
                            {/* </Card> */}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
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
                            <CardActions sx={{ position: "fixed", top: "90vh", background: "white", borderRadius: "15px", boxShadow: "5px 5px 10px black", zIndex: "3" }}>
                                <Button size="small" onClick={() => { setValue(value - 1) }}><ArrowCircleLeftIcon />ANTERIOR</Button>
                                <Button size="small" onClick={() => { setValue(value + 1) }}>SIGUIENTE <ArrowCircleRightIcon /></Button>
                            </CardActions>
                            {/* </Card> */}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
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
                            <CardActions sx={{ position: "fixed", top: "90vh", background: "white", borderRadius: "15px", boxShadow: "5px 5px 10px black", zIndex: "3" }}>
                                <Button size="small" onClick={() => { setValue(value - 1) }}><ArrowCircleLeftIcon />ANTERIOR</Button>
                                <Button size="small" onClick={() => { setValue(value + 1) }}>SIGUIENTE <ArrowCircleRightIcon /></Button>
                            </CardActions>
                            {/* </Card> */}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={3}>
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

                            <CardActions sx={{ position: "fixed", top: "90vh", background: "white", borderRadius: "15px", boxShadow: "5px 5px 10px black", zIndex: "3" }}>
                                <Button size="small" onClick={() => { setValue(value - 1) }}><ArrowCircleLeftIcon />ANTERIOR</Button>
                                <Button size="small" onClick={() => { setValue(value + 1) }}>SIGUIENTE <ArrowCircleRightIcon /></Button>
                            </CardActions>
                            {/* </Card> */}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={4}>
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
                                            <DatePicker
                                                label="Fecha de inicio"
                                                defaultValue={fecha_insc_inicio}
                                                onChange={(newDate) => {
                                                    setFecha_insc_inicio(newDate);
                                                    setDbConfig({ ...dbConfig, insc_inicio: fecha_insc_inicio.toDate() });
                                                }}
                                                format="DD/MM/YYYY"
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                            />
                                            <DatePicker
                                                label="Fecha de Finalización"
                                                defaultValue={fecha_insc_fin}
                                                onChange={(newDate) => {
                                                    setFecha_insc_fin(newDate);
                                                    setDbConfig({ ...dbConfig, insc_fin: fecha_insc_fin.toDate() });
                                                }}
                                                format="DD/MM/YYYY"
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                            />
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
                            <CardActions sx={{ position: "fixed", top: "90vh", background: "white", borderRadius: "15px", boxShadow: "5px 5px 10px black", zIndex: "3" }}>
                                <Button size="small" onClick={() => { setValue(value - 1) }}><ArrowCircleLeftIcon />ANTERIOR</Button>
                                <Button size="small" onClick={() => { setValue(value + 1) }}>SIGUIENTE <ArrowCircleRightIcon /></Button>
                            </CardActions>
                            {/* </Card> */}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={5}>
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
                                                <DateTimePicker
                                                    label="Fecha y Hora de la Prueba"
                                                    defaultValue={fecha_prueba}
                                                    onChange={(newDate) => {
                                                        setFecha_prueba(newDate);
                                                        setDbConfig({ ...dbConfig, prue_fecha: fecha_prueba.toDate() });
                                                    }}
                                                    format="DD/MM/YYYY HH:mm A"
                                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                                />
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
                            <CardActions sx={{ position: "fixed", top: "90vh", background: "white", borderRadius: "15px", boxShadow: "5px 5px 10px black", zIndex: "3" }}>
                                <Button size="small" onClick={() => { setValue(value - 1) }}><ArrowCircleLeftIcon />ANTERIOR</Button>
                                <Button size="small" onClick={() => { setValue(value + 1) }}>SIGUIENTE <ArrowCircleRightIcon /></Button>
                            </CardActions>
                            {/* </Card> */}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={6}>
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
                                            <div style={{ marginRight: "20px" }}>
                                                <DatePicker
                                                    label="Fecha para publicación de resultados"
                                                    defaultValue={fecha_publicacion}
                                                    onChange={(newDate) => {
                                                        setFecha_publicacion(newDate);
                                                        setDbConfig({ ...dbConfig, publ_fecha: fecha_publicacion.toDate() });
                                                    }}
                                                    format="DD/MM/YYYY"
                                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                                />
                                            </div>
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
                            <CardActions sx={{ position: "fixed", top: "90vh", background: "white", borderRadius: "15px", boxShadow: "5px 5px 10px black", zIndex: "3" }}>
                                <Button size="small" onClick={() => { setValue(value - 1) }}><ArrowCircleLeftIcon />ANTERIOR</Button>
                                <Button size="small" onClick={() => { setValue(value + 1) }}>SIGUIENTE <ArrowCircleRightIcon /></Button>
                            </CardActions>
                            {/* </Card> */}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={7}>
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
                                                <Checkbox checked={verRectorEncargado} {...label} onClick={() => { handleActivarEncargoRector() }} />
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
                                            label="Vicerector"
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
                                                <Checkbox checked={verVicerectorEncargado} {...label} onClick={() => { handleActivarEncargoVicerector() }} />
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
                                            label="Decano"
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
                                                <Checkbox checked={verDecanoEncargado} {...label} onClick={() => { handleActivarEncargoDecano() }} />
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
                            <CardActions sx={{ position: "fixed", top: "90vh", background: "white", borderRadius: "15px", boxShadow: "5px 5px 10px black", zIndex: "3" }}>
                                <Button size="small" onClick={() => { setValue(value - 1) }}><ArrowCircleLeftIcon />ANTERIOR</Button>
                                <Button size="small" disabled onClick={() => { setValue(value + 1) }}>SIGUIENTE <ArrowCircleRightIcon /></Button>
                            </CardActions>
                            {/* </Card> */}
                        </CustomTabPanel>
                    </Box>
                </Box>

            </div >
        </div>
    )
}

export default CallFormFinally