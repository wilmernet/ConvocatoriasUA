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
import { collection, query, where, doc, deleteDoc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";


function EditToolbar(props) {
    const { setRows, setRowModesModel, rows } = props;

    const handleClick = () => {

        const idInput = async () => {
            try {
                const inputValue = "";
                const { value: cod } = await Swal.fire({
                    title: "Ingrese el Código del Curso",
                    input: "number",
                    inputLabel: "Recuerde que el Código es un número que no puede repetirse",
                    inputValue,
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Continuar",
                    inputValidator: (cod) => {
                        if (!cod) {
                            return "Debe ingresar el Código para continuar!";
                        } else {
                            const repetido = (rows.filter((row) => row.id === cod));
                            if (repetido.length > 0) {
                                return `Ya existe un curso con el código ${cod} !`;
                            }
                        }
                    }
                });
                if (cod) {
                    const id = cod;
                    setRows((oldRows) => [
                        ...oldRows,
                        { id, nombre: '', intensidad: '', facultad: '', isNew: true },
                    ]);
                    setRowModesModel((oldModel) => ({
                        ...oldModel,
                        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'nombre' },
                    }));
                }
            } catch (error) {
                console.error("Error al agregar la fila:", error);
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
                Agregar un nuevo curso
            </Button>
        </GridToolbarContainer>
    );
}

const Course = ({ facultad }) => {
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { rolFacultad } = useContext(DataContext);
    useEffect(() => {
        const downData = async () => {
            const q = query(collection(db, "cursos"), where("facultad", "==", rolFacultad.id));
            const querySnapshot = await getDocs(q);
            const cursosEncontrados = [];
            querySnapshot.forEach((doc) => {
                cursosEncontrados.push({ ...doc.data(), id: doc.id })
            });
            // console.log(cursosEncontrados);
            setRows(cursosEncontrados);
            setIsLoading(false);
        }
        downData();
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
            title: `Seguro desea borrar el curso ${id}?`,
            text: "Una vez eliminado no se podrá deshacer la decisión!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, deseo borrarlo!",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                //-------------- INICIA BORRADO DE LA FILA --------------
                const upData = async () => {
                    await deleteDoc(doc(db, "cursos", id));
                }
                upData();
                setRows(rows.filter((row) => row.id !== id));
                Swal.fire({
                    position: "center-center",
                    icon: "success",
                    title: "Eliminado!",
                    text: `El curso ${id} fue eliminado con éxito!`,
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
            if (newRow.nombre && newRow.intensidad) {
                await setDoc(doc(db, "cursos", newRow.id), { facultad: rolFacultad.id, nombre: newRow.nombre, intensidad: newRow.intensidad });  // para salvar una convocatoria gral
                Swal.fire({
                    position: "center-center",
                    icon: "success",
                    title: "Curso guardado con éxito!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    html: `Se presentó un problema, los campos: <br><b>Nombre del Curso</b> e <b>intensidad Horaria</b> <br>son obligatorios`,
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
            headerName: 'Nombre del Curso',
            width: 480,
            editable: true
        },
        {
            field: 'intensidad',
            headerName: 'Intensidad Horaria',
            type: 'number',
            align: 'center',
            width: 140,
            editable: true,
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
            <div style={{ display: "flex", justifyContent: "center", maxWidth: "90%" }}>
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
                        Cursos Ofertados por la Facultad
                    </Typography>
                    <br />
                    {isLoading ? <p>Cargando...</p> :
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            editMode="row"
                            rowModesModel={rowModesModel}
                            onRowModesModelChange={handleRowModesModelChange}
                            onRowEditStop={handleRowEditStop}
                            processRowUpdate={processRowUpdate}
                            slots={{ toolbar: EditToolbar }}
                            slotProps={{
                                toolbar: { setRows, setRowModesModel, rows },
                            }}

                        />}
                </Box>
            </div>
        </div>
    );
}

export default Course;