const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json());

//Get all products
app.get("/", async (req, res) => {
  const { data, error } = await supabase.from("productsintern").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  } else {
    return res.status(200).json(data);
  }
});

//Get by ID
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("productsintern")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    return res.status(500).json({ error: error.message });
  } else {
    return res.status(200).json(data);
  }
});

//Create a new product
app.post("/products", async (req, res) => {
  const { name, price, stock } = req.body;
  const { data, error } = await supabase
    .from("productsintern")
    .insert([{ name, price, stock }]);
  if (error) {
    return res.status(500).json({ error: error.message });
  } else {
    return res.status(201).json(data);
  }
});

//Update a product
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;
  const { data, error } = await supabase
    .from("productsintern")
    .update({
      name,
      price,
      stock,
    })
    .eq("id", id);
  if (error) {
    return res.status(500).json({ error: error.message });
  } else {
    return res.status(200).json(data);
  }
});

//Delete a product
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("productsintern").delete().eq("id", id);
  if (error) {
    return res.status(500).json({ error: error.message });
  } else {
    return res.status(204).send({ message: "Product deleted" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
