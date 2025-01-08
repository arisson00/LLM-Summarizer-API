import fs from 'fs';
import path from 'path';

interface Task {
  id: number;
  text: string;
  summary: string | null;
}

export class TasksRepository {
  private tasks: Task[] = [];
  private currentId: number = 1;
  private readonly filePath: string = path.join(__dirname, 'tasks.json');

  constructor() {
    // Carregar tarefas do arquivo JSON ao iniciar o repositório
    this.loadTasks();
  }

  // Carregar as tarefas do arquivo tasks.json
  private loadTasks() {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      const loadedTasks = JSON.parse(data);
      this.tasks = loadedTasks;
      // Atribui o ID da próxima tarefa com base no maior ID atual
      if (this.tasks.length > 0) {
        this.currentId = Math.max(...this.tasks.map(task => task.id)) + 1;
      }
    }
  }

  // Salvar tarefas no arquivo tasks.json
  private saveTasks() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.tasks, null, 2));
  }

  // Criar uma nova tarefa
  createTask(text: string): Task {
    const task: Task = {
      id: this.currentId++,
      text,
      summary: null,
    };
    this.tasks.push(task);
    this.saveTasks();  // Salvar após adicionar
    return task;
  }

  // Atualizar uma tarefa com um resumo
  updateTask(id: number, summary: string): Task | null {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      this.tasks[taskIndex].summary = summary;
      this.saveTasks();  // Salvar após atualização
      return this.tasks[taskIndex];
    }
    return null;
  }

  // Obter uma tarefa pelo ID
  getTaskById(id: number): Task | null {
    return this.tasks.find(t => t.id === id) || null;
  }

  // Obter todas as tarefas
  getAllTasks(): Task[] {
    return this.tasks;
  }

  // Remover uma tarefa pelo ID
  deleteTask(id: number): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    if (this.tasks.length < initialLength) {
      this.saveTasks();  // Salvar após remoção
      return true;
    }
    return false;
  }
}
