import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as fs from "fs";

export default class database {
  static instance: database;
  db: any = null;

  constructor() {
    database.instance = this;
    this.initDB();
  }

  initDB = async (dbname = "./db.sqlite") => {
    let firstInit = !fs.existsSync(dbname);

    this.db = await open({
      filename: dbname,
      driver: sqlite3.Database,
    });

    if (firstInit) {
      await this.db.run(
        "CREATE TABLE users(username TEXT, email TEXT, password TEXT)"
      );
      await this.db.run("CREATE TABLE avatars(username TEXT, data TEXT)");
    }
  };

  login = async (username: string, password: string) => {
    if (!username || !password) {
      return false;
    }

    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    const result = await this.db.get(query, [username, password]);
    if (!result) {
      return false;
    }

    return true;
  };

  register = async (username: string, email: string, password: string) => {
    if (!username || !password) {
      return "Invalid username or password!";
    }
    if (!email.includes("@") || !email.includes(".")) {
      return "Invalid email!";
    }
    if (await this.usernameExists(username)) {
      return "Username already exists!";
    }
    if (await this.emailExists(email)) {
      return "Email already exists!";
    }

    const query =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    await this.db.run(query, [username, email, password]);
    return "ok";
  };

  usernameExists = async (username: string) => {
    const query = "SELECT * FROM users WHERE username = ?";
    const result = await this.db.get(query, [username]);
    return result !== undefined;
  };

  emailExists = async (email: string) => {
    const query = "SELECT * FROM users WHERE email = ?";
    const result = await this.db.get(query, [email]);
    return result !== undefined;
  };

  getAvatar = async (username: string) => {
    const query = "SELECT * FROM avatars WHERE username = ?";
    const result = await this.db.get(query, [username]);
    if (!result) {
      return null;
    }

    return result.data
  };

  setAvatar = async (username: string, data: string) => {
    if (await this.getAvatar(username)) {
      console.log("avatar exists");
      const query = "UPDATE avatars SET data = ? WHERE username = ?";
      await this.db.run(query, [data, username]);
    } else {
      console.log("Adding data:", username, data)
      const query = "INSERT INTO avatars (username, data) VALUES (?, ?)";
      await this.db.run(query, [username, data]);
    }
  };
}
