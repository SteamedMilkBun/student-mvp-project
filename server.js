import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  // TODO: Replace "postgres://localhost/example_db" with process.env.DATABASE_URL
  connectionString: process.env.DATABASE_URL
});

pool.connect()
.then((client) => {
  console.log(`Connected to postgres using connection string ${process.env.DATABASE_URL}`);
  client.release();
})
.catch((err)=>{
  console.log("Failed to connect to postgres: ", err.message);
})

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/bakery", (req, res) => {
  client.query("SELECT * FROM bakery")
  .then((data) => {
    console.log(data.rows);
    res.json(data.rows);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
});

app.get("/person", (req, res) => {
  pool.query("SELECT * FROM person")
  .then((data) => {
    console.log(data.rows);
    res.json(data.rows);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
});

app.get("/person/:name", (req, res) => {
  const name = req.params.name;
  console.log(`Queried ${req.params.name}`);

  pool.query(`SELECT * FROM person WHERE person_name ILIKE $1`, [name])
  .then((data) => {
    if (data.rows.length === 0) {
      console.log(`No matches for: ${name}.`)
      res.sendStatus(400);
      return;
    }

    //TODO more than one person with same name
    console.log(data.rows[0]);
    res.json(data.rows[0]);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
})

app.post("/person", (req, res) => {
  const name = req.body.person_name;
  const money = Number.parseInt(req.body.person_money);

  //TODO capitalize first letter in name to be posted
  //TODO check if valid name

  console.log(`Want to post name: ${name}, money: ${money}`);

  pool.query(`INSERT INTO person (person_name, person_money) VALUES ($1, $2) RETURNING *`, [name, money])
  .then((data) => {
    console.log(data.rows[0]);
    res.json(data.rows[0]);
  })
  .catch((err) => {
    console.log(err);
    return;
  })
})

app.patch("/person/:name", (req, res) => {
  const name = req.params.name;
  const money = req.body.person_money;
  console.log(`Want to patch/update something about ${req.params.name}`);

  pool.query(`UPDATE person SET 
                person_money = COALESCE($1, person_money)
                WHERE person_name ILIKE $2 RETURNING *`, [money, name])
  .then((data) => {
    if (data.rows.length === 0) {
      console.log(`No matches for: ${name}.`)
      res.sendStatus(400);
      return;
    }

    //TODO more than one person with same name
    console.log(data.rows[0]);
    res.json(data.rows[0]);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  }) 
})

app.delete("/person/:name", (req, res) => {
  const name = req.params.name;
  console.log(`Want to delete: ${req.params.name}`);

  pool.query(`DELETE FROM person WHERE person_name ILIKE $1`, [name])
  .then((data) => {
    //TODO what happens when what you want to delete doesn't exist?
    console.log(`Deleted ${name}`);
    console.log(data.rows[0]);
    res.json(data.rows[0]);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
})

app.get("/baked_goods", (req, res) => {
  pool.query("SELECT * FROM baked_goods")
  .then((data) => {
    console.log(data.rows);
    res.json(data.rows);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
});

app.get("/baked_goods/:id", (req, res) => {
  const id = Number.parseInt(req.params.id);
  console.log(`Queried ${id}`);

  pool.query(`SELECT * FROM baked_goods WHERE baked_goods_id = $1`, [id])
  .then((data) => {
    if (data.rows.length === 0) {
      console.log(`No matches for id: ${id}.`)
      res.sendStatus(400);
      return;
    }
    console.log(data.rows[0]);
    res.json(data.rows[0]);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
})

app.post("/baked_goods", (req, res) => {
  const name = req.body.baked_goods_name;
  const price = Number.parseInt(req.body.baked_goods_price);


  console.log(`Want to post name: ${name}, price: ${price}`);

  pool.query(`INSERT INTO baked_goods (baked_goods_name, baked_goods_price) VALUES ($1, $2) RETURNING *`, [name, price])
  .then((data) => {
    console.log(data.rows[0]);
    res.json(data.rows[0]);
  })
  .catch((err) => {
    console.log(err);
    return;
  })
})

app.patch("/baked_goods/:id", (req, res) => {
  const id = Number.parseInt(req.params.id);
  const name = req.body.baked_goods_name;
  const price = req.body.baked_goods_price;

  console.log(`Want to patch/update something about ${id}`);

  pool.query(`UPDATE baked_goods SET 
                baked_goods_name = COALESCE($1, baked_goods_name),
                baked_goods_price = COALESCE($2, baked_goods_price)
                WHERE baked_goods_id = $3 RETURNING *`, [name, price, id])
  .then((data) => {
    if (data.rows.length === 0) {
      console.log(`No matches for id: ${id}.`)
      res.sendStatus(400);
      return;
    }

    console.log(data.rows[0]);
    res.json(data.rows[0]);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  }) 
})

app.delete("/baked_goods/:id", (req, res) => {
  const id = Number.parseInt(req.params.id);
  console.log(`Want to delete baked goods at id: ${id}`);

  pool.query(`DELETE FROM baked_goods WHERE baked_goods_id = $1`, [id])
  .then((data) => {
    //TODO what happens when what you want to delete doesn't exist?
    console.log(`Deleted ${id}`);
    console.log(data.rows[0]);
    res.json(data.rows[0]);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port: ${process.env.PORT}.`);
});