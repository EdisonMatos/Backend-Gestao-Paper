const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Listar todos os serviços
router.get("/", async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany({
      include: {
        cliente: true,
        comentarios: true,
      },
    });
    res.json(servicos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar serviços" });
  }
});

// Buscar serviço por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const servico = await prisma.servico.findUnique({
      where: { id },
      include: {
        cliente: true,
        comentarios: true,
      },
    });

    if (!servico) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    res.json(servico);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar serviço" });
  }
});

// Criar novo serviço
router.post("/", async (req, res) => {
  const {
    nome,
    clienteId,
    status,
    statusAtualizadoEm,
    dataContratacao,
    dataInfosColetadas,
    dataDocPronto,
    dataEnvioPrevia,
    dataConclusao,
    dataProximoPrazo,
    linkDoc,
    linkPreviaVercel,
    linkRepoGithub,
    turnoDaVez,
    comentariosTexto,
    deuFeedbackSite,
    feedbackSitePostado,
    deuFeedbackGoogle,
    posicaoNoQuadro,
    feedbackGooglePostado,
  } = req.body;

  if (!clienteId || !dataContratacao) {
    return res
      .status(400)
      .json({ error: "clienteId e dataContratacao são obrigatórios" });
  }

  try {
    const servico = await prisma.servico.create({
      data: {
        nome,
        clienteId,
        status,
        statusAtualizadoEm,
        dataContratacao: new Date(dataContratacao),
        dataInfosColetadas: dataInfosColetadas
          ? new Date(dataInfosColetadas)
          : null,
        dataDocPronto: dataDocPronto ? new Date(dataDocPronto) : null,
        dataEnvioPrevia: dataEnvioPrevia ? new Date(dataEnvioPrevia) : null,
        dataConclusao: dataConclusao ? new Date(dataConclusao) : null,
        dataProximoPrazo: dataProximoPrazo ? new Date(dataProximoPrazo) : null,
        linkDoc,
        linkPreviaVercel,
        linkRepoGithub,
        turnoDaVez,
        comentariosTexto,
        deuFeedbackSite,
        feedbackSitePostado,
        deuFeedbackGoogle,
        posicaoNoQuadro,
        feedbackGooglePostado,
      },
    });

    res.status(201).json(servico);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar serviço" });
  }
});

// Atualizar serviço por id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    clienteId,
    status,
    statusAtualizadoEm,
    dataContratacao,
    dataInfosColetadas,
    dataDocPronto,
    dataEnvioPrevia,
    dataConclusao,
    dataProximoPrazo,
    linkDoc,
    linkPreviaVercel,
    linkRepoGithub,
    turnoDaVez,
    comentariosTexto,
    deuFeedbackSite,
    feedbackSitePostado,
    deuFeedbackGoogle,
    posicaoNoQuadro,
    feedbackGooglePostado,
  } = req.body;

  try {
    const servicoExistente = await prisma.servico.findUnique({ where: { id } });
    if (!servicoExistente) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    const servicoAtualizado = await prisma.servico.update({
      where: { id },
      data: {
        nome,
        clienteId,
        status,
        statusAtualizadoEm,
        dataContratacao: dataContratacao
          ? new Date(dataContratacao)
          : servicoExistente.dataContratacao,
        dataInfosColetadas: dataInfosColetadas
          ? new Date(dataInfosColetadas)
          : servicoExistente.dataInfosColetadas,
        dataDocPronto: dataDocPronto
          ? new Date(dataDocPronto)
          : servicoExistente.dataDocPronto,
        dataEnvioPrevia: dataEnvioPrevia
          ? new Date(dataEnvioPrevia)
          : servicoExistente.dataEnvioPrevia,
        dataConclusao: dataConclusao
          ? new Date(dataConclusao)
          : servicoExistente.dataConclusao,
        dataProximoPrazo: dataProximoPrazo
          ? new Date(dataProximoPrazo)
          : servicoExistente.dataProximoPrazo,
        linkDoc,
        linkPreviaVercel,
        linkRepoGithub,
        turnoDaVez,
        comentariosTexto,
        deuFeedbackSite,
        feedbackSitePostado,
        deuFeedbackGoogle,
        posicaoNoQuadro,
        feedbackGooglePostado,
      },
    });

    res.json(servicoAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar serviço" });
  }
});

// Deletar serviço por id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const servicoExistente = await prisma.servico.findUnique({ where: { id } });
    if (!servicoExistente) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    await prisma.servico.delete({ where: { id } });
    res.json({ message: "Serviço removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar serviço" });
  }
});

module.exports = router;
