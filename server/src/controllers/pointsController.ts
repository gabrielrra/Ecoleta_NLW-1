import knex from '../database/connection';
import { Request, Response } from 'express';

class PointsController {
  async index(req: Request, res: Response) {
    const { uf, city, items } = req.query;

    if (!uf && !city && !items) {
      const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .distinct()
        .select('points.*');

      return res.json({ code: 0, points });
    }

    const itemsArray = String(items)
      .split(',')
      .map((item) => Number(item.trim()));
    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .where('point_items.item_id', itemsArray)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');
    return res.json({ code: 0, points });
  }
  async create(req: Request, res: Response) {
    const {
      name,
      email,
      phone,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    let point = {
      image: req.file.filename,
      name,
      email,
      phone,
      latitude,
      longitude,
      city,
      uf,
    };

    const trx = await knex.transaction();

    const insertedIds = await trx('points').insert({
      ...point,
    });
    const point_id = insertedIds[0];

    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: Number) => ({
        item_id,
        point_id,
      }));

    await trx('point_items').insert(pointItems);
    trx.commit();
    return res.json({ point: { id: point_id, ...point }, code: 0, items });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const point = await knex('points').where('id', id).first();

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id);

    const serializedPoint = {
      ...point,
      image_url: `https://ecoletanlw1.herokuapp.com/${point.image}`,
    };

    if (!point) {
      return res.json({ code: 1, message: 'Point not found' });
    }
    return res.json({ code: 0, point: { ...serializedPoint, items } });
  }
}

export default PointsController;
