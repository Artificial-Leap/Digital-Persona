import React, { useState, createContext, useContext } from "react"
import ReactDOM from "react-dom"

import CharacterEditor from "./components"
import { createTheme, Alert, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import defaultTemplates from "./data/base_models"
import Login from "./Login"
import Register from "./Register"
const defaultTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#de2a5e",
    },
  },
})

export const MENUS = ["login", "register", "avatar_creator"]
export const UserContext = createContext({})

function App() {
  const [currentMenu, setCurrentMenu] = useState(MENUS[0])
  const [alertTitle, setAlertTitle] = useState("")
  const [showAlert, setShowAlert] = useState(false)

  const doAlert = (title: string) => {
    if (!title) {
      setAlertTitle("")
      setShowAlert(false)
    } else {
      setAlertTitle(title)
      setShowAlert(true)
    }
  }

  return (
    <React.Fragment>
      {currentMenu == MENUS[0] ? (
        <Login setMenu={setCurrentMenu} doAlert={doAlert} />
      ) : currentMenu == MENUS[1] ? (
        <Register setMenu={setCurrentMenu} doAlert={doAlert} />
      ) : (
        <CharacterEditor
          templates={defaultTemplates}
          theme={defaultTheme}
          setMenu={setCurrentMenu}
        />
      )}

      {showAlert && (
        <Alert
          id="alertTitle"
          variant="filled"
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShowAlert(false)
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alertTitle}
        </Alert>
      )}
    </React.Fragment>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
)
