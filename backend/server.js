const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Frontend Content if deployed as single service
app.use(express.static('../frontend'));


// MongoDB Connection
// ---- 🛠️ මේ කොටස විතරක් වෙනස් කරන්න මචං ----

// 🔗 Environment එකෙන් ලින්ක් එක ගන්නවා
let dbURI = process.env.MONGO_URI || "mongodb+srv://yasirurandula84_db_user:RickeyStore2026@cluster0.giizrso.mongodb.net/?appName=Cluster0";

// 🔍 මොකක් හරි හේතුවකින් ලින්ක් එක අගට port එකක් වැදිලා තිබ්බොත් ඒක automatic අයින් කරනවා
if (dbURI.includes(':27017')) {
  dbURI = dbURI.replace(':27017', '');
}

// 🛑 දැන් පිරිසිදු ලින්ක් එකෙන් කනෙක්ට් වෙනවා
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB Cloud Connected Successfully!'))
  .catch(err => console.error('Database Connection Error:', err));
// Routes
const itemRoutes = require('./routes/itemRoutes');
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
