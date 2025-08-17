const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://front-gestao-paper.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const usuariosRouter = require("./modulos/usuarios");
const clientesRouter = require("./modulos/clientes");
const servicosRouter = require("./modulos/servicos");
const comentariosRouter = require("./modulos/comentarios");
const rotinasRouter = require("./modulos/rotinas");
const registrosRouter = require("./modulos/registros");
const authRouter = require("./auth");

app.use(express.json());

app.use("/login", authRouter);
app.use("/usuarios", usuariosRouter);
app.use("/clientes", clientesRouter);
app.use("/servicos", servicosRouter);
app.use("/comentarios", comentariosRouter);
app.use("/rotinas", rotinasRouter);
app.use("/registros", registrosRouter);

app.get("/", (req, res) => {
  res.send("🚀");
});

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});
