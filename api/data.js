import { MongoClient } from "mongodb";

const uri = "mongodb+srv://Raja:Raja%402003@cluster0.rhk0ynu.mongodb.net/iot?retryWrites=true&w=majority";

export default async function handler(req, res) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("iot");
    const col = db.collection("sensor");

    if (req.method === "POST") {
      await col.insertOne(req.body);
      return res.status(200).json({ msg: "stored" });
    }

    if (req.method === "GET") {
      const data = await col.find().sort({ _id: -1 }).limit(1).toArray();
      return res.status(200).json(data[0] || {});
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
