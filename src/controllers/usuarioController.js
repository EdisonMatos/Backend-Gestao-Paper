const usuarioService = require("../services/usuarioService");

exports.listarTodos = async (req, res, next) => {
  try {
    const usuarios = await usuarioService.listarTodos();
    res.json(usuarios);
  } catch (err) {
    next(err);
  }
};

exports.criar = async (req, res, next) => {
  try {
    const novoUsuario = await usuarioService.criar(req.body);
    res.status(201).json(novoUsuario);
  } catch (err) {
    next(err);
  }
};

exports.buscarPorId = async (req, res, next) => {
  try {
    const usuario = await usuarioService.buscarPorId(req.params.id);
    res.json(usuario);
  } catch (err) {
    next(err);
  }
};

exports.deletar = async (req, res, next) => {
  try {
    await usuarioService.deletar(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
