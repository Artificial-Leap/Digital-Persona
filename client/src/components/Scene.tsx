import { PerspectiveCamera } from "@react-three/drei/core/PerspectiveCamera"
import { OrbitControls } from "@react-three/drei/core/OrbitControls"
import { Canvas } from "@react-three/fiber"
import Editor from "./Editor"
import { TemplateModel } from "./Models"
import Selector from "./Selector"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { startAnimation } from "../library/animations/animation"
import { apiService } from "../services"
import { useEffect } from "react"
import axios from "axios"
import { UserContext } from "../App"

export default function Scene(props: any) {
  const {
    wrapClass,
    templates,
    scene,
    downloadPopup,
    mintPopup,
    category,
    setCategory,
    avatar,
    setAvatar,
    setTemplate,
    template,
    setTemplateInfo,
    templateInfo,
    load,
  }: any = props

  const canvasWrap = {
    height: "100vh",
    width: "100vw",
    position: "absolute" as "absolute",
    zIndex: "0",
    top: "0",
    backgroundColor: "#111111",
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative" as "relative",
      }}
    >
      <div
        id="canvas-wrap"
        className={`canvas-wrap ${wrapClass && wrapClass}`}
        style={{ ...canvasWrap, height: window.innerHeight - 89 }}
      >
        <button
          onClick={async () => {
            const data = { avatar: {}, sex: template }
            for (const key in avatar) {
              const trait = avatar[key].traitInfo
              data.avatar[key] = trait
            }

            console.log("data:", data, "template:", template)
            const js = JSON.stringify(data)
            console.log(js)
            const element = document.createElement("a")
            const file = new Blob([js], { type: "text/plain" })
            element.href = URL.createObjectURL(file)
            element.download = "avatar.json"
            document.body.appendChild(element)
            element.click()

            const loggedInUser = localStorage.getItem("user")
            if (loggedInUser) {
              const foundUser = JSON.parse(loggedInUser)
              console.log("body:", {
                username: foundUser.username,
                avatar: data,
              })
              const resp = await axios.post("http://localhost:7777/avatar", {
                username: foundUser.user.username,
                avatar: js,
              })
              console.log(resp.data)
            }
          }}
        >
          Save
        </button>
        <button
          onClick={() => {
            const input = document.createElement("input")
            input.type = "file"
            input.accept = ".json"
            input.onchange = (e) => {
              const file = (e.target as any).files[0]
              const reader = new FileReader()
              reader.onload = async (e) => {
                const text = e.target.result
                const res = JSON.parse(text as any)
                console.log(res)
                load(res)
              }
              reader.readAsText(file)
            }
            input.click()
          }}
        >
          Upload
        </button>
        <Canvas className="canvas" id="editor-scene">
          <gridHelper
            args={[50, 25, "#101010", "#101010"]}
            position={[0, 0, 0]}
          />
          <spotLight
            intensity={1}
            position={[0, 3.5, 2]}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            castShadow
          />
          <spotLight
            intensity={0.2}
            position={[-5, 2.5, 4]}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <spotLight
            intensity={0.2}
            position={[5, 2.5, 4]}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <spotLight
            intensity={0.3}
            position={[0, -2, -8]}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            castShadow
          />
          <OrbitControls
            minDistance={1}
            maxDistance={3}
            minPolarAngle={0.0}
            maxPolarAngle={Math.PI / 2 - 0.1}
            enablePan={false}
            target={[0, 1, 0]}
          />
          <PerspectiveCamera>
            {!downloadPopup && !mintPopup && <TemplateModel scene={scene} />}
          </PerspectiveCamera>
        </Canvas>
      </div>
      <div>
        <Selector
          templates={templates}
          category={category}
          scene={scene}
          avatar={avatar}
          setAvatar={setAvatar}
          setTemplate={setTemplate}
          template={template}
          setTemplateInfo={setTemplateInfo}
          templateInfo={templateInfo}
        />
        <Editor category={category} setCategory={setCategory} />
      </div>
    </div>
  )
}
