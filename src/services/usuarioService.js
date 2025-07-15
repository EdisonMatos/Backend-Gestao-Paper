const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.listarTodos = () => prisma.usuario.findMany();

exports.criar = (data) => prisma.usuario.create({ data });

exports.buscarPorId = (id) =>
  prisma.usuario.findUniqueOrThrow({ where: { id } });

exports.deletar = (id) => prisma.usuario.delete({ where: { id } });
