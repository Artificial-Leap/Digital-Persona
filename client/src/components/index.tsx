import { createTheme, ThemeProvider } from "@mui/material"
import { Suspense, useState, useEffect, Fragment } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import DownloadCharacter from "./Download"
import LoadingOverlayCircularStatic from "./LoadingOverlay"
import { sceneService } from "../services"
import { startAnimation } from "../library/animations/animation"
import Scene from "./Scene"
import axios from "axios"

interface Avatar {
  body: {}
  chest: {}
  head: {}
  neck: {}
  hand: {}
  ring: {}
  waist: {}
  weapon: {}
  legs: {}
  foot: {}
}

export default function CharacterEditor(props: any) {
  // State Hooks For Character Editor ( Base ) //
  // ---------- //
  // Charecter Name State Hook ( Note: this state will also update the name over the 3D model. )
  // const [characterName, setCharacterName] =
  //   useState<string>("Character Name");
  // Categories State and Loaded Hooks
  // const [categories, setCategories] = useState([]);
  // const [categoriesLoaded, setCategoriesLoaded] =
  //   useState<boolean>(false);
  // TODO: Where is setNodes
  // const [nodes, setNodes] = useState<object>(Object);
  // const [materials, setMaterials] = useState<object>(Object);
  // const [animations, setAnimations] = useState<object>(Object);
  // const [body, setBody] = useState<any>();

  const { theme, templates, mintPopup } = props
  // Selected category State Hook
  const [category, setCategory] = useState("color")
  // 3D Model Content State Hooks ( Scene, Nodes, Materials, Animations e.t.c ) //
  const [model, setModel] = useState<object>(Object)

  const [scene, setScene] = useState<object>(Object)
  // States Hooks used in template editor //
  const [templateInfo, setTemplateInfo] = useState({ file: null, format: null })

  const [downloadPopup, setDownloadPopup] = useState<boolean>(false)
  const [loadingSave, setLoadingSave] = useState<boolean>(false)
  const [template, setTemplate] = useState<number>(1)
  const [loadedFromAccount, setLoadedFromAccount] = useState<boolean>(false)
  const [loadingModelProgress, setLoadingModelProgress] = useState<number>(0)
  const [avatar, setAvatar] = useState<Avatar>({
    body: {},
    chest: {},
    head: {},
    neck: {},
    hand: {},
    ring: {},
    waist: {},
    weapon: {},
    legs: {},
    foot: {},
  })
  const [loadingModel, setLoadingModel] = useState<boolean>(false)

  const load = (res) => {
    for (const key in avatar) {
      if (avatar[key] && avatar[key].model) {
        ;(scene as any).remove(avatar[key].model)
        delete avatar[key].model
      }
    }

    console.log("doing avatars", typeof res)
    setAvatar(res.avatar)
    for (const key in res.avatar) {
      const trait = res.avatar[key]
      console.log(
        "trait:",
        trait,
        `https://webaverse.github.io/loot-assets/${trait?.directory}`,
      )
      const traitName = key

      if (!trait) {
        continue
      }

      const loader = new GLTFLoader()
      loader
        .loadAsync(
          `https://webaverse.github.io/loot-assets/${trait?.directory}`,
          (e) => {},
        )
        .then(async (gltf) => {
          const vrm = gltf
          await new Promise<void>((resolve) => {
            console.log("scene:", scene, "scene.add:", (scene as any).add)
            if (scene && (scene as any).add) {
              resolve()
            } else {
              const interval = setInterval(() => {
                if (scene && (scene as any).add) {
                  clearInterval(interval)
                  resolve()
                }
              }, 100)
            }
          })

          //@ts-ignore
          scene.add(vrm.scene)
          vrm.scene.frustumCulled = false
          console.log("avatar[traitName]", avatar[traitName])
          if (avatar[traitName]) {
            setAvatar({
              ...avatar,
              [traitName]: {
                traitInfo: trait,
                model: vrm.scene,
              },
            })
            if (avatar[traitName].model) {
              ;(scene as any).remove(avatar[traitName].model)
            }
          }
          startAnimation(vrm)
        })
    }
  }

  useEffect(() => {
    if (!loadedFromAccount && scene && scene["isObject3D"]) {
      const loggedInUser = localStorage.getItem("user")
      if (loggedInUser) {
        setLoadedFromAccount(true)
        const foundUser = JSON.parse(loggedInUser)
        axios
          .get("http://localhost:7777/avatar", {
            params: {
              username: foundUser.username,
            },
          })
          .then((resp) => {
            if (resp.data) {
              load(resp.data)
            }
          })
      }
    }
  }, [scene])
  const defaultTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#de2a5e",
      },
    },
  })
  useEffect(() => {
    if (avatar) {
      sceneService.setTraits(avatar)
    }
  }, [avatar])

  useEffect(() => {
    if (model) sceneService.setModel(model)
  }, [model])
  useEffect(() => {
    if (templateInfo.file && templateInfo.format) {
      console.log("loading: file", templateInfo.file)
      setLoadingModel(true)
      const loader = new GLTFLoader()
      loader
        .loadAsync(templateInfo.file, (e) => {
          setLoadingModelProgress((e.loaded * 100) / e.total)
        })
        .then((gltf) => {
          const vrm = gltf
          // VRM.from(gltf).then((vrm) => {
          vrm.scene.traverse((o) => {
            o.frustumCulled = false
          })
          // vrm.humanoid.getBoneNode(
          //   VRMSchema.HumanoidBoneName.Hips,
          // ).rotation.y = Math.PI
          setLoadingModel(false)
          setScene(vrm.scene)
          setModel(vrm)
          // })
          startAnimation(vrm)
        })
    }
  }, [templateInfo.file])

  return (
    <Suspense fallback="loading...">
      <ThemeProvider theme={theme ?? defaultTheme}>
        {templateInfo && (
          <Fragment>
            {loadingModel && (
              <LoadingOverlayCircularStatic
                loadingModelProgress={loadingModelProgress}
              />
            )}
            <DownloadCharacter templateInfo={templateInfo} model={model} />
            <Scene
              wrapClass="generator"
              templates={templates}
              scene={scene}
              downloadPopup={downloadPopup}
              mintPopup={mintPopup}
              category={category}
              setCategory={setCategory}
              avatar={avatar}
              setAvatar={setAvatar}
              setTemplate={setTemplate}
              template={template}
              setTemplateInfo={setTemplateInfo}
              templateInfo={templateInfo}
              load={load}
            />
          </Fragment>
        )}
      </ThemeProvider>
    </Suspense>
  )
}
