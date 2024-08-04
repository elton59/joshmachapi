const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const nodemailer = require('nodemailer');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'product_images/'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

app.set('trust proxy', 1);

app.use(session({
    secret: 'jskjkfjs-sfjsjkskdf@3&*qw',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 60000
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes setup
app.use('/api/products', require('./routes/product.route'));
app.use('/api/carts', require('./routes/cart.route'));
app.use('/api/cartItems', require('./routes/cartItem.route'));
app.use('/api/prescriptions', require('./routes/prescription.route'));

// Serve static files for component photos and product images
app.use('/component_photos', express.static(path.join(__dirname, 'component_photos')));
app.use('/product_images', express.static(path.join(__dirname, 'product_images')));
app.use('/prescription_images', express.static(path.join(__dirname, 'prescription_images')));

// Endpoint to create session and return session ID
app.get('/api/create-session', (req, res) => {
    if (!req.session.session_id) {
        req.session.session_id = uuidv4();
    }
    res.json({ session_id: req.session.session_id });
});

// Endpoint to send email
app.post('/api/send-email', (req, res) => {
    const { to, subject, body } = req.body;

    const mailOptions = {
        from: 'joshmachpharmacy@gmail.com',
        to,
        subject,
        text: body,
        cc:'joshmachpharmacy@gmail.com'
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'joshmachpharmacy@gmail.com',
            pass: 'ikez bgbx vtkp ojil',
        },
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Failed to send email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent');
        }
    });
});

// Endpoint to handle image upload
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ imagePath: `/product_images/${req.file.filename}` });
});


app.post('/api/products/add', (req, res) => {
    // Handle adding product logic here
    const productData = req.body;
    // Example: Save productData to database
    console.log('Received product data:', productData);
    res.status(200).json({ message: 'Product added successfully' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server started successfully at port ${port}`);
});
