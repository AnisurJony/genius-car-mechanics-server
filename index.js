const express = require('express');

const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbldh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function emaJohnFunction() {
    try {
        await client.connect();
        const database = client.db('online_shop');
        const ProductCollection = database.collection('products');

        // Get products API 
        app.get('/products', async (req, res) => {
            console.log('me', req.query)

            const cursor = ProductCollection.find({});

            const page = req.query.page;

            const size = parseInt(req.query.size);

            let products;

            const count = await cursor.count();

            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray();

            }
            else {
                const products = await cursor.toArray();

            }



            res.send({
                count,
                products
            });
        });
        // use post to get data keys
        app.post('/products/byKeys', async (req, res) => {
            console.log(req.body);
            const keys = req.body;
            const query = { req: { $in: keys } };
            const users = await ProductCollection.find(query).toArray();

            res.json(users)
        })


    }
    finally {
        // await client.close();
    }
}
emaJohnFunction().catch(console.dir);


app.get('/', (req, res) => {
    res.send('ema john server is ready')
});

app.listen(port, () => {
    console.log('ema john server is running', port)
})