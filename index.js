const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dprcj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const serviceCollection = client
      .db(`doctors_portal`)
      .collection(`services`);
    const bookingCollection = client
      .db(`doctors_portal`)
      .collection(`bookings`);

    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const query = {
        treatment: booking.treatment,
        date: booking.date,
        patient: booking.patient,
      };
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    /*
     * API Naming Convention
     * app.get('/booking') // get all bookings in this collection. or get more the one or by filter
     * app.get('/booking') // get a specific booking
     * app.post('/booking') // add a new booking
     * app.patch('/booking/:id') //
     * app.delete('/booking/:id') //
     */
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running `Doctors Portal` Server");
});

app.listen(port, () => {
  console.log("Doctors App Listening to port", port);
});
