const express = require("express");
const ObjectId = require('mongodb').ObjectId;
const { connectToDatabase } = require('../mongodb'); 
const { authenticateToken } = require('../middleware')
 
const contactRouter = express.Router();

contactRouter.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const contacts = await connection.db.collection("contacts").find(); 
    contacts.toArray((error, response) => {
    if (error) {
      res.statusCode= 500;
      res.send({ error });
    }
    res.send({ response })
  })
  } catch (error) {
    res.statusCode= 500;
    res.send({ error });
  }
});

contactRouter.delete('/contacts', authenticateToken, async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const model = await connection.db.collection("contacts").remove({ _id: new ObjectId(req.query.id) });
    res.send({ model })
  } catch (error) {
    res.statusCode = 500;
    res.send(null);
  }
});

contactRouter.post('/contacts', authenticateToken, async (req, res) => {
  const body = req.body;
  try {
    const connection = await connectToDatabase();
    const result = await connection.db.collection("contacts").insertOne(body);
    console.log({result});
    res.send({ result });
  } catch (error) {
    res.statusCode = 500;
    res.send({ error })
  }
});

contactRouter.put('/contacts', authenticateToken ,async (req, res) => {
  const id = req.body._id;
  const body = req.body;
  delete body._id;

  try {
    const connection = await connectToDatabase();
    const result = await connection.db.collection("contacts").updateOne({
      _id: new ObjectId(id) 
    }, { 
      $set: { ...body }
    }, {
      upsert: true 
    });
    res.send({ result });
  } catch (error) {
    res.statusCode = 500;
    res.send({ error })
  }
})

module.exports = contactRouter;
 