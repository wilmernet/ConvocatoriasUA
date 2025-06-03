import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import PrintPage from '../PrintPage/PrintPage';
import PrintPageOriginal from '../PrintPage/PrintPageOriginal';
import Modal from '@mui/material/Modal';

import { useEffect, useContext, useState, Fragment } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { collection, query, where, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import db from "../../Firebase/FirebaseConfig";
import { GridActionsCellItem } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';

import { DataContext } from "../../context/DataContext";

import CallForm from '../CallForm/CallForm';

export default function dataTable() {

  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [numeroConvocatoria, setNumeroConvocatoria] = useState(false);

  const { dataValue, setDataValue, setNumConvocatoria, rolFacultad } = useContext(DataContext);

  function formatearFecha(date) {
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes es base 0
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  useEffect(() => {
    const downData = async () => {
      console.log(rolFacultad.id);
      
      // const q = query(collection(db, "convocatorias"));//, where("facultad", "==", "ingenieria"));
      const q = query(collection(db, "convocatorias"), where("facultad", "==", rolFacultad.id));
      const querySnapshot = await getDocs(q);
      const datosRecuperados = [];
      querySnapshot.forEach((doc) => {
        const fecha = new Date(doc.data().fecha.seconds * 1000);
        datosRecuperados.push({ ...doc.data(), id: doc.id, fecha: formatearFecha(fecha) });
      });
      setRows(datosRecuperados);
      setIsLoading(false);
    }
    downData();
  }, []);

  const handleEdit = (id) => {
    setNumConvocatoria(id)
    setDataValue(true);
  }
  const handleOpen = (id) => {
    setNumeroConvocatoria(id)
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const data = { rows: rows };

  const test = (id) => { alert(id); }

  const handleSaveClick = (id) => {
    return test("Imprimir la convocatoria " + id);
  }
  
  
  const imprimir = () => { alert("click") }
  const columns = [
    { field: "id", headerName: "Número", width: 100, groupable: false },
    { field: "numero", headerName: "Número", width: 70, groupable: false },
    { field: "fecha", headerName: "Fecha", width: 100 },
    { field: "vinculacion", headerName: "Tipo de Vinculación", width: 200, groupable: false },
    { field: "area", headerName: "Área de Concurso", width: 220, groupable: false },
    { field: "programa", headerName: "Programa Académico", width: 170, groupable: false },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 120,
      renderCell: (params) => (
        <Stack spacing={1} sx={{ width: 1, py: 1 }}>
          <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => handleEdit(params.row.id)} >
            Editar
          </Button>
          <Button variant="outlined" size="small" startIcon={<PrintIcon />} onClick={() => handleOpen(params.row.id)}>
            {/* <Button variant="outlined" size="small" startIcon={<PrintIcon />} onClick={() => test(params.row.id)}>           */}
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
              {name}
              <PDFDownloadLink document={<PrintPage convocatoria={numeroConvocatoria} />} fileName="Convocatoria.pdf">
                {({ loading }) => (loading ? 'Generando PDF...' : '')}
              </PDFDownloadLink>
              <PDFViewer style={{width: '100%', height: "100%", display: "flex", justifyContent: 'center', alignItems: 'center'}}>                                
                <PrintPage convocatoria={numeroConvocatoria} />                
              </PDFViewer>
            </Box>
          </Modal>
        </Stack>
      ),
    },
  ];

  return (
    <div style={{ height: "100vh", maxWidth: "100vw", display: "flex", justifyContent: "center" }}>

      <div style={{ maxWidth: "80%" }}>
        <br />
        <Box sx={{ height: 400, width: 1 }}>
          <DataGrid
            // onCellClick={handleSaveClick}
            {...data}
            getRowHeight={() => 'auto'}
            disableColumnFilter
            disableColumnSelector
            processRowUpdate={handleSaveClick}
            disableDensitySelector
            columns={columns}
            initialState={{
              ...data.initialState,
              columns: {
                ...data.initialState?.columns,
                columnVisibilityModel: {
                  id: false,
                },
              },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </Box>

      </div>
    </div>

  );
}
