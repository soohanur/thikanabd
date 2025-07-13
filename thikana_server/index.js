const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_secret_key'; // Use a strong secret in production

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = "mongodb+srv://thikanadb:cWb07pYg13fHVbJk@thikana-project.ckxbymy.mongodb.net/thikana-project?retryWrites=true&w=majority&appName=thikana-project";
let usersCollection;
let propertiesCollection;
let messagesCollection;

async function startServer() {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        console.log("Connected to MongoDB!");
        const database = client.db("thikana-project");
        usersCollection = database.collection("thikana_user");
        propertiesCollection = database.collection("properties");
        messagesCollection = database.collection("messages"); // <-- Add messages collection

        // Start Express server after DB connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

startServer();

// Middleware to verify JWT and get user
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('Server is running');
});

// API to register user
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = { name, email, password };
        const result = await usersCollection.insertOne(newUser);

        res.status(201).json({ message: 'User registered successfully', user: result });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// API to login user with JWT
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usersCollection.findOne({ email });
        if (user && user.password === password) {
            // Create JWT token
            const token = jwt.sign(
                { userId: user._id, email: user.email, name: user.name },
                JWT_SECRET,
                { expiresIn: '2h' }
            );
            res.status(200).json({ message: 'Login successful', token, user: { name: user.name, email: user.email } });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// POST /api/properties - Create a property post with file upload
app.post('/api/properties', authenticateToken, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const postData = req.body;
    postData.userId = req.user.userId;
    postData.type = postData.type || 'rent';

    // Store category and propertyType as single values (not arrays)
    if (Array.isArray(postData.category)) {
      postData.category = postData.category[0];
    }
    if (Array.isArray(postData.propertyType)) {
      postData.propertyType = postData.propertyType[0];
    }

    // Parse numbers
    if (postData.beds) postData.beds = Number(postData.beds);
    if (postData.baths) postData.baths = Number(postData.baths);
    if (postData.size) postData.size = Number(postData.size);
    if (postData.price) postData.price = Number(postData.price);
    if (postData.beforePrice) postData.beforePrice = Number(postData.beforePrice);

    // Attach file paths
    if (req.files['coverImage']) {
      postData.coverImage = req.files['coverImage'][0].filename;
    }
    if (req.files['galleryImages']) {
      postData.galleryImages = req.files['galleryImages'].map(f => f.filename);
    }
    // Parse map field if it's a string
    if (postData.map && typeof postData.map === 'string') {
      try { postData.map = JSON.parse(postData.map); } catch {}
    }
    const result = await propertiesCollection.insertOne(postData);
    res.status(201).json({ message: 'Property posted successfully', property: result });
  } catch (error) {
    res.status(500).json({ message: 'Error posting property', error });
  }
});

// GET /api/properties - Get all properties for the logged-in user
app.get('/api/properties', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const properties = await propertiesCollection.find({ userId }).toArray();
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties', error });
    }
});

// GET /api/properties/user - Get all properties for the logged-in user
app.get('/api/properties/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    let properties = await propertiesCollection.find({ userId }).toArray();
    // Ensure all fields are present and arrays are valid
    properties = properties.map((p) => ({
      ...p,
      galleryImages: Array.isArray(p.galleryImages) ? p.galleryImages : [],
      images: Array.isArray(p.images) ? p.images : [],
      reviews: Array.isArray(p.reviews) ? p.reviews : [],
      rating: typeof p.rating === 'number' ? p.rating : 0,
      beds: typeof p.beds === 'number' ? p.beds : 0,
      baths: typeof p.baths === 'number' ? p.baths : 0,
      size: typeof p.size === 'number' ? p.size : 0,
      price: typeof p.price === 'number' ? p.price : 0,
      beforePrice: typeof p.beforePrice === 'number' ? p.beforePrice : 0,
      nowPrice: typeof p.nowPrice === 'number' ? p.nowPrice : p.price || 0,
      title: p.title || '',
      description: p.description || '',
      location: p.location || '',
      area: p.area || '',
      category: p.category || '',
      propertyType: p.propertyType || '',
      map: p.map || '',
      image: p.coverImage ? `/uploads/${p.coverImage}` : '',
      verified: typeof p.verified === 'boolean' ? p.verified : false,
    }));
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user properties', error });
  }
});

// PUT /api/properties/:id - Update a property (only if owned by user)
app.put('/api/properties/:id', authenticateToken, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user.userId;
    const property = await propertiesCollection.findOne({ _id: new ObjectId(propertyId) });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

    const updateData = req.body;
    // Always set userId to the logged-in user
    updateData.userId = userId;
    // Store category and propertyType as single values (not arrays)
    if (Array.isArray(updateData.category)) updateData.category = updateData.category[0];
    if (Array.isArray(updateData.propertyType)) updateData.propertyType = updateData.propertyType[0];
    // Parse numbers
    if (updateData.beds) updateData.beds = Number(updateData.beds);
    if (updateData.baths) updateData.baths = Number(updateData.baths);
    if (updateData.size) updateData.size = Number(updateData.size);
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.beforePrice) updateData.beforePrice = Number(updateData.beforePrice);
    // Attach file paths
    if (req.files['coverImage']) updateData.coverImage = req.files['coverImage'][0].filename;
    if (req.files['galleryImages']) updateData.galleryImages = req.files['galleryImages'].map(f => f.filename);
    // Parse map field if it's a string
    if (updateData.map && typeof updateData.map === 'string') {
      try { updateData.map = JSON.parse(updateData.map); } catch {}
    }
    await propertiesCollection.updateOne(
      { _id: new ObjectId(propertyId) },
      { $set: updateData }
    );
    res.json({ message: 'Property updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating property', error });
  }
});

// Add a POST /api/properties/:id endpoint for updating property (for client compatibility)
app.post('/api/properties/:id', authenticateToken, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]), async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user.userId;
    const property = await propertiesCollection.findOne({ _id: new ObjectId(propertyId) });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

    const updateData = req.body;
    // Always set userId to the logged-in user
    updateData.userId = userId;
    if (Array.isArray(updateData.category)) updateData.category = updateData.category[0];
    if (Array.isArray(updateData.propertyType)) updateData.propertyType = updateData.propertyType[0];
    if (updateData.beds) updateData.beds = Number(updateData.beds);
    if (updateData.baths) updateData.baths = Number(updateData.baths);
    if (updateData.size) updateData.size = Number(updateData.size);
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.beforePrice) updateData.beforePrice = Number(updateData.beforePrice);
    if (req.files['coverImage']) updateData.coverImage = req.files['coverImage'][0].filename;
    if (req.files['galleryImages']) updateData.galleryImages = req.files['galleryImages'].map(f => f.filename);
    // Parse map field if it's a string
    if (updateData.map && typeof updateData.map === 'string') {
      try { updateData.map = JSON.parse(updateData.map); } catch {}
    }
    await propertiesCollection.updateOne(
      { _id: new ObjectId(propertyId) },
      { $set: updateData }
    );
    res.json({ message: 'Property updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating property', error });
  }
});

// DELETE /api/properties/:id - Delete a property (only if owned by user)
app.delete('/api/properties/:id', authenticateToken, async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user.userId;
    const property = await propertiesCollection.findOne({ _id: new ObjectId(propertyId) });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });
    await propertiesCollection.deleteOne({ _id: new ObjectId(propertyId) });
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error });
  }
});

// POST /api/user/profile - Update user profile (avatar, cover, contact info)
app.post('/api/user/profile', authenticateToken, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'coverPicture', maxCount: 1 }
]), async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.phone) updateData.phone = req.body.phone;
    if (req.body.address) updateData.address = req.body.address;
    if (req.files['profilePicture']) {
      updateData.profilePicture = `/uploads/${req.files['profilePicture'][0].filename}`;
    }
    if (req.files['coverPicture']) {
      updateData.coverPicture = `/uploads/${req.files['coverPicture'][0].filename}`;
    }
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );
    res.json({ message: 'Profile updated successfully', update: updateData });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
});

// GET /api/user/profile - Get current user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
});

// GET /api/users - Get all users (public info only)
app.get('/api/users', async (req, res) => {
  try {
    // Exclude password from results
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// GET /api/users/:usernameOrId - Get user by username or ID (public profile)
app.get('/api/users/:usernameOrId', async (req, res) => {
  try {
    const { usernameOrId } = req.params;
    let user = await usersCollection.findOne({ username: usernameOrId }, { projection: { password: 0 } });
    if (!user && ObjectId.isValid(usernameOrId)) {
      user = await usersCollection.findOne({ _id: new ObjectId(usernameOrId) }, { projection: { password: 0 } });
    }
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get user's properties
    const properties = await propertiesCollection.find({ userId: user._id.toString() }).toArray();
    res.json({ user, properties });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// --- Messaging API ---
// POST /api/messages - Send a message
app.post('/api/messages', authenticateToken, async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        if (!receiverId || !text) return res.status(400).json({ message: 'receiverId and text required' });
        const senderId = req.user.userId;
        // Find or create a conversationId (sorted sender/receiver)
        const participants = [senderId, receiverId].sort();
        let conversation = await messagesCollection.findOne({ participants });
        let conversationId;
        if (!conversation) {
            conversationId = new ObjectId();
            await messagesCollection.insertOne({ _id: conversationId, participants, messages: [] });
        } else {
            conversationId = conversation._id;
        }
        // Add message to conversation
        const message = {
            senderId,
            receiverId,
            text,
            timestamp: new Date(),
        };
        await messagesCollection.updateOne(
            { _id: conversationId },
            { $push: { messages: message } }
        );
        res.status(201).json({ message: 'Message sent', conversationId });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
});

// GET /api/messages/conversations - Get all conversations for logged-in user
app.get('/api/messages/conversations', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const conversations = await messagesCollection.find({ participants: userId }).toArray();
        // Return basic info: conversationId, participants, last message
        const result = conversations.map(conv => ({
            conversationId: conv._id,
            participants: conv.participants,
            lastMessage: conv.messages[conv.messages.length - 1] || null,
        }));
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversations', error });
    }
});

// GET /api/messages/:conversationId - Get all messages in a conversation
app.get('/api/messages/:conversationId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const conversationId = req.params.conversationId;
        const conversation = await messagesCollection.findOne({ _id: new ObjectId(conversationId), participants: userId });
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
        res.json(conversation.messages || []);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});

// POST /api/messages/:conversationId/read - Mark all messages as read for the logged-in user
app.post('/api/messages/:conversationId/read', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const conversationId = req.params.conversationId;
        const conversation = await messagesCollection.findOne({ _id: new ObjectId(conversationId), participants: userId });
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
        // Mark all messages sent to the logged-in user as read
        const updatedMessages = (conversation.messages || []).map(msg => {
            if (msg.receiverId === userId) {
                return { ...msg, read: true };
            }
            return msg;
        });
        await messagesCollection.updateOne(
            { _id: new ObjectId(conversationId) },
            { $set: { messages: updatedMessages } }
        );
        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking messages as read', error });
    }
});

// GET /api/properties/all - Get all properties (public, for homepage etc.)
app.get('/api/properties/all', async (req, res) => {
  try {
    const properties = await propertiesCollection.find({}).toArray();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all properties', error });
  }
});
