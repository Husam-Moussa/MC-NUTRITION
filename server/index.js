const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Data persistence
const DATA_FILE = 'data.json';

// Load data from file or initialize with defaults
let data = {
  products: [],
  productIdCounter: 1
};

// Load data from file if it exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const fileData = fs.readFileSync(DATA_FILE, 'utf8');
    data = JSON.parse(fileData);
  } catch (error) {
    console.error('Error loading data file:', error);
  }
}

// Save data to file
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data file:', error);
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Product routes with Socket.IO events
app.get('/api/products', (req, res) => {
  res.json(data.products);
});

app.get('/api/products/:id', (req, res) => {
  const product = data.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['name', 'price', 'category', 'stock'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: missingFields
      });
    }

    // Validate numeric fields
    const price = parseFloat(req.body.price);
    const stock = parseInt(req.body.stock);
    
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }
    
    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({ error: 'Invalid stock value' });
    }

    // Create product object
    const product = {
      id: data.productIdCounter++,
      name: req.body.name.trim(),
      price: price,
      category: req.body.category.trim(),
      stock: stock,
      description: req.body.description?.trim() || '',
      image: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date().toISOString()
    };

    // Add optional fields if they exist
    if (req.body.rating) {
      const rating = parseFloat(req.body.rating);
      if (!isNaN(rating) && rating >= 0 && rating <= 5) {
        product.rating = rating;
      }
    }

    if (req.body.tags) {
      product.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    if (req.body.badge) {
      product.badge = req.body.badge.trim();
    }

    // Save product
    data.products.push(product);
    saveData();

    // Notify connected clients
    io.emit('productAdded', product);

    // Return success response
    res.status(201).json({
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      error: 'Failed to create product',
      message: error.message
    });
  }
});

app.put('/api/products/:id', (req, res) => {
  const idx = data.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  data.products[idx] = { ...data.products[idx], ...req.body };
  saveData();
  io.emit('productUpdated', data.products[idx]);
  res.json(data.products[idx]);
});

app.delete('/api/products/:id', (req, res) => {
  const idx = data.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  const deletedProduct = data.products[idx];
  data.products.splice(idx, 1);
  saveData();
  io.emit('productDeleted', deletedProduct);
  res.json({ message: 'Product deleted successfully' });
});

// Update the server.listen to use the HTTP server
server.listen(5000, () => {
  console.log('Server is running on port 5000');
}); 