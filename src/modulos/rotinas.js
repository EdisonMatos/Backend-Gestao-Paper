const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Função auxiliar: verifica se a data é dessa semana
function isDataDessaSemana(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const hoje = new Date();

  const diaDaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda...
  const diffSegunda = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
  const primeiroDia = new Date(hoje);
  primeiroDia.setDate(hoje.getDate() + diffSegunda);
  primeiroDia.setHours(0, 0, 0, 0);

  const ultimoDia = new Date(primeiroDia);
  ultimoDia.setDate(primeiroDia.getDate() + 6);
  ultimoDia.setHours(23, 59, 59, 999);

  return date >= primeiroDia && date <= ultimoDia;
}

// Função auxiliar: calcula status da rotina
function calcularStatus(rotina, horario) {
  const registroAtual = rotina.registros
    ?.filter((reg) => isDataDessaSemana(reg.dataConclusao))
    .sort((a, b) => new Date(b.dataConclusao) - new Date(a.dataConclusao))[0];

  if (!registroAtual) return "pendente";

  const dataConclusao = new Date(registroAtual.dataConclusao);
  const [hora, minuto] = horario.split(":").map(Number);
  const dataLimite = new Date(dataConclusao);
  dataLimite.setHours(hora, minuto, 0, 0);
  dataLimite.setTime(dataLimite.getTime() + rotina.janela * 60000);

  return dataConclusao <= dataLimite ? "concluida" : "atrasada";
}

// Listar todas as rotinas
router.get("/", async (req, res) => {
  try {
    const rotinas = await prisma.rotina.findMany({
      include: {
        registros: true,
      },
    });
    res.json(rotinas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar rotinas" });
  }
});

// Nova rota: Quadro Kanban de rotinas otimizado
router.get("/kanban", async (req, res) => {
  const { setor } = req.query;
  if (!setor) {
    return res.status(400).json({ error: "O parâmetro 'setor' é obrigatório" });
  }

  try {
    const rotinas = await prisma.rotina.findMany({
      where: { setor },
      include: { registros: true },
    });

    const colunas = {
      segunda: [],
      terca: [],
      quarta: [],
      quinta: [],
      sexta: [],
    };

    rotinas.forEach((r) => {
      const dias = r.diaDaSemana
        .toLowerCase()
        .split(",")
        .map((d) => d.trim());
      const horarios = r.horario
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean);

      horarios.forEach((h) => {
        const [hora, minuto] = h.split(":").map(Number);
        const horarioRotina = new Date();
        horarioRotina.setHours(hora, minuto, 0, 0);
        const fimDaJanela = new Date(
          horarioRotina.getTime() + r.janela * 60000
        );
        const limite = fimDaJanela
          .toTimeString()
          .split(":")
          .slice(0, 2)
          .join(":");

        const card = {
          id: `${r.id}-${h}`,
          nome: r.nome,
          descricao: r.descricao,
          horario: h,
          limite,
          complexidade: r.complexidade,
          janela: r.janela,
          statusCalculado: calcularStatus(r, h),
        };

        Object.keys(colunas).forEach((dia) => {
          if (dias.includes(dia) || dias.includes("todos")) {
            colunas[dia].push(card);
          }
        });
      });
    });

    Object.keys(colunas).forEach((dia) => {
      colunas[dia].sort((a, b) => {
        const [hA, mA] = a.horario.split(":").map(Number);
        const [hB, mB] = b.horario.split(":").map(Number);
        return hA !== hB ? hA - hB : mA - mB;
      });
    });

    res.json(colunas);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao carregar quadro Kanban de rotinas" });
  }
});

// Deletar rotina por id (com exclusão de registros)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const rotinaExistente = await prisma.rotina.findUnique({ where: { id } });
    if (!rotinaExistente) {
      return res.status(404).json({ error: "Rotina não encontrada" });
    }

    // Primeiro, exclui registros associados
    await prisma.registroRotina.deleteMany({ where: { rotinaId: id } });

    // Agora exclui a rotina
    await prisma.rotina.delete({ where: { id } });

    res.json({ message: "Rotina removida com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar rotina:", error);
    res.status(500).json({ error: "Erro ao deletar rotina" });
  }
});

// Criar nova rotina
router.post("/", async (req, res) => {
  const {
    nome,
    descricao,
    status,
    complexidade,
    horario,
    janela,
    diaDaSemana,
    setor,
  } = req.body;

  if (
    !nome ||
    !descricao ||
    !status ||
    complexidade === undefined ||
    !horario ||
    janela === undefined ||
    !diaDaSemana ||
    !setor
  ) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    const rotina = await prisma.rotina.create({
      data: {
        nome,
        descricao,
        status,
        complexidade,
        horario,
        janela,
        diaDaSemana,
        setor,
      },
    });
    res.status(201).json(rotina);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar rotina" });
  }
});

// Atualizar rotina por id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    descricao,
    status,
    complexidade,
    horario,
    janela,
    conclusao,
    diaDaSemana,
    setor,
  } = req.body;

  try {
    const rotinaExistente = await prisma.rotina.findUnique({ where: { id } });
    if (!rotinaExistente) {
      return res.status(404).json({ error: "Rotina não encontrada" });
    }

    const rotinaAtualizada = await prisma.rotina.update({
      where: { id },
      data: {
        nome,
        descricao,
        status,
        complexidade,
        horario,
        janela,
        conclusao: new Date(conclusao),
        diaDaSemana,
        setor,
      },
    });
    res.json(rotinaAtualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar rotina" });
  }
});

// Deletar rotina por id (duplicado, mantido se você quiser manter as duas variações)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const rotinaExistente = await prisma.rotina.findUnique({ where: { id } });
    if (!rotinaExistente) {
      return res.status(404).json({ error: "Rotina não encontrada" });
    }

    await prisma.rotina.delete({ where: { id } });
    res.json({ message: "Rotina removida com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar rotina" });
  }
});

module.exports = router;
