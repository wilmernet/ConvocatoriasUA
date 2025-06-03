import db from "../../Firebase/FirebaseConfig";
import { collection, query, where, doc, deleteDoc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import Swal from 'sweetalert2'
import "./Area.css";
import { DataContext } from "../../context/DataContext";
import React, { useContext, useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';



function EditToolbar(props) {
  const { setRows, setRowModesModel, lastRow, setLastRow } = props;

  const handleClick = () => {
    const id = lastRow + 1;
    setLastRow(id);
    setRows((oldRows) => [
      ...oldRows,
      { id, area: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'area' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Agregar una nueva Area
      </Button>
    </GridToolbarContainer>
  );
}

const Area = () => {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastRow, setLastRow] = useState(0);
  const [programas, setProgramas] = useState([]);

  const [programa, setPrograma] = useState('');   //AREA
  //const [areas, setAreas] = useState([]);         //AREA

  const { rolFacultad, setRolFacultad } = useContext(DataContext);

  const handleChangeProgram = (event) => {
    setPrograma(event.target.value);
  }

  useEffect(() => {
    const downData = async () => {
      const docRef = doc(db, "usuarioXfacultad", rolFacultad.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fac={ ...docSnap.data(), id: docSnap.id }
        setRolFacultad(fac);
        console.log("Document data:", fac);
      } else {
        console.log("No such document!");
      }
    }
    downData();
  }, [])

  useEffect(() => {
    const downData = async () => {
      console.log(programa);
      
      const docRef = doc(db, "areasXprograma", programa);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const arrayAreas = docSnap.data().areas;
        const arrayObjectAreas = [];
        let i = 0;
        arrayAreas.forEach((area) => {
          // arrayObjectAreas.push({id:area, dato:area})
          arrayObjectAreas.push({ id: i, area: area })
          setLastRow(i);
          i = i + 1;
        })
        console.log(arrayObjectAreas);
        setIsLoading(false);
        setRows(arrayObjectAreas);
      } else {
        console.log("No such document!");
        setRows([]);
        setIsLoading(true);
      }
    }
    downData();
  }, [programa]);

  //-------------- INICIA ACTUALIZACIÓN DE LA BD --------------
  const updateDataBase = (rowsFinish) => {
    try {
      console.log("Filas antes de almacenar");
      console.log(rows);
      const dataUpdate = [];
      rowsFinish.map(row => dataUpdate.push(row.area));
      const upData = async () => {
        const docRef = doc(db, "areasXprograma", programa);
        await updateDoc(docRef, {
          areas: dataUpdate
        });
      }
      upData();
      return true;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal. Por favor, intenta nuevamente.',
      });
      return false;
    }
  }
  //-------------- FINALIZA ACTUALIZACIÓN DE LA BD --------------

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    Swal.fire({
      title: `Seguro desea borrar el Área?`,
      text: "Una vez eliminada no se podrá deshacer la decisión!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, deseo borrarla!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        //-------------- INICIA BORRADO DE LA FILA --------------
        const rowsFinish = rows.filter((row) => row.id !== id);
        setRows(rowsFinish);
        updateDataBase(rowsFinish)
        //----------- FINALIZA BORRADO DE LA FILA --------------
      }
    });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      //-------------- INICIA ACTUALIZACIÓN DE LA FILA --------------
      const rowsFinish = rows.filter((row) => row.id !== id);
      setRows(rowsFinish);
      updateDataBase(rowsFinish)
      //----------- FINALIZA ACTUALIZACIÓN DE LA FILA --------------      
    }
  };

  const processRowUpdate = (newRow) => {
    const repetido = (rows.filter((row) => row.area === newRow.area)); // Valida que no se repitan las áreas
    if (repetido.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops... Algo salió mal',
        // text: `El area ${newRow.area} ya existe.`,
        html: `El area  <b>${newRow.area}</b> ya existe.`,
        // timer: 1500
      });
    } else {
      const updatedRow = { ...newRow, isNew: false };
      //-------------- INICIA ACTUALIZACIÓN DE LA FILA --------------
      const rowsFinish = rows.map((row) => (row.id === newRow.id ? updatedRow : row));
      setRows(rowsFinish);
      updateDataBase(rowsFinish)
      //----------- FINALIZA ACTUALIZACIÓN DE LA FILA --------------
      return updatedRow;
    }
  };


  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'No.',
      type: 'number',
      width: 2,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
    {
      field: 'area',
      headerName: 'AREAS DEL PROGRAMA',
      width: 405,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'ACCIONES',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div style={{ height: "100vh", maxWidth: "100vw", display: "flex", justifyContent: "center" }}>
      <div className="ListadoAreas">
        <Box
          sx={{
            height: 400,
            width: '100%',
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
          }}
        >
          <Typography gutterBottom variant="h5" component="div" sx={{ marginTop: 2, color: "#1876D1" }}>
            Areas de Cada Programa Académico
          </Typography>
          <br />
          <FormControl fullWidth>
            <InputLabel required id="demo-simple-select-label2">Programa</InputLabel>
            <Select
              labelId="demo-simple-select-label2"
              id="demo-simple-select2"
              value={programa}
              label="Programa"
              onChange={handleChangeProgram}
            >
              {console.log(programas)}

              {rolFacultad.programas ? rolFacultad.programas.map((item) => {
                return (<MenuItem value={item} key={item}>{item.toUpperCase()}</MenuItem>)
              }) : <p>Cargando programas</p>}
            </Select>
          </FormControl>
          <br />
          <br />
          {/* {isLoading ? <p>No hay </p> : */}
            <DataGrid
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    // Hide columns status and traderName, the other columns will remain visible
                    id: false,
                  },
                },
              }}
              rows={rows}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              slots={{ toolbar: EditToolbar }}
              slotProps={{
                toolbar: { setRows, setRowModesModel, lastRow, setLastRow },
              }}
            />
          {/* } */}
        </Box>
      </div>
    </div>
  );
}

export default Area;