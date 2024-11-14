require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const User = require("./models/user.model");
const Note = require("./models/note.model");

const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

// MongoDB Connection with success and error handling
mongoose
  .connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json()); // JSON parsing middleware
app.use(cors({ origin: "*" })); // Allow all origins (adjust in production)

// ROUTES

//normal route
app.get("/", (req, res) => {
  res.json({ data: "hello Aman" });
});

//creating new Account

// app.post("/create-account", async (req, res) => {
//   console.log(req.body);
//   const { fullName, email, password } = req.body;

//   if (!fullName) {
//     return res
//       .status(400)
//       .json({ error: true, message: "Full Name is required" });
//   }
//   if (!email) {
//     return res
//       .status(400)
//       .json({ error: true, message: "Email Name is required" });
//   }
//   if (!password) {
//     return res
//       .status(400)
//       .json({ error: true, message: "Password is required" });
//   }
//   //this will find in the database someone with the same email is available or not.
//   const isUser = await User.findOne({ email: email });

//   if (isUser) {
//     return res.json({
//       error: true,
//       message: "User already exits",
//     });
//   }
//   //this is the payload that we made for the given data.
//   const user = new User({
//     fullName,
//     email,
//     password,
//   });

//   await user.save();

//   //that payload is used to create the tocken.
//   const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: "30m",
//   });

//   return res.json({
//     error: false,
//     user,
//     accessToken,
//     message: "Registration Successful",
//   });
// });
app.post("/create-account", async (req, res) => {
  try {
    //console.log(req.body); // For debugging purposes
    const { fullName, email, password } = req.body;

    // Input validation
    if (!fullName) {
      return res
        .status(400)
        .json({ error: true, message: "Full Name is required" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ error: true, message: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ error: true, message: "Password is required" });
    }

    // Check if the user already exists
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists" });
    }

    // Create a new user (consider hashing the password before saving)
    const user = new User({
      fullName,
      email,
      password, // hash the password before saving it
    });

    await user.save();

    //console.log("Hii");

    // Generate JWT token (don't include the entire user object)
    const accessToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m",
      }
    );

    //console.log("after token Hii");

    return res.status(201).json({
      error: false,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      accessToken,
      message: "Registration Successful",
    });
  } catch (error) {
    console.error("Error during account creation:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

//login api
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  //searching a data in the database if the user is available in the database
  const userInfo = await User.findOne({ email: email });
  //if user is not found
  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  //if the user is found then we will login
  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } else {
    return res
      .status(400)
      .json({ error: true, message: "Invalid Credentials" });
  }
});

//API for adding notes.
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//API for editing notes
app.put("/edit-post/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user; //this is the user details coming from authenticateToken.

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res
        .status(404)
        .json({ error: true, message: "Note to be edited not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//API for getting all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user; //getting the user data from authenticateToken
  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

    return res.json({
      error: false,
      notes,
      message: "All notes retrived successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server Error",
    });
  }
});

//delete the note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    //if note was note found
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    //if note was found
    //note.delete() or note.deleteOne() wont make much difference.
    await note.deleteOne({ _id: noteId, userId: user._id });

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

//updating isPinned notes
app.put("/edit-isPinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user; //this is the user details coming from authenticateToken.

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res
        .status(404)
        .json({ error: true, message: "Note to be edited not found" });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//api for getting a user
app.get("/get-user", authenticateToken, async (req, res) => {
  // Check if req.user has 'user' key (like in login) or is a direct object (like in signup)
  const user = req.user.user || req.user; // This works for both structures

  // Use destructuring from the appropriate structure
  const userId = user._id || user.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID not found in token" });
  }

  const isUser = await User.findOne({ _id: userId });
  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "full data of users",
  });
});

//Search Notes
app.get("/search-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error:true,
      message:"Internal Server error"
    })
  }
});

//Use a dynamic port (process.env.PORT) or default to 8000
const PORT = process.env.PORT || 8000;
app.listen(8000, () => {
  console.log(`Server is running on port ${PORT}`);
});

//Export the app for testing or external use
module.exports = app;
