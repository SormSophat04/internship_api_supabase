// const express = require("express");
// const cors = require("cors");
// const { createClient } = require("@supabase/supabase-js");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 3000;

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_ANON_KEY
// );

// app.use(cors());
// app.use(express.json());

// //Get all products
// app.get("/", async (req, res) => {
//   const { data, error } = await supabase.from("productsintern").select("*");
//   if (error) {
//     return res.status(500).json({ error: error.message });
//   } else {
//     return res.status(200).json(data);
//   }
// });

// //Get by ID
// app.get("/products/:id", async (req, res) => {
//   const { id } = req.params;
//   const { data, error } = await supabase
//     .from("productsintern")
//     .select("*")
//     .eq("id", id)
//     .single();
//   if (error) {
//     return res.status(500).json({ error: error.message });
//   } else {
//     return res.status(200).json(data);
//   }
// });

// //Create a new product
// app.post("/products", async (req, res) => {
//   const { name, price, stock } = req.body;
//   const { data, error } = await supabase
//     .from("productsintern")
//     .insert([{ name, price, stock }]);
//   if (error) {
//     return res.status(500).json({ error: error.message });
//   } else {
//     return res.status(201).json(data);
//   }
// });

// //Update a product
// app.put("/products/:id", async (req, res) => {
//   const { id } = req.params;
//   const { name, price, stock } = req.body;
//   const { data, error } = await supabase
//     .from("productsintern")
//     .update({
//       name,
//       price,
//       stock,
//     })
//     .eq("id", id);
//   if (error) {
//     return res.status(500).json({ error: error.message });
//   } else {
//     return res.status(200).json(data);
//   }
// });

// //Delete a product
// app.delete("/products/:id", async (req, res) => {
//   const { id } = req.params;
//   const { error } = await supabase.from("productsintern").delete().eq("id", id);
//   if (error) {
//     return res.status(500).json({ error: error.message });
//   } else {
//     return res.status(204).send({ message: "Product deleted" });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });




const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

/* ------------------- ROUTES ------------------- */

// Get all products (with optional pagination)
app.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    const { data, error } = await supabase
      .from("productsintern")
      .select("*")
      .range(skip, skip + limit - 1)
      .order("id", { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("productsintern")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new product
app.post("/products", async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    if (!name || price == null || stock == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("productsintern")
      .insert([{ name, price, stock }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    const { data, error } = await supabase
      .from("productsintern")
      .update({ name, price, stock })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("productsintern")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
