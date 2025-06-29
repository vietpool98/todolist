import { Injectable } from '@nestjs/common';
import { MySQLService } from '../database/mysql.service';

@Injectable()
export class ListsService {

  constructor(private db: MySQLService) {}

async findAll() {
  const sql = `
    SELECT 
      l.id as list_id, 
      l.name as list_name, 
      t.id as task_id, 
      t.title, 
      t.date, 
      t.priority, 
      t.completed
    FROM lists l
    LEFT JOIN tasks t ON l.id = t.list_id;
  `;

  const result = await this.db.query(sql);

  console.log(result);
  let rows;
  if (Array.isArray(result) && Array.isArray(result[0])) {
    rows = result[0];
  } else if (Array.isArray(result)) {
    rows = result;
  } else {
    rows = [result];
  }

  

  if (!rows || rows.length === 0) {
    return [];
  }

  const resultObj = {};
  for (const row of rows) {
    if (!resultObj[row.list_id]) {
      resultObj[row.list_id] = {
        id: row.list_id,
        name: row.list_name,
        tasks: [],
      };
    }
    if (row.task_id) {
      resultObj[row.list_id].tasks.push({
        id: row.task_id,
        title: row.title,
        date: row.date,
        priority: row.priority,
        completed: !!row.completed,
      });
    }
  }

  return Object.values(resultObj);
}

  async create(name: string) {
    const result: any = await this.db.query('INSERT INTO lists (name) VALUES (?)', [name]);
    return { id: result.insertId, name };
  }

  async delete(id: number) {
    return this.db.query('DELETE FROM lists WHERE id = ?', [id]);
  }
}