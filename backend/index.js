require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const sequelize = require("./config/sequelize"); // Sequelize instance
const { authenticateToken } = require("./utilities"); // Authentication middleware
const User = require("./models/user.model");
const Note = require("./models/note.model");

const app = express();
// CORS Configuration for a Specific Origin
const corsOptions = {
  origin: 'https://mynotessql.netlify.app',  // Only allow this domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Define allowed headers
};

app.use(cors(corsOptions));
app.use(express.json());

// Sync Sequelize models with the database
sequelize.sync({ force: false })
  .then(() => {
    console.log("MySQL database & tables synced successfully.");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

  app.get('/', (req, res) => {
    res.send('Hello, from Notes Server!');
  });

// Route: Create Account
app.post("/create-account", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ where: { email } });
    if (isUser) {
      return res.status(400).json({ error: true, message: "User already exists" });
    }

    const user = await User.create({ fullName, email, password });

    const accessToken = jwt.sign({ email: user.email, id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });

    return res.status(201).json({
      error: false,
      user: { id: user.id, fullName: user.fullName, email: user.email },
      accessToken,
      message: "Registration Successful",
    });
  } catch (error) {
    console.error("Error during account creation:", error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Route: Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const userInfo = await User.findOne({ where: { email } });
  if (!userInfo || userInfo.password !== password) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const accessToken = jwt.sign({ email: userInfo.email, id: userInfo.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });


  return res.json({
    error: false,
    message: "Login Successful",
    email,
    accessToken,
  });
});

// Route: Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ error: true, message: "Title and content are required" });
  }

  try {
    const note = await Note.create({
      title,
      content,
      tags: tags || [],
      userId,
    });

    return res.json({ error: false, note, message: "Note added successfully" });
  } catch (error) {
    console.error("Error adding note:", error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

//Route:Get user
app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from the token
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id: user.id, fullName: user.fullName, email: user.email });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

// Route: Get All Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  try {
    // Extract userId from the decoded JWT token
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    // Retrieve all notes belonging to the user
    const notes = await Note.findAll({
      where: { userId },
      order: [["isPinned", "DESC"]],
    });
    
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error retrieving notes:", error);
    res.status(500).json({ error: "Failed to retrieve notes." });
  }
});


// Route: Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const userId = req.user.id;

  try {
    const note = await Note.findOne({ where: { id: noteId, userId } });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    return res.json({ error: false, note, message: "Note updated successfully" });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Route: Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.user.id;

  console.log(noteId);
  console.log(userId);

  try {
    const note = await Note.findOne({ where: { id: noteId, userId } });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    await note.destroy();

    return res.json({ error: false, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Updating the isPinned status of a note
app.put("/edit-isPinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const userId = req.user.id; // assuming req.user is set by authenticateToken middleware

  try {
    const note = await Note.findOne({ where: { id: noteId, userId } });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note to be edited not found",
      });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("Error updating isPinned:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

const { Op } = require("sequelize");

// Search Notes
app.get("/search-notes/", authenticateToken, async (req, res) => {
  const userId = req.user.id; // User ID retrieved from authenticateToken
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingNotes = await Note.findAll({
      where: {
        userId, // Match notes belonging to the logged-in user
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } }, // Case-insensitive search in the title
          { content: { [Op.like]: `%${query}%` } }, // Case-insensitive search in the content
        ],
      },
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved successfully",
    });
  } catch (error) {
    console.error("Error searching notes:", error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
