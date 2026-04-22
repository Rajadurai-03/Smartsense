import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      return res.status(500).json({ error: "Missing MONGO_URI" });
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db("iot");
    const col = db.collection("sensor");

    if (req.method === "POST") {
      await col.insertOne(req.body);
      await client.close();
      return res.status(200).json({ msg: "stored" });
    }

    if (req.method === "GET") {
      const data = await col.find().sort({ _id: -1 }).limit(1).toArray();
      await client.close();
      return res.status(200).json(data[0] || {});
    }

    await client.close();
    res.status(405).json({ error: "Method not allowed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
