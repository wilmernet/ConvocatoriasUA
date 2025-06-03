import "./Dashboard.css";
import Logo from "../../assets/LogoUA.jpg"
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';

import Swal from 'sweetalert2'

import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import StorageIcon from '@mui/icons-material/Storage';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import Divider from '@mui/material/Divider';

import Editor from "../Editor/Editor";
import CallForm from "../CallForm/CallForm";
import DataTable from '../DataTable/DataTable';
import OptionsMain from "../OptionsMain/OptionsMain"
import Course from "../Course/Course";
import Area from "../Area/Area";
import Format from "../Format/Format";
import Program from "../Program/Program";
import Cities from "../Cities/Cities";

import { DataContext } from "../../context/DataContext";
import React, { useState, useEffect, useContext } from 'react';

import db from "../../Firebase/FirebaseConfig";
import { collection, query, where, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";

import { appFirebase } from '../../Firebase/FirebaseConfig';
import { getAuth } from 'firebase/auth';
const auth = getAuth(appFirebase);


const NAVIGATION = [
  {
    kind: 'header',
    title: 'Menú de Opciones',
  },
  {
    segment: 'dashboard',
    title: 'Inicio',
    icon: <PlayCircleFilledWhiteIcon />,
  },
  {
    segment: 'nuevaConvocatoria',
    title: 'Nueva Convocatoria',
    icon: <NoteAddIcon />,
  },
  {
    segment: 'listadoConvocatorias',
    title: 'Listar Convocatorias',
    icon: <FormatListNumberedIcon />,
    // icon: <FindInPageIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Configurar',
  },
  {
    segment: 'cursos',
    title: 'Cursos Ofertados',
    // icon: <FolderCopyIcon />,
    icon: <MenuBookOutlinedIcon />,
    // icon: <SettingsIcon />,
  },
  {
    segment: 'configuracion',
    title: 'Opciones',
    icon: <SettingsIcon />,
    children: [
      {
        segment: 'porDefecto',
        title: 'Formato',
        icon: <ChecklistRtlIcon />,
      },
      {
        segment: 'programas',
        title: 'Programas',
        icon: <StorageIcon />,
      },
      {
        segment: 'ciudades',
        title: 'Ciudades',
        icon: <TravelExploreIcon />,
      },
      {
        segment: 'areas',
        title: 'Areas por Programa',
        icon: <FolderCopyIcon />,
      },      
    ],
  },
  // {
  //   segment: 'integrations',
  //   title: 'Configuración',
  //   icon: <SettingsIcon />,
  // },
  {
    segment: 'sesion',
    title: 'Cerrar Sesión',
    icon: <AccountCircleIcon />,
  },
];

const demoTheme = createTheme({

  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true },
  // colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  const { dataValue, setDataValue, numConvocatoria,cursosSeleccionados, setCursosSeleccionados } = useContext(DataContext);
  if (dataValue && pathname!="/listadoConvocatorias") {          
        {Swal.fire({
          title: `Editando la convocatoria...`,
          text: "Antes de continuar debe guardar o descartar los cambios de la convocatoria",
          icon: "warning"
        })}
        pathname="/listadoConvocatorias";
  }
  if (pathname == "/dashboard") {
    return (
      <>
        <OptionsMain />
      </>
    )
  } else if (pathname == "/nuevaConvocatoria") {    
    return (
      <>         
        <CallForm />
      </>
    );
  } else if (pathname == "/listadoConvocatorias") {
    return (
      <>
        {console.log({ numConvocatoria })}
        {dataValue ? <Editor numero_Convotatoria={numConvocatoria} /> :
          <div>
            <div id='titleTable'>
              <Typography gutterBottom variant="h5" component="div" sx={{ color: "#1876D1", fontWeight: "3px" }}>
                <Divider textAlign="left">Listado de Convocatorias Públicas </Divider>
              </Typography>
            </div>
            <DataTable />
          </div>
        }
      </>
    );
  } else if (pathname == "/sesion") {
    Swal.fire({
      title: "Seguro desea cerrar sesión?",
      text: "Se perderán todos los cambios que no haya guardado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "No, cancelar!",
      confirmButtonText: "Si, cerrar sesión!"
    }).then((result) => {
      if (result.isConfirmed) {
        auth.signOut().then(() => {
          Swal.fire({
            title: "Cerrando sesión!",
            text: "Su sesión se ha cerrado exitosamente.",
            icon: "success"
          });
        }).catch((error) => alert(error))
      }
    });
  } else if (pathname == "/cursos") {
    return (
      <div className="TableCourses" style={{marginTop:"50px"}}>        
          <Course />        
      </div>
    )
  } else if (pathname == "/configuracion/areas") {
    return (
      <div className="TableCourses" style={{marginTop:"50px"}}>        
          <Area />        
      </div>
    )
  } else if (pathname == "/configuracion/porDefecto") {
    return (
      <div className="TableCourses">
        <div>
          <Format />
        </div>
      </div>
    )
  } else if (pathname == "/configuracion/programas") {
    return (
      <div className="TableCourses" style={{marginTop:"50px"}}>
        <div>
          <Program />
        </div>
      </div>
    )
  }else if (pathname == "/configuracion/ciudades") {
    return (
      <div className="TableCourses" style={{marginTop:"50px"}}>
        <div>
          <Cities />
        </div>
      </div>
    )
  }
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

const Dashboard = (props) => {

  //---------------------- CERRAR LA SESIÓN DE AUTHENTCTICATION POR INACTIVIDAD DE 15 MINUTOS -----------------------+
  const [isActive, setIsActive] = useState(true);
  useEffect(() => {
    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setIsActive(false); // Marcar al usuario como inactivo
      }, 900000); // 30 minutos en milisegundos  600000  1800000  
    };

    // Escuchar eventos de usuario
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
    document.addEventListener('keydown', resetInactivityTimer);

    // Inicializar el timer al montar el componente
    resetInactivityTimer();

    // Limpiar los listeners al desmontar el componente
    return () => {
      document.removeEventListener('mousemove', resetInactivityTimer);
      document.removeEventListener('click', resetInactivityTimer);
      document.removeEventListener('keydown', resetInactivityTimer);
      clearTimeout(inactivityTimer);
    };
  }, []);



  useEffect(() => {
    if (!isActive) {
      auth.signOut()
        .then(() => {
          // console.log('Sesión cerrada por inactividad');
          auth.signOut().then(() => {
            Swal.fire({
              title: "Cerrando sesión!",
              text: "Su sesión se ha cerrado por inactividad (15 minutos).",
              icon: "success"
            });
          }).catch((error) => alert(error))
        })
        .catch(error => {
          console.error('Error al cerrar sesión:', error);
        });
    }
  }, [isActive]);

  // console.log("Llegan con el user "+props.email);
  const { rolFacultad, setRolFacultad } = useContext(DataContext);
  //---------------------- CARGA DE INFORMACIÓN DESDE LA BD -----------------------+
  useEffect(() => {
    const downData = async () => {
      const q = query(collection(db, "usuarioXfacultad"), where("correo", "==", props.email));
      const querySnapshot = await getDocs(q);
      const facSelected = [];
      querySnapshot.forEach((doc) => {
        facSelected.push({ ...doc.data(), id: doc.id });
      });
      const fac = facSelected.shift();      
      setRolFacultad(fac);      
    }
    downData();   
     
  }, []);

  //---------------------- FIN CARGA DE INFORMACIÓN DESDE LA BD -----------------------+


  const { window } = props;

  const router = useDemoRouter('/dashboard');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      branding={{
        logo: <img src={Logo} alt="Logo Uniamazonia" />,
        title: 'CONVOCATORIAS DE PERSONAL DOCENTE',
      }}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>

    </AppProvider>
  );
}

Dashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default Dashboard;
