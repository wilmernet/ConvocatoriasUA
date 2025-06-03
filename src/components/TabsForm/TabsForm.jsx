import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import SaveIcon from '@mui/icons-material/Save';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import ConstructionIcon from '@mui/icons-material/Construction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const TabsForm=()=> {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <nav>
        <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon position tabs example"
        >
        <Tab icon={<AccountCircleIcon />} label="Formación" />
        <Tab icon={<NoteAddIcon />} label="Experiencia" />
        <Tab icon={<FindInPageIcon />} label="Competencias" />        
        <Tab icon={<ConstructionIcon />} label="Requisitos" />
        <Tab icon={<ConstructionIcon />} label="Inscripción" />
        <Tab icon={<ConstructionIcon />} label="Prueba" />
        <Tab icon={<ConstructionIcon />} label="Resultados" />
        <Tab icon={<ConstructionIcon />} label="Firma" />
        </Tabs>
    </nav>
  );
}

export default TabsForm;