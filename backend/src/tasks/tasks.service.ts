import { Injectable } from '@nestjs/common';
import { MySQLService } from '../database/mysql.service';

@Injectable()
export class TasksService {
  constructor(private db: MySQLService) {}

  async findByListId(listId: number) {
    return this.db.query('SELECT * FROM tasks WHERE list_id = ?', [listId]);
  }

  async create(task: any) {
    const { title, date, priority, completed, tags, list_id } = task;
    const result: any = await this.db.query(
      'INSERT INTO tasks (title, date, priority, completed, tags, list_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, date, priority, completed, JSON.stringify(tags), list_id],
    );
    return { id: result.insertId, ...task };
  }

  async updateStatus(taskId: number, completed: boolean) {
    return this.db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, taskId]);
  }

  async delete(taskId: number) {
    return this.db.query('DELETE FROM tasks WHERE id = ?', [taskId]);
  }
}