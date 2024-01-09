import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection
async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb+srv://shahinur:shahinur13@students.hv8arh2.mongodb.net/Meal-Sheet", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }}
connectToDatabase();
// Schema for the meal record
const mealSchema = new mongoose.Schema({
  name: String,
  breakfast: String,
  lunch: String,
  dinner: String,
  bazar: Number,
  stockBazar: Number,
  stockDeposit: Number,
  date: Date
});

const Meal = mongoose.model('Meal', mealSchema);

// Routes

//API  to Store meal recording
app.post('/api/meals/:name', async (req, res) => {
  const { name,breakfast,lunch,dinner,date,bazar, stockBazar, stockDeposit } = req.body;

  try {
   
    const newMeal = new Meal({ name,breakfast,lunch,dinner,date,bazar, stockBazar, stockDeposit });
    await newMeal.save();
    res.send({ message: "Meal Data stored successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
// API  to get meals by name within a date range
app.get('/api/meals/:name', async (req, res) => {
  const { name } = req.params;
  const { startDate, endDate } = req.query;

  try {
    let query = { name };

    if (startDate && endDate) {
      const endOfDay = new Date(new Date(endDate).setHours(23, 59, 59, 999));
      query.date = { $gte: new Date(startDate), $lte: endOfDay };
    }

    const meals = await Meal.find(query).sort({ date: 1 });
    res.send(meals);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// API endpoint to get all meals
app.get('/api/meals', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    let query = {};
    if (startDate && endDate) {
      const endOfDay = new Date(new Date(endDate).setHours(23, 59, 59, 999));
      query.date = { $gte: new Date(startDate), $lte: endOfDay };
    }
    const meals = await Meal.find(query).sort({ date: 1 });
    res.send(meals);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// API To handle DELETE requests
app.delete('/api/meals/:id', async (req, res) => {
  const { id } = req.params;

  try {
      await Meal.findByIdAndDelete(id);
      res.status(204).send(); 
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
  }
});


// Start the server
app.listen(8001,'0.0.0.0', () => {
    console.log("Server is running on port 8001");
});

export default app;
