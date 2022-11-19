import axios from "axios"
import { useEffect, useState } from "react"
import { MENUS, UserContext } from "./App"

export default function Register(props) {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

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

    if (!username || !password || !email) {
      props.doAlert("Please fill in all fields")
      return
    }

    const resp = await axios.post(
      "http://localhost:7777/register",
      {
        email: email,
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
    setEmail("")

    console.log(resp.data)
    if (resp.data.success) {
      props.doAlert(null)
      props.setMenu(MENUS[0])
    } else {
      props.doAlert(resp.data.error)
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Email: </label>
        <input
          type="text"
          value={email}
          placeholder="enter an email"
          onChange={({ target }) => setEmail(target.value)}
        />
        <br />
        <br />
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
        <button type="submit">Register</button>{" "}
        <button
          onClick={() => {
            props.setMenu(MENUS[0])
          }}
        >
          Back
        </button>
      </form>
    </div>
  )
}
