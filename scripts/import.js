const path = require('path');
const fs = require('fs');
const pg = require('pg');
const parse = require('csv-parse');

const POSTGRES_USER = 'postgres';
const POSTGRES_PASS = 'postgres';
const POSTGRES_HOST = 'localhost';
const POSTGRES_PORT = 5432;
const POSTGRES_DBNAME = 'map_rookie';

(async () => {
  await importCSV();
})();

async function importCSV() {
  const stream = createReadStream(getPath(`../data/charging_station.csv`));
  const client = new pg.Client({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    password: POSTGRES_PASS,
    database: POSTGRES_DBNAME,
    port: POSTGRES_PORT,
  });
  client.connect();

  const parser = stream.pipe(
    parse({
      columns: true,
      delimiter: ',',
      trim: true,
      skip_empty_lines: true,
    })
  );

  let count = 0;

  process.stdout.write(`Start\n`);

  for await (const record of parser) {
    process.stdout.write(`${count++} ${Object.values(record).join(',')}\n`);

    try {
      await insertRow(client, record);
    } catch (e) {
      console.log(`record : ${JSON.stringify(record, null, 2)}\n`);
      throw(e);
    }
  }
  process.stdout.write(`Finish ${count}\n`);
  client.end();
}

async function insertRow(client, data) {
  const columns = [
    'name',
    'address',
    'geometry',
    'source'
  ];
  const table = 'charging_station';
  const values = [
    `'${data['name']}'`,
    `'${data['address']}'`,
    `st_transform(ST_GeomFromText('POINT(${data['longitude']} ${data['latitude']})',4326),3857)`,
    `'${data['source']}'`,
  ];

  const insertQuery = `INSERT INTO public.${table} (${columns.join(',\n')})
                     VALUES (${values.join(',\n')});`;

  try {
    await client.query(insertQuery);
  } catch (e) {
    console.log(`[error] query : ${insertQuery}\n`);
  }
}

function createReadStream(file) {
  return fs.createReadStream(file);
}

function getPath(dir) {
  return path.join(__dirname, dir);
};
