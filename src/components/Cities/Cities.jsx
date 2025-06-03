import { DataContext } from "../../context/DataContext";
import React, { useContext, useState, useEffect } from 'react';

import Swal from 'sweetalert2'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { GridToolbar } from '@mui/x-data-grid';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import db from "../../Firebase/FirebaseConfig";
import { collection, query, arrayUnion, arrayRemove, where, doc, deleteDoc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import "./Cities.css";

function EditToolbar(props) {
    const { setRows, setRowModesModel, rows, rolFacultad } = props;

    const handleClick = () => {
        const idInput = async () => {
            try {
                console.log(rolFacultad.facultad);
                const inputValue = "";
                const { value: cod } = await Swal.fire({
                    title: `Ingrese la nueva ciudad donde oferta cursos la Facultad de ${rolFacultad.facultad}`,
                    inputLabel: "Recuerde que el nombre de la Ciudad no puede repetirse",
                    input: "text",
                    inputValue,
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Continuar",
                    inputValidator: (cod) => {
                        if (!cod) {
                            return "Debe ingresar el nombre de la Ciudad para continuar!";
                        } else {
                            const repetido = (rows.filter((row) => row.id === cod));
                            if (repetido.length > 0) {
                                return `Ya existe una Ciudad con ese Nombre ${cod} !`;
                            }
                        }
                    }
                });
                if (cod) {
                    const id = cod;
                    setRows((oldRows) => [
                        ...oldRows,
                        { id, nombre: id, isNew: true },
                    ]);
                    setRowModesModel((oldModel) => ({
                        ...oldModel,
                        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nombre' },
                    }));
                }
            } catch (error) {
                console.error("Error al agregar la Ciudad:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal. Por favor, intenta nuevamente.',
                });
            }
        }
        idInput();
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Agregar una nueva Ciudad
            </Button>
        </GridToolbarContainer>
    );
}

const Cities = () => {
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { rolFacultad } = useContext(DataContext);

    useEffect(() => {
        const downData = async () => {
            const docRef = doc(db, "usuarioXfacultad", rolFacultad.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const listado = [...docSnap.data().ciudades];
                const ciudadesEncontradas = [];
                listado.forEach((ciudad) => {
                    ciudadesEncontradas.push({ id: ciudad, nombre: ciudad });
                });
                setRows(ciudadesEncontradas);
            } else {
                console.log("No such document!");
            };
            setIsLoading(false);
        }
        downData();
        console.log(rows);        
    }, []);

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, facultad: rolFacultad.id, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {

        Swal.fire({
            title: `Seguro desea borrar la Ciudad ${id}?`,
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
                const upData = async () => {                    
                    const registro = doc(db, "usuarioXfacultad", rolFacultad.id);
                    await updateDoc(registro, {
                        ciudades: arrayRemove(id)  // Elimina automáticamente el nuevo programa al arreglo de programas en el documento
                    });
                }
                upData();
                setRows(rows.filter((row) => row.id !== id));
                Swal.fire({
                    position: "center-center",
                    icon: "success",
                    title: "Eliminado!",
                    text: `La ciudad ${id} fue eliminada con éxito!`,
                    showConfirmButton: false,
                    timer: 1500
                });
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
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        //-------------- INICIA ALMACENAMIENTO DE LA FILA --------------
        const upData = async () => {
            if (newRow.nombre) {
                const registro = doc(db, "usuarioXfacultad", rolFacultad.id);                
                await updateDoc(registro, {
                    ciudades: arrayUnion(newRow.nombre)  // Agrega automáticamente el nuevo programa al arreglo de programas en el documento
                });
                Swal.fire({
                    position: "center-center",
                    icon: "success",
                    title: "Ciudad guardada con éxito!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    html: `Se presentó un problema, el campo: <br><b>Ciudad</b><br>es obligatorio`,
                });
            }
        }
        upData();
        //----------- FINALIZA ALMACENAMIENTO DE LA FILA --------------
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        {
            field: 'id',
            headerName: 'Código',
            type: 'number',
            width: 100,
            align: 'left',
            headerAlign: 'left',
            editable: false,
        },
        {
            field: 'nombre',
            headerName: 'Ciudad',
            width: 480,
            editable: true
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Acciones',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Guardar"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancelar"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Editar"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Borrar"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <div style={{ height: "100vh", maxWidth: "100vw", display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", maxWidth: "60%" }}>
                <Box
                    sx={{
                        height: 500,
                        width: '100%',
                        '& .actions': {
                            color: 'text.secondary',
                        },
                        '& .textPrimary': {
                            color: 'text.primary',
                        },
                    }}
                >
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: "#1876D1" }}>
                        Ciudades en las que oferta cursos la facultad de {rolFacultad.facultad}
                    </Typography>
                    <br />
                    {isLoading ? <p>Cargando...</p> :
                        <DataGrid
                            initialState={{
                                ...rows.initialState,
                                columns: {
                                    ...rows.initialState?.columns,
                                    columnVisibilityModel: {
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
                                toolbar: { setRows, setRowModesModel, rows, rolFacultad },
                            }}

                        />}
                </Box>
            </div>

        </div>

    );
}

export default Cities;