import React from "react"
import CloseIcon from "@mui/icons-material/Close"
import DownloadIcon from "@mui/icons-material/Download"
import { Modal } from "@mui/material"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import { Box } from "@mui/system"
import { OrbitControls } from "@react-three/drei/core/OrbitControls"
import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera"
import { Canvas } from "@react-three/fiber"
import { sceneService } from "../services"
import { TemplateModel } from "./Models"

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
}

const closePopup = {
  position: "absolute",
  right: 0,
  top: 8,
  background: "none",
  color: "#999999",
}

export default function DownloadCharacter({ templateInfo, model }) {
  const saveScreenshot = async (id: string) => {
    console.log("save screenshot")
    sceneService.saveScreenShotByElementId("canvas-wrap").then(() => {})
  }
  const downloadModel = async (format: any) => {
    console.log("downloading model:", format, model)
    await sceneService.download(
      model,
      `CC_Model_${templateInfo.name.replace(" ", "_")}`,
      format,
      false,
    )
    console.log("downloaded")
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "154px",
        zIndex: 10,
      }}
    >
      <Button
        id="download-button"
        aria-controls="download-menu"
        aria-haspopup="true"
        aria-expanded={undefined}
        onClick={() => {
          saveScreenshot("screenshot-canvas-wrap")
        }}
      >
        SC
      </Button>
      <Button
        id="download-button"
        aria-controls="download-menu"
        aria-haspopup="true"
        aria-expanded={undefined}
        onClick={() => {
          downloadModel("vrm")
        }}
      >
        VRM
      </Button>
      <Button
        id="download-button"
        aria-controls="download-menu"
        aria-haspopup="true"
        aria-expanded={undefined}
        onClick={() => {
          downloadModel("gltf/glb")
        }}
      >
        GLB
      </Button>
      <Button
        id="download-button"
        aria-controls="download-menu"
        aria-haspopup="true"
        aria-expanded={undefined}
        onClick={() => {
          downloadModel("obj")
        }}
      >
        OBJ
      </Button>
    </div>
  )
}
