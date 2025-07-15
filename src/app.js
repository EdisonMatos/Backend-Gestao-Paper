const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const usuariosRouter = require("./modulos/usuarios");
app.use("/usuarios", usuariosRouter);

app.get("/", (req, res) => {
  res.send("🚀 O Mago é implacável!");
});

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});
