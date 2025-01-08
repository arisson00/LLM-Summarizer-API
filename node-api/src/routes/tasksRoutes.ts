import { Router, Request, Response } from "express";
import axios from "axios"; // Importando axios para requisições HTTP
import { TasksRepository } from "../repositories/tasksRepository";

const router = Router();
const tasksRepository = new TasksRepository();

// Idiomas suportados
const supportedLanguages = ["pt", "en", "es"];

// POST: Cria uma tarefa e solicita resumo ao serviço Python
router.post("/", async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.body;

    // Validando se o texto foi fornecido
    if (!text) {
      return res.status(400).json({ error: 'Campo "text" é obrigatório.' });
    }

    // Validando o idioma
    if (!supportedLanguages.includes(lang)) {
      return res.status(400).json({ error: "Language not supported" });
    }

    // Cria a "tarefa"
    const task = tasksRepository.createTask(text);

    // Solicitar o resumo ao serviço Python
    const summary = await getSummaryFromPython(text, lang);

    // Atualiza a tarefa com o resumo
    tasksRepository.updateTask(task.id, summary);

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task: tasksRepository.getTaskById(task.id),
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res.status(500).json({ error: "Ocorreu um erro ao criar a tarefa." });
  }
});

// GET: Lista todas as tarefas
router.get("/", (req: Request, res: Response) => {
  const tasks = tasksRepository.getAllTasks();
  return res.json(tasks);
});

// GET: Acessa o resumo de uma tarefa pelo ID
router.get("/:id", (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id, 10); // Pega o ID da URL
  const task = tasksRepository.getTaskById(taskId);

  if (!task) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  return res.json(task);
});

// Função que chama o serviço Python para obter o resumo
async function getSummaryFromPython(text: string, lang: string): Promise<string> {
  try {
    // Faz a requisição ao serviço Python (substitua pela URL do seu serviço)
    const response = await axios.post("http://localhost:8000/summarize", {
      text,
      lang,
    });

    // Verifica se a resposta do Python foi válida
    if (response.data && response.data.summary) {
      return response.data.summary;
    } else {
      throw new Error("Resumo não retornado pelo serviço Python");
    }
  } catch (error) {
    console.error("Erro ao comunicar com o serviço Python:", error);
    throw new Error("Erro ao solicitar resumo ao serviço Python");
  }
}

export default router;
