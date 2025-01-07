const express = require('express');
const admin = require('firebase-admin');
const app = express();
app.use(express.json());  // Middleware untuk parsing JSON

// Inisialisasi Firebase Admin SDK
const serviceAccount = require('../config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kesehatanwajah-ea5dd-default-rtdb.firebaseio.com"
});

const db = admin.database();
const ref = db.ref("sensorData");

app.post('/api/data', (req, res) => {
  console.log("Received data:", req.body);
  const data = req.body;
  const newData = ref.push();
  newData.set({
    suhu: data.suhu,
    kelembapan: data.kelembapan,
    tinggi: data.tinggi,
    timestamp: Date.now()
  })
  .then(() => {
    res.status(200).send('Data saved successfully!');
  })
  .catch((error) => {
    console.error("Error saving data:", error);
    res.status(500).send('Error saving data: ' + error.message);
  });
});

module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

