//----- fireBase -------
import db from "../../Firebase/FirebaseConfig";
import { collection, query, where, doc, getDoc } from "firebase/firestore";
//----------------------

import { format } from "dayjs";
import { useEffect, useState } from 'react';
import printLogoUA from "../../assets/UA.png";
import dayjs from 'dayjs';
// import 'dayjs/locale/es.js';

import GeneratePDF from "../GeneratePDF/GeneratePDF";

import Divider from '@mui/material/Divider';

dayjs.locale('es');


const PrintPageOriginal = ({ convocatoria }) => {

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
        return (hora<12)?`${hora}:${minutos} AM`:`${hora-12}:${minutos} PM`;
    }

    useEffect(() => {
        const downData = async () => {
            const docRef = doc(db, "convocatorias", convocatoria);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setData({ ...docSnap.data() });

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
                setFacultadMayuscula((docSnap.data().facultad).toUpperCase());
                setProgramaMayuscula((docSnap.data().programa).toUpperCase());
                setAreaMayuscula((docSnap.data().area).toUpperCase());
                setAreaMayuscula((docSnap.data().area).toUpperCase());
                setVinculacionMayuscula((docSnap.data().vinculacion).toUpperCase());
                setCursos(docSnap.data().cursos);

            } else {
                console.log("No such document!");
            }

        }
        downData();
    }, []);

    { isLoading ? <p>Cargando</p> : <p>Cargando</p> };
    return (
        <>
            <div>
                <GeneratePDF htmlElementId="myContent" header="Mi Reporte" footer="Página {pageNumber} de {totalPages}" />
                <div id="myContent">
                    {/* ------------------------------------------------------------------------------------- */}
                    <div style={{
                        border: "solid red",
                        fontFamily: "Arial",
                        fontSize: "3.85mm",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <div style={{
                            width: "216mm",
                            height: "297mm",
                            padding: "0mm 20mm 30mm 20mm"
                        }}>
                            <div style={{ display: "flex" }}>
                                <div style={{ display: "flex", width: "100%", border: "0.1px solid black" }}>
                                    <div style={{ border: "0.1px solid black", width: "15%", flexDirection: "column", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <img src={printLogoUA} alt="" style={{ height: "40px" }} />
                                        <span style={{ fontSize: "7px", textAlign: "center" }}>UNIVERSIDAD DE LA<br />AMAZONIA</span>
                                    </div>
                                    <div style={{ border: "0.1px solid black", width: "85%" }}>
                                        <div style={{ justifyContent: "center", height: "25px", display: "flex", width: "100%", alignItems: "center" }}>
                                            FORMATO CONVOCATORIA CONCURSO MÉRITO DOCENTE
                                        </div>
                                        <div style={{ borderTop: "solid 0.1px black", display: "flex", height: "40px" }}>
                                            <div style={{ borderRight: "solid 0.1px black", width: "25%", textAlign: "center" }}>
                                                <p style={{ margin: "2px" }}><span style={{ fontWeight: "bold" }}>CÓDIGO:</span><br />FO-M-DC-18-01</p>
                                            </div>
                                            <div style={{ borderRight: "solid 0.1px black", width: "25%", textAlign: "center" }}>
                                                <p style={{ margin: "2px" }}><span style={{ fontWeight: "bold" }}>VERSIÓN:</span><br />2</p>
                                            </div>
                                            <div style={{ borderRight: "solid 0.1px black", width: "25%", textAlign: "center" }}>
                                                <p style={{ margin: "2px" }}><span style={{ fontWeight: "bold" }}>FECHA:</span><br />2021-09-16</p>
                                            </div>
                                            <div style={{ width: "25%", textAlign: "center" }}>
                                                <p style={{ margin: "2px" }}><span style={{ fontWeight: "bold" }}>PÁGINA:</span><br />1 de 2</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                                <p style={{ fontSize: "5.55mm", fontWeight: "bold", marginTop: "15px" }}>CONVOCATORIA No.{data.numero}</p>
                                {/* <p style={{ margin: "0px 0px 15px 0px" }}>( _______{fecha}_________ )</p> */}

                            </div>
                            <div>
                                <p style={{ marginBottom: "20px", textAlign: "justify" }}>
                                    LA FACULTAD DE
                                    <span style={{ textDecoration: "underline", fontWeight: "bold" }}> {facultadMayuscula} </span>
                                    {/* <span style={{ textDecoration: "underline", fontWeight: "bold" }}> {data.facultad} </span> */}
                                    CONVOCA A CONCURSO PÚBLICO ABIERTO Y DE MÉRITOS PARA VINCULAR A UN DOCENTE
                                    {/* <span style={{ textDecoration: "underline", fontWeight: "bold" }}> {data.vinculacion.toUpperCase()} </span> */}
                                    <span style={{ textDecoration: "underline", fontWeight: "bold" }}> {vinculacionMayuscula} </span>
                                    EN EL PROGRAMA DE
                                    {/* <span style={{ textDecoration: "underline", fontWeight: "bold" }}> {data.programa.toUpperCase()} </span> */}
                                    <span style={{ textDecoration: "underline", fontWeight: "bold" }}> {programaMayuscula} </span>
                                    EN EL AREA DE
                                    {/* <span style={{ textDecoration: "underline", fontWeight: "bold" }}> {data.area.toUpperCase()} </span> */}
                                    <span style={{ textDecoration: "underline", fontWeight: "bold" }}> {areaMayuscula} </span>
                                    PARA ORIENTAR:
                                </p>                                
                            </div>
                            <div style={{ border: "0.1px solid black", padding: "0" }}>
                                <p style={{ borderBottom: "solid 0.1px", textAlign: "center", margin: "0", backgroundColor: "rgb(206, 206, 206)" }}>ÁREA DE DESEMPEÑO</p>
                                <table>
                                    <thead >
                                        <tr>
                                            <th style={{ width: "65%", borderBottom: "solid 1px gray", fontSize:"0.8rem" }}>Descripción</th>
                                            <th style={{ width: "20%", borderBottom: "solid 1px gray", fontSize:"0.8rem" }}>Intensidad Horaria</th>
                                            <th style={{ width: "20%", borderBottom: "solid 1px gray", fontSize:"0.8rem" }}>Lugar</th>
                                        </tr>                                    
                                    </thead>
                                    {/* <thead ><th><Divider></Divider></th><th><Divider></Divider></th><th><Divider></Divider></th></thead> */}
                                    <tbody>
                                        {cursos.map((item) => (
                                        <tr key={item.id}>
                                            <td><li style={{ padding: "5px" }}>{item.nombre} [{item.id}]</li></td>
                                            <td style={{ textAlign: "center" }}>{item.intensidad}</td>
                                            <td>Florencia</td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {
                                    (data.complementaria?<div style={{ margin: "5px", textAlign: "justify" }}><Divider></Divider><span style={{ fontWeight: "bold" }}>Labor Complementaria:</span> {data.complementaria}</div>:"")
                                }
                            </div>
                            <div style={{ margin: "15px 0px" }}>
                                <p style={{ fontSize: "4mm", fontWeight: "bold", marginTop: "15px", marginBottom: "8px" }}>
                                    TÍTULO PROFESIONAL REQUERIDO
                                </p>
                                <div >
                                    <ul style={{ paddingLeft: "20px", textAlign: "justify" }}>
                                        <li>
                                            {data.pregrado}
                                        </li>
                                    </ul>
                                </div>
                                <p style={{ fontSize: "4mm", fontWeight: "bold", marginTop: "15px", marginBottom: "8px" }}>
                                    ESTUDIOS DE POSGRADO
                                </p>
                                <div>
                                    <ul style={{ paddingLeft: "20px", marginLeft: "0px", textAlign: "justify" }}>
                                        <li>
                                            {data.posgrado}
                                        </li>
                                    </ul>
                                </div>
                                <p style={{ fontSize: "4mm", fontWeight: "bold", marginTop: "15px", marginBottom: "8px" }}>
                                    CONOCIMIENTOS ESPECÍFICOS
                                </p>
                                <div>
                                    <ul style={{ paddingLeft: "20px", textAlign: "justify" }}>
                                        <li>
                                            {data.conocimientos}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div style={{ margin: "15px 0px" }}>
                                <p><span style={{ fontSize: "4mm", fontWeight: "bold", marginTop: "15px", marginBottom: "8px" }}>EXPERIENCIA MÍNIMA REQUERIDA</span> (o su equivalente según la normatividad interna vigente)</p>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        <span style={{ fontWeight: "bold", marginLeft: "20px" }}>Docencia Universitaria:</span> {data.expe_docencia}
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: "bold" }} >Profesional:</span> {data.expe_profesional}
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: "bold" }}>Investigación:</span> {data.expe_investigacion}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p style={{ fontSize: "4mm", fontWeight: "bold", marginTop: "15px", marginBottom: "8px" }}>
                                    COMPETENCIAS REQUERIDAS
                                </p>
                                <div>
                                    <ul style={{ paddingLeft: "20px", textAlign: "justify" }}>
                                        <li style={{ fontWeight: "bold" }}>Personales:</li>
                                        <p style={{ textAlign: "justify", margin: "8px 0px" }}>
                                            {data.comp_personales}
                                        </p>
                                        <li style={{ fontWeight: "bold" }}>Comportamentales:</li>
                                        <p style={{ textAlign: "justify", margin: "8px 0px" }}>
                                            {data.comp_comportamentales}
                                        </p>
                                        <li style={{ fontWeight: "bold" }}>Técnicas:</li>
                                        <p style={{ textAlign: "justify", margin: "8px 0px" }}>
                                            {data.comp_tecnicas}
                                        </p>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <p style={{ fontSize: "4mm", fontWeight: "bold", marginTop: "15px", marginBottom: "8px" }}>
                                    REQUISITOS MÍNIMOS PARA INSCRIPCIÓN
                                </p>

                                <pre style={{ textAlign: "justify", margin: "8px 0px", fontFamily: "Arial" }}>
                                    {data.requisitos}
                                </pre>

                            </div>
                            <div>
                                <p style={{ fontSize: "4mm", fontWeight: "bold", marginTop: "15px", marginBottom: "8px" }}>
                                    INSCRIPCIÓN
                                </p>
                                <div style={{ marginLeft: "20px" }}><span style={{ fontWeight: "bold", marginRight: "10px" }}>Fecha:</span>
                                    Desde el
                                    <span style={{ textDecoration: "underline" }}> {fecha_insc_inicio} </span>
                                    hasta el
                                    <span style={{ textDecoration: "underline" }}> {fecha_insc_fin} </span>
                                </div>
                                <div style={{ marginLeft: "20px" }}><span style={{ fontWeight: "bold", marginRight: "10px" }}>Lugar:</span>
                                    {data.insc_lugar}
                                </div>
                                <div style={{ marginLeft: "20px" }}><span style={{ fontWeight: "bold", marginRight: "20px" }}>Hora:</span>
                                    {data.insc_horario}
                                </div>
                            </div>
                            <div >
                                <div>
                                    <p style={{ fontSize: "4mm", fontWeight: "bold", marginTop: "15px", marginBottom: "8px" }}>
                                        PRUEBA DE CONOCIMIENTO
                                    </p>
                                    <p style={{ textAlign: "justify", marginLeft: "20px" }}>
                                        {data.prue_descripcion}
                                    </p>
                                </div>
                                <div style={{ display: "flex", marginTop: "10px" }}>
                                    <div style={{ marginLeft: "20px" }}>
                                        <span style={{ fontWeight: "bold", marginRight: "10px" }}>Fecha de la prueba:</span> {fecha_prueba}
                                    </div>
                                    <div style={{ marginLeft: "20px" }}>
                                        <span style={{ fontWeight: "bold", marginRight: "10px" }}>Hora:</span> {hora_prueba} 

                                    </div>
                                </div>
                                <div style={{ marginLeft: "20px" }}>
                                    <span style={{ fontWeight: "bold", marginRight: "10px" }}>Lugar:</span> {data.prue_lugar}
                                </div>
                            </div>
                            <div >
                                <p style={{ fontSize: "4mm", fontWeight: "bold", marginTop: "15px", marginBottom: "8px" }}>
                                    PUBLICACIÓN DE RESULTADOS
                                </p>
                                <p style={{ textAlign: "justify", marginLeft: "20px" }}>
                                    A partir del
                                    <span style={{ textDecoration: "underline" }}> {fecha_publicacion} </span>
                                    en {data.publ_lugar}
                                </p>
                            </div>
                            <div >
                                <div style={{ display: "flex", alignItems: "center", marginTop: "80px", flexDirection: "column" }}>
                                    <div style={{ fontSize: "0.8rem" }}>Rector {data.rector}</div>
                                    <div style={{ display: "inline", justifyContent: "center" }}>
                                        <span style={{ marginLeft: "5px" }}>{data.rector_encargado}</span>
                                    </div>
                                </div>
                                <p style={{ marginTop: "20px" }}>Revisado por:</p>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "80px", textAlign: "center" }}>
                                    <div style={{ width: "50%" }}>
                                        <div style={{ display: "inline", justifyContent: "center" }}>
                                            <p style={{ margin: "0px", fontSize: "0.8rem" }}>Decano {data.decano}</p>
                                            <span style={{ marginLeft: "5px" }}>{data.decano_encargado}</span>
                                        </div>
                                    </div>
                                    <div style={{ width: "50%" }}>
                                        <div style={{ display: "inline", justifyContent: "center" }}>
                                            <p style={{ margin: "0px", fontSize: "0.8rem" }}>Vicerrector Académico {data.vicerector}</p>
                                            <span style={{ marginLeft: "5px" }}>{data.vicerector_encargado}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div >
                </div >
            </div >
        </>
    )

}

export default PrintPageOriginal