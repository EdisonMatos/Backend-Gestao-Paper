const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://under-timer-front.vercel.app",
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

app.use(express.json());
app.use("/usuarios", usuariosRouter);
app.use("/clientes", clientesRouter);
app.use("/servicos", servicosRouter);
app.use("/comentarios", comentariosRouter);

app.get("/", (req, res) => {
  res.send("🚀 O Mago é implacável!");
});

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});
