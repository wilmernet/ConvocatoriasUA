import { Document, Page, View, Text, Image } from "@react-pdf/renderer";

//----- fireBase -------
import db from "../../Firebase/FirebaseConfig";
import { collection, query, where, doc, getDoc } from "firebase/firestore";
//----------------------

import { format } from "dayjs";
import { useEffect, useState } from 'react';
import printLogoUA from "../../assets/UA.png";


const PrintPageCeatePDF = () => {

    const [convocatoria, setConvocatoria] = useState([])
    const [fecha, setFecha] = useState("")

    useEffect(() => {
        const q = query(collection(db, "convocatoria"));
        const downData = async () => {
            const docRef = doc(db, "convocatoria", "053-2024");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setConvocatoria(docSnap.data());
                // const formatted = dayjs(convocatoria.fecha.toDate()).format('DD/MM/YYYY');
                // setFecha(formatted);
                console.log(fecha);

            }
        }
        downData();
        console.log(convocatoria);

    }, []);

    return (
        <Document>
            <Page size="letter">
            <View style={{
            border: "solid red",
            // fontFamily: "Arial", 
            fontSize: "3.85mm",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            }}>
                <View style={{
                width: "216mm",
                height: "297mm",
                padding: "0mm 20mm 30mm 20mm"
                }}>
                    <View style={{display: "flex"}}>
                        <View style={{display: "flex", width: "100%", border: "0.1px solid black"}}>                        
                            <View style={{border: "0.1px solid black", width: "15%", flexDirection: "column", display:"flex", justifyContent: "center", alignItems: "center"}}>
                                <Image src={printLogoUA} alt="" style={{height: "40px"}}/>
                                <Text style={{fontSize: "7px", textAlign: "center"}}>UNIVERSIDAD DE LA<br/>AMAZONIA</Text>
                            </View>                        
                            <View style={{border: "0.1px solid black", width: "85%"}}>                            
                                <View style={{justifyContent: "center", height: "25px",display: "flex", width:"100%", alignItems: "center"}}>
                                    FORMATO CONVOCATORIA CONCURSO MÉRITO DOCENTE
                                </View>
                                <View style={{borderTop: "solid 0.1px black", display: "flex", height: "35px"}}>
                                    <View style={{borderRight: "solid 0.1px black", width: "25%", textAlign: "center"}}>
                                        <Text style={{fontWeight: "bold"}}>CÓDIGO:</Text>
                                        <Text>FO-M-DC-18-01</Text>
                                    </View> 
                                    <View style={{borderRight: "solid 0.1px black", width: "25%", textAlign: "center"}}>
                                        <Text style={{fontWeight: "bold"}}>VERSIÓN:</Text>                             
                                        <Text>2</Text>
                                    </View>
                                    <View style={{borderRight: "solid 0.1px black", width: "25%", textAlign: "center"}}>
                                        <Text style={{fontWeight: "bold"}}>FECHA:</Text>
                                        <Text>2021-09-16</Text>                            
                                    </View>
                                    <View style={{width: "25%", textAlign: "center"}}>
                                        <Text style={{fontWeight: "bold"}}>PÁGINA:</Text>                             
                                        <Text>2021-09-16</Text>                            
                                    </View>
                                </View>        
                            </View>
                        </View>
                    </View>

                    <View style={{display: "flex", flexDirection: "column", textAlign: "center"}}>
                        <Text style={{fontSize: "5.55mm", fontWeight: "bold", marginTop: "15px"}}>CONVOCATORIA No.{convocatoria.numero}</Text>
                        <Text style={{margin: "0px 0px 15px 0px"}}>( ____________ )</Text>                      
                        {/* -------------------------------------------------------- */}                    
                    </View>
                    <View>
                        <Text style={{marginBottom: "20px", textAlign: "justify"}}>
                            LA FACULTAD DE 
                            <Text style={{textDecoration: "underline", fontWeight: "bold"}}> {convocatoria.facultad} </Text> 
                            CONVOCA A CONCURSO PÚBLICO ABIERTO Y DE MÉRITOS PARA VINCULAR A UN DOCENTE 
                            <Text style={{textDecoration: "underline", fontWeight: "bold"}}> {convocatoria.vinculacion} </Text>
                            EN EL PROGRAMA DE 
                            <Text style={{textDecoration: "underline", fontWeight: "bold"}}> {convocatoria.programa} </Text>
                            EN EL AREA DE
                            <Text style={{textDecoration: "underline", fontWeight: "bold"}}> {convocatoria.area} </Text>
                            PARA ORIENTAR:
                        </Text>
                    </View> 
                    <View style={{border: "0.1px solid black", padding: "0"}}>
                        <Text  style={{borderBottom: "solid 0.1px", textAlign: "center",  margin: "0", backgroundColor: "rgb(206, 206, 206)"}}>ÁREA DE DESEMPEÑO</Text>
                        {/* <table>
                            <thead >
                                <tr>
                                    <th style={{width: "60%"}}>Descripción</th>
                                    <th style={{width: "20%"}}>Intensidad Horaria</th>
                                    <th style={{width: "20%"}}>Lugar</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><li style={{padding: "5px"}}>Este es un curso con un nombre muy largo que deseo probar para verificar que todo queda muy bien</li></td>
                                    <td style={{textAlign: "center"}}>64</td>
                                    <td>Florencia</td>                        
                                </tr>                    
                                <tr>
                                    <td><li style={{padding: "5px"}}>Este es un curso con un nombre muy largo que deseo probar para verificar que todo queda muy bien</li></td>
                                    <td style={{textAlign: "center"}}>64</td>
                                    <td>Florencia</td>                                                
                                </tr>
                            </tbody>
                        </table>                         */}
                        <View style={{margin: "5px", textAlign: "justify"}}><Text style={{fontWeight: "bold"}}>{convocatoria.observacion}:</Text> {convocatoria.complementaria}</View>
                    </View>
                    <View >
                        <View>
                            <Text style={{fontSize: "4mm",fontWeight: "bold",marginTop: "15px",marginBottom: "8px"}}>
                                TÍTULO PROFESIONAL REQUERIDO
                            </Text>
                            <Text style={{fontSize: "4mm",fontWeight: "bold",marginTop: "15px",marginBottom: "8px"}}>
                                TÍTULO PROFESIONAL REQUERIDO
                            </Text>
                            <View>
                                <ul style={{marginLeft: "20px", textAlign: "justify"}}>
                                    <li>
                                        {convocatoria.pregrado}
                                    </li>
                                </ul>
                            </View>
                            <Text style={{fontSize: "4mm",fontWeight: "bold",marginTop: "15px",marginBottom: "8px"}}>
                                ESTUDIOS DE POSGRADO
                            </Text>
                            <View>
                                <ul style={{marginLeft: "20px", textAlign: "justify"}}>
                                    <li>
                                        {convocatoria.posgrado}
                                    </li>
                                </ul>
                            </View>
                            <Text style={{fontSize: "4mm",fontWeight: "bold",marginTop: "15px",marginBottom: "8px"}}>
                                CONOCIMIENTOS ESPECÍFICOS
                            </Text>
                            <View>
                                <ul style={{marginLeft: "20px", textAlign: "justify"}}>
                                    <li>
                                        {convocatoria.conocimientos}
                                    </li>
                                </ul>
                            </View>
                        </View>  
                    </View>
                    <View style={{margin: "15px 0px"}}>
                        <Text><Text style={{fontSize: "4mm",fontWeight: "bold",marginTop: "15px",marginBottom: "8px"}}>EXPERIENCIA MÍNIMA REQUERIDA</Text> (o su equivalente según la normatividad interna vigente)</Text>
                        <View style={{display: "flex", justifyContent: "space-between"}}>
                            <View style={{marginTop: "15px", marginLeft: "20px"}}>
                                <Text style={{fontWeight: "bold"}}>Docencia Universitaria:</Text> 1 año
                            </View>
                            <View style={{marginTop: "15px"}}>
                                <Text style={{fontWeight: "bold"}} >Profesional:</Text> 2 años 
                            </View>
                            <View style={{marginTop: "15px"}}>
                                <Text style={{fontWeight: "bold"}}>Investigación:</Text> -0- 
                            </View>
                        </View>
                    </View>
                    <View>
                    <Text style={{fontSize: "4mm",fontWeight: "bold",marginTop: "15px",marginBottom: "8px"}}>
                        COMPETENCIAS REQUERIDAS
                    </Text>
                        <View>
                            <ul style={{marginLeft: "20px", textAlign: "justify"}}>
                                <li style={{fontWeight: "bold"}}>Personales:</li>
                                    <Text style={{textAlign: "justify", margin: "8px 0px"}}>
                                        {convocatoria.comp_personales}
                                    </Text> 
                                <li style={{fontWeight: "bold"}}>Comportamentales:</li>
                                    <Text style={{textAlign: "justify", margin: "8px 0px"}}>
                                        {convocatoria.comp_comportamentales}
                                    </Text> 
                                <li style={{fontWeight: "bold"}}>Técnicas:</li>
                                    <Text style={{textAlign: "justify", margin: "8px 0px"}}>
                                        {convocatoria.comp_tecnicas}                                    
                                    </Text>
                            </ul>                             
                        </View>                
                    </View>    
                    <View>
                        <Text style={{fontSize: "4mm",fontWeight: "bold",marginTop: "15px",marginBottom: "8px"}}>
                            REQUISITOS MÍNIMOS PARA INSCRIPCIÓN
                        </Text>
                        <View>
                            <ol style={{marginLeft: "40px"}}>
                                <li style={{textAlign: "justify"}}>Ser ciudadano colombiano o extranjero con permiso de trabajo. </li>
                                <li style={{textAlign: "justify"}}>Hoja de Vida en formato único de la Función Pública, actualizada y foliada con los siguientes soportes:</li>
                                <ul style={{textAlign: "justify"}}>
                                    <li style={{textAlign: "justify"}}>Fotocopia de la cédula de ciudadanía </li>
                                    <li style={{textAlign: "justify"}}>Fotocopia de la Tarjeta profesional (en aquellos casos en los que es requisito para el ejercicio de la profesión)</li>
                                    <li style={{textAlign: "justify"}}>Fotocopia de las ACTAS DE GRADO y DIPLOMAS</li>
                                    <li style={{textAlign: "justify"}}>Constancias de trabajo especificando el cargo laboral desempeñado y el tiempo de servicio (fecha de inicio y terminación).</li>
                                </ul>
                                <li style={{textAlign: "justify"}}>Manifestación bajo Gravedad de Juramento de no estar incurso en inhabilidades o incompatibilidades para ocupar el cargo.</li>
                                <li style={{textAlign: "justify"}}>Certificado de vigencia de la tarjeta o registro profesional.</li>
                                <li style={{textAlign: "justify"}}>Entrega del formato FO-M-DC-18-02, mediante el cual se autoriza a la Universidad de la Amazonia para realizar la notificación electrónica y/o por el portal web institucional del resultado de la convocatoria.</li>
                                <li style={{textAlign: "justify"}}>Antecedentes fiscales en la Contraloría General de la República.</li>
                                <li style={{textAlign: "justify"}}>Antecedente Judiciales en la Policía Nacional.</li>
                                <li style={{textAlign: "justify"}}>Medidas Correctivas en la Policía Nacional.</li>
                                <li style={{textAlign: "justify"}}>Consulta de Inhabilidades por Delitos Sexuales.</li>                        
                            </ol>                    
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize: "4mm",fontWeight: "bold",marginTop: "15px",marginBottom: "8px"}}>
                            INSCRIPCIÓN
                        </Text>
                        <View style={{marginLeft: "20px"}}><Text style={{fontWeight: "bold",marginRight: "10px"}}>Fecha:</Text> 
                            Desde el
                            <Text style={{textDecoration: "underline"}}>___________</Text>    
                            {/* -------------------------------------------------------- */}                  
                            hasta el 
                            <Text style={{textDecoration: "underline"}}>__________</Text> 
                            {/* -------------------------------------------------------- */} 
                        </View>
                        <View style={{marginLeft: "20px"}}><Text style={{fontWeight: "bold",marginRight: "10px"}}>Lugar:</Text> 
                            {convocatoria.insc_lugar}
                        </View>
                        <View style={{marginLeft: "20px"}}><Text style={{fontWeight: "bold",marginRight: "20px"}}>Hora:</Text> 
                            {convocatoria.ins_horario} 
                        </View>                        
                    </View>
                    <View >
                        <View>
                            <Text style={{fontSize: "4mm",fontWeight: "bold",marginTop: "15px",marginBottom: "8px"}}>
                                PRUEBA DE CONOCIMIENTO
                            </Text>
                            <Text style={{textAlign: "justify", marginLeft: "20px"}}>
                                En esta prueba se evaluará competencias disciplinares y competencias
                                pedagógicas. Se realizará una prueba de conocimiento de manera oral y/o escrita evaluada por los tres (3) jurados
                                seleccionados por la Universidad. Los jurados dispondrán un máximo de veinte minutos para evaluar cada
                                aspirante, excepcionalmente el Presidente del Consejo de Facultad establecerá otros tiempos en casos especiales.
                            </Text>
                        </View>                
                        <View style={{display: "flex", marginTop: "10px"}}>
                            <View style={{marginLeft: "20px"}}>
                                <Text style={{fontWeight: "bold",marginRight: "10px"}}>Fecha de la prueba:</Text> ______________
                                {/* -------------------------------------------------------- */}
                            </View>                
                            <View style={{marginLeft: "20px"}}>
                                <Text style={{fontWeight: "bold",marginRight: "10px"}}>Hora:</Text> _________
                                {/* -------------------------------------------------------- */}
                            </View>                
                        </View>
                        <View style={{marginLeft: "20px"}}>
                            <Text style={{fontWeight: "bold", marginRight: "10px"}}>Lugar:</Text> {convocatoria.prue_lugar}
                        </View>                
                    </View>
                    <View >      
                        <Text style={{fontSize: "4mm",fontWeight: "bold",marginTop: "15px",marginBottom: "8px"}}>
                            PUBLICACIÓN DE RESULTADOS
                        </Text>          
                        <Text style={{textAlign: "justify", marginLeft: "20px"}}>
                            A partir del
                            <Text style={{textDecoration: "underline"}}>________________</Text> 
                            {/* -------------------------------------------------------- */}
                            en la oficina de la Facultad de
                            <Text style={{textDecoration: "underline"}}> {convocatoria.facultad} </Text> 
                            de la Universidad de la Amazonia o en el portal web institucional o envío por correo electrónico.
                        </Text>
                    </View>
                    <View >
                        <View style={{display: "flex", alignItems:"center",marginTop: "80px",flexDirection:"column"}}>
                            <View >{convocatoria.rector}</View>                                        
                            <View style={{display:"flex"}}>                                
                                <Text>Rector </Text>
                                <Text style={{marginLeft:"5px"}}>{convocatoria.rector_encargado}</Text>                                
                            </View>
                        </View>
                        <Text style={{marginTop: "20px"}}>Revisado por:</Text>
                        <View style={{display: "flex",flexDirection: "row",justifyContent: "space-between", marginTop: "80px", textAlign: "center"}}>
                            <View style={{width: "50%"}}>
                                <View >{convocatoria.decano}</View>                
                                <View style={{display:"flex", justifyContent:"center"}}>                                
                                    <Text>Decano 
                                        <Text style={{marginLeft:"5px"}}>{convocatoria.decano_encargado}</Text>
                                    </Text>                                                                
                                </View>
                            </View>
                            <View style={{width: "50%"}}>
                                <View>{convocatoria.vicerrector}</View>                
                                <View style={{display:"flex", justifyContent:"center"}}>                                
                                    <Text>Vicerrector Académico 
                                        <Text style={{marginLeft:"5px"}}>{convocatoria.vicerrector_encargado}</Text>
                                    </Text>                                                                
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <Page>
                <View>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, animi eligendi quod repellendus fugiat impedit libero laboriosam voluptate, est nihil sequi veritatis officiis tempora nostrum autem soluta cupiditate architecto doloremque!
                </View>
                <View>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, animi eligendi quod repellendus fugiat impedit libero laboriosam voluptate, est nihil sequi veritatis officiis tempora nostrum autem soluta cupiditate architecto doloremque!
                </View>
            </Page>
            </Page>
        </Document>
      )
}

export default PrintPageCeatePDF