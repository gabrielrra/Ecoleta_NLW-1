import knex from '../database/connection';
import { Request, Response } from 'express';

class ItemsController {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');
    const serializedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      url: `https://ecoletanlw1.herokuapp.com/uploads/${item.image}`,
    }));
    return res.json({ code: 0, items: serializedItems });
  }
}
export default ItemsController;
