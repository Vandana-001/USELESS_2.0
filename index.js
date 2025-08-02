const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(fileUpload());

// Routes
app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', (req, res) => {
    if (!req.files || !req.files.image) {
        return res.status(400).send('No image uploaded.');
    }

    const image = req.files.image;
    const uploadPath = path.join(__dirname, 'public', 'uploads', image.name);

    image.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ fileName: image.name });
    });
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
