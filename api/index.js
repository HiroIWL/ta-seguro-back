import express from "express";
import { json } from "milliparsec";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { v4 as uuid } from "uuid";
import cors from "cors";

const app = express();
app.use(json());
app.use(cors());

async function getDatabase() {
  const client = new MongoClient(process.env.CONNECTION_STRING);
  return client.db("auth");
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server running  on ${PORT} 🎉`);
});

app.get("/", (_, res) => {
  res.status(200).json({ message: "ta funcionando ʕ·͡ᴥ·ʔ" });
});

app.get("/users", async (req, res) => {
  const db = await getDatabase();
  const collection = db.collection("users");

  const users = await collection.find().toArray();

  res.status(200).json(
    users.map((user) => ({
      ...user,
      password: undefined,
    }))
  );
});

app.post("/users", async (req, res) => {
  const { email, password, phone, nome } = req.body;
  const db = await getDatabase();

  const user = await db.collection("users").findOne({ email: email });
  if (user) {
    res.status(400).json({
      message: "Usuário já cadastrado.",
    });

    return;
  }

  const newUser = {
    id: uuid(),
    password,
    phone,
    nome,
    email,
  };

  await db.collection("users").insertOne(newUser);

  res.status(204).json({
    ...newUser,
    password: undefined,
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = await getDatabase();
  const user = await db.collection("users").findOne({
    email: email,
    password: password,
  });

  if (!user) {
    res.status(400).json({
      message: "Usuário ou senha incorretos.",
    });
  }

  res.status(200).json({
    ...user,
    password: undefined,
  });
});
