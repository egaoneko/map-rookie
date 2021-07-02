import pg from 'pg';

const database = new pg.Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'map_rookie',
});
database.connect();

export default database;
