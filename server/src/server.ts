import express, { json } from "express";
import cors from "cors";
import database from "./database";

export default class server {
  static instance: server;

  app;

  constructor(port: number) {
    server.instance = this;

    this.app = express();
    this.app.use(json());
    this.app.use(cors());

    this.app.get("/", (req, res) => {
      res.send("test");
    });

    this.app.post("/login", async (req, res) => {
      const { username, password } = req.body;
      const loginRes = await database.instance.login(username, password);

      if (loginRes) {
        res.send({
          success: true,
          user: {
            username: username,
          },
        });
      } else {
        res.send({ success: false });
      }
    });

    this.app.post("/register", async (req, res) => {
      const { username, email, password } = req.body;
      const registerRes = await database.instance.register(
        username,
        email,
        password
      );

      if (registerRes === "ok") {
        res.send({ success: true });
      } else {
        res.send({ success: false, error: registerRes });
      }
    });

    this.app.get("/avatar", async (req, res) => {
      console.log("query:", req.query);
      const username = req.query.username;

      const avatar = await database.instance.getAvatar(username as string);
      console.log('d',avatar)
      res.send(avatar);
    });
    this.app.post("/avatar", async (req, res) => {
      const data = req.body;
      console.log("body:", req.body);
      const avatarData = data.avatar;
      const username = data.username;

      await database.instance.setAvatar(username, avatarData);
      res.send({ success: true });
    });

    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}
