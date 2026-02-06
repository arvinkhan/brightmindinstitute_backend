import { sendWA } from "./whatsapp.js";

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const form1Schema = new mongoose.Schema({
    name: String,
    phone: String,
    program: String
});

const Form1 = mongoose.model('Form1', form1Schema);

const form2schema = new mongoose.Schema({
    name: String,
    phone: String,
    mail: String,
    program: String,
    message: String
});
const Form2 = mongoose.model('Form2', form2schema);

// 🟢 Fetch all submissions from Form1
app.get('/api/form1', async (req, res) => {
  try {
    const form1Data = await Form1.find();
    res.json(form1Data);
  } catch (error) {
    console.error('Error fetching Form 1 data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/form2', async (req, res) => {
  try {
    const form2Data = await Form2.find();
    res.json(form2Data);
  } catch (error) {
    console.error('Error fetching Form 2 data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/form1', async (req, res) => {
    const { name,phone,program } = req.body;
    try {
        const newForm1 = new Form1({name, phone, program});
        await newForm1.save();

    sendWA(
        `📩 Form 1 Submission
        Name: ${name}
        Phone: ${phone} 
        Program: ${program}`
      ).catch(console.error); 


        res.status(201).json({ message: 'Form 1 submitted successfully' });
    } catch (error) {
        console.error('Error saving Form 1:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/form2', async (req, res) => {
    const { name,phone,mail,program,message } = req.body;
    try {
        const newForm2 = new Form2({ name,phone, mail, program, message });
        await newForm2.save();

        sendWA(
        `📩 Form 2 Submission
          Name: ${name}
          Phone: ${phone}
          Email: ${mail}
          Program: ${program}
          Message: ${message}`
        ).catch(console.error);

        res.status(201).json({ message: 'Form 2 submitted successfully' });
    } catch (error) {
        console.error('Error saving Form 2:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
