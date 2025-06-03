//----- fireBase -------
import db from "../../Firebase/FirebaseConfig";
import { collection, query, where, doc, getDoc } from "firebase/firestore";
import { Document, Page, StyleSheet, View, Text, Image } from '@react-pdf/renderer'
import LogoUA from "../../assets/UA.png";
//----------------------

import { format } from "dayjs";
import { useEffect, useState } from 'react';
import printLogoUA from "../../assets/UA.png";
import dayjs from 'dayjs';
// import 'dayjs/locale/es.js';

import Divider from '@mui/material/Divider';
// import { display } from "html2canvas/dist/types/css/property-descriptors/display";

dayjs.locale('es');


const PrintPage = ({ convocatoria }) => {


    // const [pageNumbers, setPageNumbers] = useState(1);
    // const [totalPageNumbers, setTotalPageNumbers] = useState();

    const [data, setData] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [fecha, setFecha] = useState(null);
    const [fecha_insc_inicio, setFecha_insc_inicio] = useState(null);
    const [fecha_insc_fin, setFecha_insc_fin] = useState(null);
    const [fecha_prueba, setFecha_prueba] = useState(null);
    const [hora_prueba, setHora_prueba] = useState(null);
    const [fecha_publicacion, setFecha_publicacion] = useState(null);
    const [cursos, setCursos] = useState([]);

    const [facultadMayuscula, setFacultadMayuscula] = useState("");
    const [programaMayuscula, setProgramaMayuscula] = useState("");
    const [areaMayuscula, setAreaMayuscula] = useState("");
    const [vinculacionMayuscula, setVinculacionMayuscula] = useState("");

    function formatearFecha(date) {
        const dia = date.getDate().toString().padStart(2, '0');
        const mes = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes es base 0
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
    }

    function formatearHora(date) {
        let hora = date.getHours().toString().padStart(2, '0');
        const minutos = date.getMinutes().toString().padStart(2, '0');
        return (hora < 12) ? `${hora}:${minutos} AM` : `${hora - 12}:${minutos} PM`;
    }

    useEffect(() => {
        const downData = async () => {
            const docRef = doc(db, "convocatorias", convocatoria);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data()) {
                setData({ ...docSnap.data() });
                setAreaMayuscula((docSnap.data().area).toUpperCase());
                setFacultadMayuscula((docSnap.data().facultad).toUpperCase());
                setProgramaMayuscula((docSnap.data().programa).toUpperCase());
                setVinculacionMayuscula((docSnap.data().vinculacion).toUpperCase());
                setCursos(docSnap.data().cursos);


                const fecha_convocatoria = new Date(docSnap.data().fecha.seconds * 1000);
                setFecha(formatearFecha(fecha_convocatoria));
                const fecha_incripcion_inicio = new Date(docSnap.data().insc_inicio.seconds * 1000);
                setFecha_insc_inicio(formatearFecha(fecha_incripcion_inicio));

                const fecha_incripcion_fin = new Date(docSnap.data().insc_fin.seconds * 1000);
                setFecha_insc_fin(formatearFecha(fecha_incripcion_fin));
                const fecha_prueba_conv = new Date(docSnap.data().prue_fecha.seconds * 1000);
                setFecha_prueba(formatearFecha(fecha_prueba_conv));
                const hora_prueba_conv = new Date(docSnap.data().prue_fecha.seconds * 1000);
                setHora_prueba(formatearHora(hora_prueba_conv));
                const fecha_publicacion_conv = new Date(docSnap.data().publ_fecha.seconds * 1000);
                setFecha_publicacion(formatearFecha(fecha_publicacion_conv));

                setIsLoading(false);


            } else {
                console.log("No such document!");
            }

        }
        downData();
    }, []);

    { isLoading ? <p>Cargando</p> : <p>Cargando</p> };

    // Estilos
    const styles = StyleSheet.create({
        page: {
            paddingTop: 80,
            paddingBottom: 40,
            paddingHorizontal: 40,
            color: '#666666',
            fontWeight: 'bold',
        },
        header: {
            position: 'absolute',
            top: 20,
            left: 40,
            right: 40,
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        headerLeft: {
            textAlign: 'left',
        },
        headerCenter: {
            textAlign: 'center',
        },
        headerRight: {
            textAlign: 'right',
        },
        content: {
            marginTop: 1,
            fontSize: 12,
            textAlign: 'justify'
        },
        // Tabla
        table: {
            display: 'table',
            width: 'auto',
            marginVertical: 10,
            // borderWidth: 1,
            borderColor: '#000'
        },
        tableRow: {
            flexDirection: 'row'
        },
        tableColCourse: {
            // borderStyle: 'solid',
            // borderColor: '#000',
            // borderWidth: 1,
            padding: 4,
            flex: 2
        },
        tableCol: {
            // borderStyle: 'solid',
            // borderColor: '#000',
            // borderWidth: 1,
            padding: 4,
            flex: 1
        },
        tableHeader: {
            fontWeight: 'bold',
            backgroundColor: '#eee'
        },
        title: {
            fontSize: "4mm",        
            fontWeight: 'bold',
            marginTop: "10px",
            marginBottom: "3px",
            color: '#000',
        },
    });

    return (
        <Document>
            {[1].map((_, index) => (
                <Page key={index} style={styles.page}>
                    {/* Encabezado con numeración */}
                    <View style={{ ...styles.header, borderStyle: "solid", borderWidth: 1, borderColor: "#000", display: "flex", flexDirection: "row" }} fixed>

                        <View style={{ borderRightStyle: "solid", borderRightWidth: 1, borderRightColor: "#000", display: "flex", width: "20%", height: "50px", justifyContent:"center", alignItems:"center" }}>
                            <Image src={LogoUA} alt="" style={{ height: "38px", width: "40px"}} />                                                        
                            <Text style={{ fontSize: "5px", textAlign: "center" }}>UNIVERSIDAD DE LA</Text>
                            <Text style={{ fontSize: "5px", textAlign: "center" }}>AMAZONIA</Text>
                        </View>
                        <View style={{ width: "80%", display: "flex", flexDirection: "column", height: "50px" }}>
                            {/* <View style={{ borderBottomStyle: "solid", borderBottomWidth: 1, borderBottomColor: "#000", width: "100%", height: "50%", display: "flex", alignContent: "center" }}> */}
                            <View style={{ borderBottomStyle: "solid", borderBottomWidth: 1, borderBottomColor: "#000", width: "100%", height: "50%", display: "flex", alignContent: "center", justifyContent: "center"}}>
                                {/* <Text style={{ fontSize: "2px", textAlign: "center" }}> </Text> */}
                                <Text style={{ fontSize: "9px", textAlign: "center" }}>FORMATO CONVOCATORIA CONCURSO MÉRITO DOCENTE</Text>
                                {/* <Text style={{ fontSize: "2px", textAlign: "center" }}> </Text> */}
                            </View>
                            <View style={{ width: "100%", height: "50%", display: "flex", flexDirection: "row" }}>
                                <View style={{ borderRightStyle: "solid", borderRightWidth: 1, borderRightColor: "#000", width: "25%", height: "100%", display: "flex", alignContent: "center", justifyContent: "center"}}>
                                    <Text style={{ fontSize: "8px", fontWeight: "bold", textAlign: "center" }}>CÓDIGO:</Text>
                                    <Text style={{ fontSize: "8px", textAlign: "center" }}>FO-M-DC-18-01</Text>
                                </View>
                                <View style={{ borderRightStyle: "solid", borderRightWidth: 1, borderRightColor: "#000", width: "25%", height: "100%", display: "flex", alignContent: "center", justifyContent: "center"}}>
                                    <Text style={{ fontSize: "8px", fontWeight: "bold", textAlign: "center" }}>VERSIÓN:</Text>
                                    <Text style={{ fontSize: "8px", textAlign: "center" }}>2</Text>
                                </View>
                                <View style={{ borderRightStyle: "solid", borderRightWidth: 1, borderRightColor: "#000", width: "25%", height: "100%", display: "flex", alignContent: "center", justifyContent: "center"}}>
                                    <Text style={{ fontSize: "8px", fontWeight: "bold", textAlign: "center" }}>FECHA:</Text>
                                    <Text style={{ fontSize: "8px", textAlign: "center" }}>2021-09-16</Text>
                                </View>
                                <View style={{ width: "25%", height: "100%", display: "flex", alignContent: "center", justifyContent: "center"}}>
                                    <Text style={{ fontSize: "8px", fontWeight: "bold", textAlign: "center" }}>PÁGINA:</Text>
                                    <Text
                                        style={{ ...styles.headerRight, fontSize: "8px", fontWeight: "bold", textAlign: "center" }}
                                        render={({ pageNumber, totalPages }) =>
                                            `${pageNumber} de ${totalPages}`
                                        }
                                    />

                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Contenido */}
                    <View style={styles.content}>
                        <View style={{ display: "flex", fontWeight: 'bold', flexDirection: "column", textAlign: "center", marginBottom: 0 }}>
                            <Text style={{ fontSize: "5.55mm", color:"#000" }}>CONVOCATORIA No.{data.numero}</Text>
                            <Text style={{ margin: "0px 0px 15px 0px", color:"#000" }}>( {fecha} )</Text>
                        </View>
                        <View >
                            <Text style={{ marginBottom: "10px", textAlign: "justify", display: "flex" }}>
                                LA FACULTAD DE <Text style={{ textDecoration: "underline", fontWeight: "bold", color:"#000" }}>{facultadMayuscula}</Text> CONVOCA A CONCURSO PÚBLICO ABIERTO Y DE MÉRITOS PARA VINCULAR A UN DOCENTE
                                <Text style={{ textDecoration: "underline", fontWeight: "bold", color:"#000" }}> {vinculacionMayuscula} </Text>
                                EN EL PROGRAMA DE
                                <Text style={{ textDecoration: "underline", fontWeight: "bold", color:"#000" }}> {programaMayuscula} </Text>
                                EN EL AREA DE <Text style={{ textDecoration: "underline", fontWeight: "bold", color:"#000" }}> {areaMayuscula} </Text>
                                PARA ORIENTAR:
                            </Text>
                            <View style={{ display: "flex", flexDirection: "column" }}>
                                <View style={{ borderStyle: "solid", borderWidth: 1 }}>

                                    <Text style={{ borderStyle: "solid", borderWidth: 1, borderColor: "#000", display: "flex", flexDirection: "row", backgroundColor: "rgb(206, 206, 206)", textAlign: "center", color:"#000" }}>ÁREA DE DESEMPEÑO</Text>
                                    <View style={styles.table}>

                                        <View style={{...styles.tableRow, color:"#000"}}>
                                            <Text style={[styles.tableColCourse, styles.tableHeader]}>Descripción</Text>
                                            <Text style={[styles.tableCol, styles.tableHeader]}>Intensidad horaria</Text>
                                            <Text style={[styles.tableCol, styles.tableHeader]}>Lugar</Text>
                                        </View>


                                        {

                                            cursos.map((item) => (
                                                <View key={item.id} style={styles.tableRow}>
                                                    <Text style={{ ...styles.tableColCourse, padding: "5px" }}>{item.nombre} [{item.id}]</Text>
                                                    <Text style={{ ...styles.tableCol, textAlign: "center" }}>{item.intensidad}</Text>
                                                    <Text style={styles.tableCol}>Florencia</Text>
                                                </View>
                                            ))
                                        }

                                    </View>
                                </View>
                            </View>

                            <View Style={{ textAlign: "justify", display: "flex", flexDirection: "row" }}>
                                <Text>
                                    <Text style={{ fontWeight: "bold", textDecoration: "underline", color:"#000" }}>
                                        {data.complementaria != '' ? "Labor complementaria: " : ""}
                                    </Text>
                                    {data.complementaria != '' ? "  " + data.complementaria : ""}
                                </Text>
                            </View>

                            <View style={{ margin: "5px 0px" }}>
                                <Text style={styles.title}>
                                    TÍTULO PROFESIONAL REQUERIDO
                                </Text>
                                <View >
                                    <Text style={{ paddingLeft: "20px", textAlign: "justify" }}>
                                        • {data.pregrado}
                                    </Text>
                                </View>

                                <Text style={styles.title}>
                                    ESTUDIOS DE POSGRADO
                                </Text>
                                <View>
                                    <Text style={{ paddingLeft: "20px", textAlign: "justify" }}>
                                        • {data.posgrado}
                                    </Text>
                                </View>
                                <View style={styles.title}>
                                    <Text>
                                        CONOCIMIENTOS ESPECÍFICOS
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{ paddingLeft: "20px", textAlign: "justify" }}>
                                        • {data.conocimientos}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text style={{...styles.title, fontSize: "4mm", fontWeight: "bold" }}>EXPERIENCIA MÍNIMA REQUERIDA (o su equivalente según la normatividad interna vigente)</Text>
                                <View style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                                    <View style={{ display: "flex", flexDirection: "row" }}>
                                        <Text style={{ fontWeight: "bold", marginLeft: "20px" }}>• Docencia Universitaria: {data.expe_docencia}</Text>
                                        <Text style={{ fontWeight: "bold", marginLeft: "20px" }} >• Profesional: {'\t\t'}{data.expe_profesional}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontWeight: "bold", marginLeft: "20px" }}>• Investigación: {data.expe_investigacion}</Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Text style={{...styles.title, fontSize: "4mm", fontWeight: "bold" }}>
                                    COMPETENCIAS REQUERIDAS
                                </Text>
                                <View style={{ paddingLeft: "20px", textAlign: "justify" }}>
                                    <Text style={{ fontWeight: "bold", color:"#000" }}>• Personales:</Text>
                                    <Text style={{ textAlign: "justify", margin: "8px 0px" }}>
                                        {data.comp_personales}
                                    </Text>
                                    <Text style={{ fontWeight: "bold" , color:"#000"}}>• Comportamentales:</Text>
                                    <Text style={{ textAlign: "justify", margin: "8px 0px" }}>
                                        {data.comp_comportamentales}
                                    </Text>
                                    <Text style={{ fontWeight: "bold", color:"#000" }}>• Técnicas:</Text>
                                    <Text style={{ textAlign: "justify", margin: "8px 0px" }}>
                                        {data.comp_tecnicas}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text style={{...styles.title, fontSize: "4mm", fontWeight: "bold" }}>
                                    REQUISITOS MÍNIMOS PARA INSCRIPCIÓN
                                </Text>
                                <Text style={{ textAlign: "justify"}}>
                                    {data.requisitos}
                                </Text>
                            </View>
                            <View>
                                <Text style={{ ...styles.title, fontSize: "4mm", fontWeight: "bold" }}>
                                    INSCRIPCIÓN
                                </Text>
                                <Text style={{ marginLeft: "20px", fontWeight: "bold", marginRight: "10px" }}>Fecha:
                                    Desde el
                                    <Text style={{ textDecoration: "underline" }}> {fecha_insc_inicio} </Text>
                                    hasta el
                                    <Text style={{ textDecoration: "underline" }}> {fecha_insc_fin} </Text>
                                </Text>
                                <Text style={{ marginLeft: "20px" }}><Text style={{ fontWeight: "bold", marginRight: "10px" }}>Lugar: </Text>
                                    {data.insc_lugar}
                                </Text>
                                <Text style={{ marginLeft: "20px" }}><Text style={{ fontWeight: "bold", marginRight: "20px" }}>Hora: </Text>
                                    {data.insc_horario}
                                </Text>
                            </View>
                            <View >
                                <View>
                                    <Text style={{...styles.title, fontSize: "4mm", fontWeight: "bold" }}>
                                        PRUEBA DE CONOCIMIENTO
                                    </Text>
                                    <Text style={{ textAlign: "justify", marginLeft: "20px" }}>
                                        {data.prue_descripcion}
                                    </Text>
                                </View>
                                <View style={{ display: "flex", marginTop: "10px" }}>
                                    <View style={{ marginLeft: "20px" }}>
                                        <Text style={{ fontWeight: "bold", marginRight: "10px" }}>Fecha de la prueba: {fecha_prueba}</Text>
                                    </View>
                                    <div style={{ marginLeft: "20px" }}>
                                        <Text style={{ fontWeight: "bold", marginRight: "10px" }}>Hora: {hora_prueba}</Text>
                                    </div>
                                </View>
                                <View style={{ marginLeft: "20px" }}>
                                    <Text style={{ fontWeight: "bold", marginRight: "10px" }}>Lugar: {data.prue_lugar}</Text>
                                </View>
                            </View>
                            <View >
                                <Text style={{ ...styles.title, fontSize: "4mm", fontWeight: "bold" }}>
                                    PUBLICACIÓN DE RESULTADOS
                                </Text>
                                <Text style={{ textAlign: "justify", marginLeft: "20px" }}>
                                    A partir del
                                    <Text style={{ textDecoration: "underline" }}> {fecha_publicacion} </Text>
                                    en {data.publ_lugar}
                                </Text>
                            </View>
                            <View >
                                <View style={{ display: "flex", alignItems: "center", marginTop: "80px", flexDirection: "column" }}>
                                    <Text style={{ fontSize: "10px" }}>Rector <Text style={{color:"#000"}}>{data.rector}</Text> </Text>
                                    <View style={{ display: "inline", justifyContent: "center" }}>
                                        <Text style={{ marginLeft: "5px" }}>{data.rector_encargado}</Text>
                                    </View>
                                </View>
                                <Text style={{ marginTop: "20px" }}>Revisado por:</Text>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "60px", textAlign: "center" }}>
                                    <View style={{ width: "50%" }}>
                                        <View style={{ display: "inline", justifyContent: "center" }}>
                                            <Text style={{ margin: "0px", fontSize: "10px" }}>Decano <Text styles={{color:"#000"}}>{data.decano}</Text> </Text>
                                            <Text style={{ marginLeft: "5px" }}>{data.decano_encargado}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: "50%" }}>
                                        <View style={{ display: "inline", justifyContent: "center" }}>
                                            <Text style={{ margin: "0px", fontSize: "10px" }}>Vicerrector Académico <Text styles={{color:"#000"}}>{data.vicerector}</Text> </Text>
                                            <Text style={{ marginLeft: "5px" }}>{data.vicerector_encargado}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </View>
                </Page>
            ))}
        </Document>




        // <Document>


        // {
        //     (data.complementaria?<div style={{ margin: "5px", textAlign: "justify" }}><Divider></Divider><span style={{ fontWeight: "bold" }}>Labor Complementaria:</span> {data.complementaria}</div>:"")
        // }
        // </div>



        // <div >
        //     <div style={{ display: "flex", alignItems: "center", marginTop: "80px", flexDirection: "column" }}>
        //         <div style={{ fontSize: "0.8rem" }}>Rector {data.rector}</div>
        //         <div style={{ display: "inline", justifyContent: "center" }}>
        //             <span style={{ marginLeft: "5px" }}>{data.rector_encargado}</span>
        //         </div>
        //     </div>
        //     <p style={{ marginTop: "20px" }}>Revisado por:</p>
        //     <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "80px", textAlign: "center" }}>
        //         <div style={{ width: "50%" }}>
        //             <div style={{ display: "inline", justifyContent: "center" }}>
        //                 <p style={{ margin: "0px", fontSize: "0.8rem" }}>Decano {data.decano}</p>
        //                 <span style={{ marginLeft: "5px" }}>{data.decano_encargado}</span>
        //             </div>
        //         </div>
        //         <div style={{ width: "50%" }}>
        //             <div style={{ display: "inline", justifyContent: "center" }}>
        //                 <p style={{ margin: "0px", fontSize: "0.8rem" }}>Vicerrector Académico {data.vicerector}</p>
        //                 <span style={{ marginLeft: "5px" }}>{data.vicerector_encargado}</span>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        //                 </div >
        //             </div >
        //         </div >
        //     </div >
        // </>
    )

}

export default PrintPage