import axios from "axios"
import { useEffect, useState } from "react"
import { MENUS, UserContext } from "./App"

export default function Login(props) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState()

  useEffect(() => {
    const checkForLogin = async () => {
      const loggedInUser = localStorage.getItem("user")
      if (loggedInUser) {
        const foundUser = JSON.parse(loggedInUser)

        const resp = await axios.post(
          "http://localhost:7777/login",
          {
            username: foundUser.username,
            password: foundUser.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          },
        )

        if (resp.data.success) {
          setUser(foundUser)
          props.setMenu(MENUS[2])
        }
      }
    }

    checkForLogin()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!username || !password) {
      props.doAlert("Please fill in all fields")
      return
    }

    const tempPassword = password

    const resp = await axios.post(
      "http://localhost:7777/login",
      {
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )

    setUsername("")
    setPassword("")

    console.log(resp.data)
    if (resp.data.success) {
      setUser(resp.data.user)
      resp.data.user.password = tempPassword
      localStorage.setItem("user", JSON.stringify(resp.data.user))
      props.setMenu(MENUS[2])
      props.doAlert(null)
    } else {
      props.doAlert("Invalid username or password")
      setUser(null)
      localStorage.removeItem("user")
    }
  }

  return (
    <UserContext.Provider value={user}>
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            value={username}
            placeholder="enter a username"
            onChange={({ target }) => setUsername(target.value)}
          />
          <br />
          <br />
          <div>
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              value={password}
              placeholder="enter a password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <br />
          <button type="submit">Login</button>{" "}
          <button
            onClick={() => {
              props.setMenu(MENUS[1])
            }}
          >
            Register
          </button>
        </form>
      </div>
    </UserContext.Provider>
  )
}
