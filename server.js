const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const qrcode = require('qrcode');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/parking-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

const parkingSchema = new mongoose.Schema({
  carNumber: String,
  arrivalTime: Date,
  departureTime: Date,
});

const Parking = mongoose.model('Parking', parkingSchema);


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.render('form');
});

app.post('/', async (req, res) => {

  const parking = new Parking({
    carNumber: req.body.carNumber,
    arrivalTime: new Date(),
  });
  await parking.save();

  
  const startLat = '37.7749';
  const startLng = '-122.4194';
  const endLat = '37.7765';
  const endLng = '-122.4247';
  const link = `https://www.google.com/maps/dir/${startLat},${startLng}/${endLat},${endLng}`;
  const qrCodeData = `parkingId=${parking._id}&link=${link}`;
  const qrCode = await qrcode.toDataURL(qrCodeData);

  
  res.render('qr', { qrCode });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
