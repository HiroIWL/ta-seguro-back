import express from "express";
import { Client } from "memjs";
import { json } from "milliparsec";

const app = express();
app.use(json());
const users = [];

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server running  on ${PORT} 🎉`);
});

app.get("/", (_, res) => {
  res.status(200).json({ message: "ta funcionando ʕ·͡ᴥ·ʔ" });
});

app.post("/users", async (req, res) => {
  const { email, password, phone, nome } = req.body;

  if (users.find((x) => x.user === user)) {
    res.status(400).json({ message: "Usuário já existe" });
  }

  const user = {
    id: users.length + 1,
    password,
    phone,
    nome,
    email,
  };

  users.push(user);

  res.status(201).json({
    ...user,
    password: undefined,
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((x) => x.email === email && x.password === password);
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
