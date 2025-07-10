import { appFirebase } from "./Firebase/FirebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth(appFirebase);

import './App.css'

import { useState } from "react";

import Dashboard from './components/Dashboard/Dashboard'
import LoginForm from "./components/LoginForm/LoginForm";
import { DataProvider } from "./context/DataContext";


const App = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  
  onAuthStateChanged(auth, (userFirebase) => {
    if (userFirebase) {
      setEmail(userFirebase.email);
      setUser(userFirebase);
    } else {
      setEmail('');
      setUser(null);
    }
  })

  return (
    <DataProvider>
      <div>
        {user ? <Dashboard email={email} /> : <LoginForm />}
      </div>
    </DataProvider>
  );

}

export default App
