import { Router } from 'express';
import asyncWrapper from '../../utils/async-wrapper';
import database from '../../database';

const MAX: number = 20037508.342789;

const router = Router();
router.get(
  '/wmts/:z/:x/:y',
  asyncWrapper(async (req, res) => {
    const z = parseInt(req.params.z);
    const x = parseInt(req.params.x);
    const y = parseInt(req.params.y);

    const buffers = [];
    buffers.push(await getCtprvn(z, x, y));
    buffers.push(await getChargingStation(z, x, y));

    res.set({
      'Content-Type': 'application/protobuf',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    });
    res.write(Buffer.concat(buffers), 'binary');
    res.end(null, 'binary');
  }),
);

export default router;

async function getCtprvn(z: number, x: number, y: number): Promise<Buffer> {
  const resolution: number = (MAX * 2) / Math.pow(2, z);
  const minX: number = -MAX + x * resolution;
  const minY: number = MAX - y * resolution;
  const maxX: number = -MAX + x * resolution + resolution;
  const maxY: number = MAX - y * resolution - resolution;

  const query: string = `
      SELECT STRING_AGG(mvtl, '') AS mvt
      FROM (
	     SELECT COALESCE(ST_AsMVT(t, 'ctprvn', 4096, 'mvtgeometry', 'id'), '') as mvtl
	     FROM (
			  SELECT gid as id,
				       ST_AsMVTGeom(geom, ST_MakeEnvelope(${minX}, ${minY}, ${maxX}, ${maxY}, 3857), 4096, 64, true) AS mvtgeometry,
				       ctprvn_cd as code,
               ctp_kor_nm as name,
               ctp_eng_nm as nameEn
			FROM (   
			  SELECT p.gid,
               p.geom,
               p.ctprvn_cd,
               p.ctp_kor_nm,
               p.ctp_eng_nm
			         FROM ( SELECT *
			                FROM ctprvn
			                WHERE geom && ST_Expand(ST_MakeEnvelope(${minX}, ${minY}, ${maxX}, ${maxY}, 3857), 626172.1357121641 / 2 ^ ${z})
			              ) AS p
			       ) as n
        ) as t
      ) AS all_layers
    `
    .split(/\n/g)
    .map(r => r.trim())
    .join(' ');

  const result = await database.query(query);
  return Buffer.from(result.rows[0].mvt, 'binary');
}

async function getChargingStation(z: number, x: number, y: number): Promise<Buffer> {
  const resolution: number = (MAX * 2) / Math.pow(2, z);
  const minX: number = -MAX + x * resolution;
  const minY: number = MAX - y * resolution;
  const maxX: number = -MAX + x * resolution + resolution;
  const maxY: number = MAX - y * resolution - resolution;

  const query: string = `
      SELECT STRING_AGG(mvtl, '') AS mvt
      FROM (
	     SELECT COALESCE(ST_AsMVT(t, 'charging_station', 4096, 'mvtgeometry', 'id'), '') as mvtl
	     FROM (
			  SELECT id,
				       ST_AsMVTGeom(geometry, ST_MakeEnvelope(${minX}, ${minY}, ${maxX}, ${maxY}, 3857), 4096, 64, true) AS mvtgeometry,
				       name,
				       address,
				       source
			FROM (   
			  SELECT p.id,
               p.geometry,
               p.name,
               p.address,
               p.source
			         FROM ( SELECT *
			                FROM charging_station
			                WHERE geometry && ST_Expand(ST_MakeEnvelope(${minX}, ${minY}, ${maxX}, ${maxY}, 3857), 626172.1357121641 / 2 ^ ${z})
			              ) AS p
			       ) as n
        ) as t
      ) AS all_layers
    `
    .split(/\n/g)
    .map(r => r.trim())
    .join(' ');

  const result = await database.query(query);
  return Buffer.from(result.rows[0].mvt, 'binary');
}
