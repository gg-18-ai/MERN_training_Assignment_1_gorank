# Complete Line-by-Line Code & Oral Defense (Viva) Guide

---

## 1. What Are the Installed Libraries & Why Do We Need Them?

1. **`express`**: Framework for Node.js used to build Web APIs and servers. It handles HTTP requests (GET, POST, PATCH, DELETE) and routes.
2. **`mongoose`**: Object Data Modeling (ODM) library for MongoDB and Node.js. It lets us create database schemas and models to store data easily.
3. **`bcryptjs`**: Hashing library used to securely hash passwords before saving them into MongoDB (never store plain text passwords!).
4. **`jsonwebtoken` (jwt)**: Generates secure tokens signed with a secret key. Used to keep users logged in and authenticate protected routes.
5. **`cookie-parser`**: Express middleware that parses cookies sent in incoming requests so we can access `req.cookies.token`.
6. **`dotenv`**: Loads environment variables from a `.env` file into `process.env` (e.g., PORT, MONGO_URI, JWT_SECRET).
7. **`nodemon`**: Development tool that automatically restarts the Node server whenever code changes are saved.

---

## 2. File-by-File & Line-by-Line Code Breakdown

---

### A. `server.js` (The Server Entry Point)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
```
* **Line 1-4**: Imports the required third-party packages into our server file using Node.js `require()` syntax.

```javascript
dotenv.config();
```
* **Line 6**: Reads the `.env` file and attaches environment variables to `process.env`.

```javascript
const app = express();
const PORT = process.env.PORT || 5000;
```
* **Line 9-10**: Creates an instance of Express application called `app`, and sets the port to `5000` (or whatever port is defined in `.env`).

```javascript
app.use(express.json());
app.use(cookieParser());
```
* **Line 13**: Middleware that converts incoming JSON data in the request body into JavaScript objects, accessible via `req.body`.
* **Line 14**: Middleware that parses cookies from the client request headers, accessible via `req.cookies`.

```javascript
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/assignment1_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Database connected successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err.message));
```
* **Line 17-23**: Connects to the MongoDB database. `.then()` runs if connection succeeds; `.catch()` handles any connection errors.

```javascript
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
```
* **Line 26-30**: Imports route files and mounts them on base URL paths:
  * Any request starting with `/api/auth` goes to `authRoutes`.
  * Any request starting with `/api/products` goes to `productRoutes`.

```javascript
app.get('/', (req, res) => {
  res.send('Backend Server is running successfully!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```
* **Line 33-39**: Defines a basic test endpoint (`/`) and starts listening for HTTP requests on port `5000`.

---

### B. `models/User.js` (User Database Schema)

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
```
* **`mongoose.Schema(...)`**: Defines the blueprint/structure of a User document in MongoDB.
* **`required: true`**: Ensures the field cannot be left blank when saving to DB.
* **`unique: true`**: Prevents duplicate emails in the database.
* **`timestamps: true`**: Automatically creates `createdAt` and `updatedAt` date fields in MongoDB.
* **`mongoose.model('User', userSchema)`**: Turns the schema into a usable model object (`User`) that has methods like `.find()`, `.findOne()`, `.save()`.

---

### C. `models/Product.js` (Product Database Schema)

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  SKU: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
```
* **`SKU`**: Stock Keeping Unit (a unique product code like `PROD-001`). Set to `unique: true` so no two products have the same SKU.

---

### D. `middleware/authMiddleware.js` (Protected Route Verification)

```javascript
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey12345');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = protect;
```
* **What is Middleware?**: A function that runs *before* the main route controller to check if the user is authorized.
* **`req.cookies.token`**: Tries to read the token stored in HTTP cookies.
* **`req.headers.authorization`**: Backup option to read token from Postman Bearer token header.
* **`jwt.verify(token, secret)`**: Decodes and verifies if the token is genuine and hasn't expired.
* **`req.user = decoded`**: Attaches decoded user info (user ID, email) to `req` object for the route handler.
* **`next()`**: Tells Express to pass execution to the next middleware or final route controller.

---

### E. `routes/authRoutes.js` (Registration, Login, Logout)

#### 1. Registration (`POST /api/auth/register`)
```javascript
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully!', user: { id: newUser._id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});
```
* **`const { name, email, password } = req.body`**: Destructures user inputs from request body.
* **Validation Check**: Checks if any required field is missing; returns `400 Bad Request` if true.
* **`User.findOne({ email })`**: Queries MongoDB to check if an account already exists with that email.
* **`bcrypt.genSalt(10)` & `bcrypt.hash(password, salt)`**: Generates salt and converts plain password into a secure hash string.
* **`new User(...)` & `newUser.save()`**: Creates a database instance and saves it to MongoDB.
* **`res.status(201).json(...)`**: Sends HTTP status 201 (Created) along with success message.

---

#### 2. Login (`POST /api/auth/login`)
```javascript
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User does not exist.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Wrong password.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'mysecretkey12345',
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    return res.status(200).json({ message: 'Login successful!', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
});
```
* **`bcrypt.compare(password, user.password)`**: Compares entered plain text password with stored hashed password. Returns `true` if match.
* **`jwt.sign(...)`**: Creates a signed JWT token containing user ID and email, expiring in 1 day (`1d`).
* **`res.cookie('token', token, { httpOnly: true })`**: Stores token safely in an HTTP cookie named `token`. `httpOnly: true` prevents client-side JavaScript access for security.

---

#### 3. Logout (`POST /api/auth/logout`)
```javascript
router.post('/logout', async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful! Token deleted.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during logout.', error: error.message });
  }
});
```
* **`res.clearCookie('token')`**: Deletes the `token` cookie from the browser/client, effectively logging the user out.

---

### F. `routes/productRoutes.js` (Protected Product CRUD APIs)

```javascript
router.use(protect);
```
* **`router.use(protect)`**: Applies `authMiddleware` to **every single route** defined below in this file. Unauthenticated users will be blocked!

---

#### 1. Create Product (`POST /api/products/create`)
```javascript
router.post('/create', async (req, res) => {
  try {
    const { name, SKU, description, price, category } = req.body;

    if (!name || !SKU || !description || price === undefined || !category) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingProduct = await Product.findOne({ SKU });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this SKU already exists.' });
    }

    const newProduct = new Product({ name, SKU, description, price, category });
    await newProduct.save();

    return res.status(201).json({ message: 'Product created successfully!', product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: 'Server error creating product.', error: error.message });
  }
});
```
* Validation check ensures all fields are sent.
* `Product.findOne({ SKU })` prevents creating duplicate SKU products.
* Saves to database and returns status 201.

---

#### 2. Get All Products (`GET /api/products/getAll`)
```javascript
router.get('/getAll', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .select('name SKU description price category createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

    return res.status(200).json({
      message: 'Products fetched successfully!',
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching products.', error: error.message });
  }
});
```
* **`(page - 1) * limit`**: Pagination formula. Example: Page 2 with limit 10 skips first `(2-1)*10 = 10` documents.
* **`.select(...)`**: Chooses specific fields to return from MongoDB.
* **`.sort({ createdAt: -1 })`**: Sorts products in descending order (newest first).
* **`.skip(skip)`**: Skips specified number of items.
* **`.limit(limit)`**: Restricts output to maximum `limit` items per page.

---

#### 3. Get Single Product by ID (`GET /api/products/getSingleProduct/:id`)
```javascript
router.get('/getSingleProduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.status(200).json({ message: 'Product fetched successfully!', product });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching single product.', error: error.message });
  }
});
```
* **`req.params.id`**: Captures URL dynamic parameter (e.g. `/getSingleProduct/64f1a2b3...`).
* **`Product.findById(productId)`**: Finds matching document by MongoDB `_id`.

---

#### 4. Update Product (`PATCH /api/products/updateSingleProduct/:id`)
```javascript
router.patch('/updateSingleProduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No fields provided to update.' });
    }

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({ message: 'Product updated successfully!', product: updatedProduct });
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating product.', error: error.message });
  }
});
```
* **`PATCH` method**: Used for partial updates (updating only sent fields).
* **`Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true })`**:
  * `{ new: true }`: Returns the updated document instead of old document.
  * `{ runValidators: true }`: Re-enforces schema validation rules on update.

---

#### 5. Delete Product (`DELETE /api/products/deleteProduct/:id`)
```javascript
router.delete('/deleteProduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error deleting product.', error: error.message });
  }
});
```
* **`Product.findByIdAndDelete(productId)`**: Removes document permanently from MongoDB database.

---

## 3. How to Run the App & Connect MongoDB Compass

### Step 1: Open MongoDB Compass
1. Make sure your local MongoDB service is running (or use MongoDB Compass).
2. Connection string: `mongodb://127.0.0.1:27017`
3. Click **Connect**.
4. Once connected, your database `assignment1_db` will automatically appear when data is inserted!

### Step 2: Start the Node Server
Open Terminal in the `backend` folder and run:
```bash
npm run dev
```
You will see:
```text
Server is running on http://localhost:5000
MongoDB Database connected successfully!
```

---

## 4. Step-by-Step Postman Testing Guide

### A. Auth APIs

1. **Register User**:
   - **Method**: `POST`
   - **URL**: `http://localhost:5000/api/auth/register`
   - **Headers**: `Content-Type: application/json`
   - **Body (raw JSON)**:
     ```json
     {
       "name": "John Doe",
       "email": "john@gmail.com",
       "password": "password123"
     }
     ```
   - **Expected Status**: `201 Created`

2. **Login User**:
   - **Method**: `POST`
   - **URL**: `http://localhost:5000/api/auth/login`
   - **Body (raw JSON)**:
     ```json
     {
       "email": "john@gmail.com",
       "password": "password123"
     }
     ```
   - **Expected Status**: `200 OK`
   - **Note**: Postman will automatically save the cookie in cookie manager! You can also copy the `token` string from response.

3. **Logout User**:
   - **Method**: `POST`
   - **URL**: `http://localhost:5000/api/auth/logout`
   - **Expected Status**: `200 OK` (cookie deleted).

---

### B. Product Protected APIs

> *Make sure you are logged in first so cookie or token is set!*

1. **Create Product**:
   - **Method**: `POST`
   - **URL**: `http://localhost:5000/api/products/create`
   - **Body (raw JSON)**:
     ```json
     {
       "name": "Wireless Mouse",
       "SKU": "MSE-001",
       "description": "Ergonomic optical wireless mouse",
       "price": 25.99,
       "category": "Electronics"
     }
     ```
   - **Expected Status**: `201 Created`

2. **Get All Products (Pagination & Sorting)**:
   - **Method**: `GET`
   - **URL**: `http://localhost:5000/api/products/getAll?page=1&limit=5`
   - **Expected Status**: `200 OK`

3. **Get Single Product by ID**:
   - **Method**: `GET`
   - **URL**: `http://localhost:5000/api/products/getSingleProduct/<insert_product_id_here>`
   - **Expected Status**: `200 OK`

4. **Update Product**:
   - **Method**: `PATCH`
   - **URL**: `http://localhost:5000/api/products/updateSingleProduct/<insert_product_id_here>`
   - **Body (raw JSON)**:
     ```json
     {
       "price": 19.99
     }
     ```
   - **Expected Status**: `200 OK`

5. **Delete Product**:
   - **Method**: `DELETE`
   - **URL**: `http://localhost:5000/api/products/deleteProduct/<insert_product_id_here>`
   - **Expected Status**: `200 OK`

---

## 5. Potential Teacher Questionnaire (Viva) Questions & Answers

**Q1: Why do we use `express.json()` middleware?**
> *Answer*: By default, Node.js cannot read incoming request body data as JSON objects. `express.json()` parses raw incoming JSON request bodies into JavaScript objects accessible via `req.body`.

**Q2: What is the difference between `PUT` and `PATCH`?**
> *Answer*: `PUT` replaces the entire document with a new one, whereas `PATCH` only updates specific fields sent in `req.body` without wiping out other fields.

**Q3: Why shouldn't we store plain text passwords in MongoDB?**
> *Answer*: Storing plain text passwords is a huge security vulnerability. If database access is compromised, user credentials get leaked. We use `bcryptjs` to hash passwords securely using salt rounds.

**Q4: How does JWT authentication work in this application?**
> *Answer*: When a user logs in with valid credentials, `jwt.sign()` generates a signed JSON Web Token containing the user's ID and email. This token is sent to the client in an HTTP cookie (`token`). When accessing protected product routes, `authMiddleware` reads the cookie and verifies it using `jwt.verify()`.

**Q5: What do `skip()`, `limit()`, and `select()` do in Mongoose?**
> *Answer*:
> - `skip(n)`: Skips `n` documents in the database query (used for pagination).
> - `limit(n)`: Restricts the maximum number of documents returned to `n`.
> - `select('field1 field2')`: Specifies which fields to include or exclude in the response.

**Q6: What is `req.params` vs `req.query` vs `req.body`?**
> *Answer*:
> - `req.params`: Reads URL path parameters defined with colon notation like `/getSingleProduct/:id`.
> - `req.query`: Reads query parameters in URL after `?` like `/getAll?page=1&limit=5`.
> - `req.body`: Reads data sent in HTTP request payload (usually POST/PATCH requests).

**Q7: Why do we set `httpOnly: true` when setting cookies?**
> *Answer*: `httpOnly: true` prevents client-side JavaScript (like `document.cookie`) from reading the cookie, protecting against Cross-Site Scripting (XSS) attacks.

---
