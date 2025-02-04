const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.ART_USER}:${process.env.ART_PASS}@cluster0.ltb0gzh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const craftCollection = client.db('craftDB').collection('craft');

        app.get("/craft", async (req, res) => {
            const cursor = craftCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get("/craft/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const currentCraft = await craftCollection.findOne(query);
            res.send(currentCraft);
        })
        app.get("/myArtCraft/:email", async (req, res) => {
            const result = await craftCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })

        app.post("/craft", async (req, res) => {
            const newCraft = req.body;
            console.log(newCraft);
            const result = await craftCollection.insertOne(newCraft);
            res.send(result);
        })

        app.put("/craft/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id)}
            const options = { upsert: true }
            const updatedCraft = req.body;
            const newCraft = {
                $set: {
                    itemName: updatedCraft.itemName, 
                    subcategory_Name: updatedCraft.subcategory_Name, 
                    description: updatedCraft.description, 
                    price: updatedCraft.price, 
                    rating: updatedCraft.rating, 
                    customization: updatedCraft.customization, 
                    processing_time: updatedCraft.processing_time, 
                    status: updatedCraft.status, 
                    photo: updatedCraft.photo
                }
            }
            const result = await craftCollection.updateOne(filter, newCraft, options);
            res.send(result);
        })

        app.delete("/myArtCraft/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('ETSY art and craft is running!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})