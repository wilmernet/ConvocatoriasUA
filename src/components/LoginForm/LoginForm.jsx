import * as React from 'react';
import LogoUA from "../../assets/LogoUA.jpg"
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  Alert,
  IconButton,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';

import Swal from 'sweetalert2'
import { useContext } from 'react';

import { appFirebase } from '../../Firebase/FirebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { setPersistence,browserSessionPersistence } from "firebase/auth";

const auth = getAuth(appFirebase);

const providers = [{ id: 'credentials', name: 'Email and Password' }];

function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Correo Electrónico"
      name="email"
      type="email"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  );
}

function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        Contraseña
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Contraseña"
      />
    </FormControl>
  );
}

function CustomButton() {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      Ingresar
    </Button>
  );
}

function SignUpLink() {
  return (
    <Link href="/" variant="body2">
      Registrate
    </Link>
  );
}

function ForgotPasswordLink() {
  return (
    <Link href="/" variant="body2">
      ¿Olvidaste tu contraseña?
    </Link>
  );
}

function Title() {
  return <h2 style={{ marginBottom: 8, textAlign: "center" }}>
    <img
      src={LogoUA}
      alt="Logo Universidad de la Amazonia"
      style={{ height: 54 }}
    />
    <br />
    Convocatorias Docentes
  </h2>;
}

function Subtitle() {
  return (
    <Alert sx={{ mb: 2, px: 1, py: 0.25 }} severity="info">
      Manten en reserva tus credenciales.
    </Alert>
  );
}

const LoginForm = () => {

  // const [email, setEmail]=React.useState();
  // const [password, setPassword]=React.useState();
  // const [registrando, setRegistrando]=React.useState();


  

  const logueo = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code == 'auth/invalid-email') {
        alert("El correo no es válido")
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: `El correo ingresado es invalido`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
        html: `<b>Credenciales inválidas</b><br><br>Se ha generado un error al intentar validar las credenciales<br><br>Error: ${error.code}`,
        });
        console.log("Error: " + error.code + ": " + error.message);
      }
    }
  }
  // const logueo = async (email, password) => {
  //   setPersistence(auth, browserSessionPersistence)
  //   .then(() => {
  //     return signInWithEmailAndPassword(auth, email, password);
  //   })
  //   .catch((error) => {
  //     if (error.code == 'auth/invalid-email') {
  //       alert("El correo no es válido")
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //         html: `El correo ingresado es invalido`,
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Oops...',
  //       html: `<b>Credenciales inválidas</b><br><br>Se ha generado un error al intentar validar las credenciales<br><br>Error: ${error.code}`,
  //       });
  //       console.log("Error: " + error.code + ": " + error.message);
  //     }
  //   });    
  // }

  const theme = useTheme();
  return (
    <AppProvider theme={theme}>
      <div style={{ backgroundColor: "#BDBDBD" }}>
        <SignInPage
          signIn={(provider, formData) => {
            logueo(formData.get('email'), formData.get('password'));
          }
          }
          slots={{
            title: Title,
            subtitle: Subtitle,
            emailField: CustomEmailField,
            passwordField: CustomPasswordField,
            submitButton: CustomButton,
          }}
          providers={providers}
        />

      </div>
    </AppProvider>
  );
}

export default LoginForm;