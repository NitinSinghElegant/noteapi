import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const teachers = [
  {
    id: 1,
    name: "Soniya",
    gender: "Female",
    age: 24,
  },
  {
    id: 2,
    name: "Archna",
    gender: "Female",
    age: 26,
  },
  {
    id: 3,
    name: "Priya",
    gender: "Female",
    age: 22,
  },
];

const app = express();
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://nitinelegant:nitsar007@cluster0.hz8be.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// note schema
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Note = mongoose.model("Note", noteSchema);

// add a note
app.post("/api/note", async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "Title and message are required." });
  }
  const newNote = new Note({
    title,
    description,
  });
  await newNote.save();
  res.status(201).json({ message: "Note added successfully", note: newNote });
});
// get all notes
app.get("/api/notes", async (req, res) => {
  const notes = await Note.find();
  return res.status(201).json(notes);
});
// get a note by id

app.get("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  res.status(200).json(note);
});
// update a note
app.put("/api/notes/:id", async (req, res) => {
  try {
  } catch (error) {}
  const { id } = req.params;
  const { title, description } = req.body;
  if (!title && !description) {
    return res.status(400).json({
      message:
        "At least one field (title or description) is required to update.",
    });
  }
  const updatedNote = await Note.findByIdAndUpdate(
    id,
    { title, description },
    { new: true, runValidators: true }
  );
  if (!updatedNote) {
    res.status(404).json({ message: "Note not found" });
  }
  res
    .status(200)
    .json({ message: "Note updated successfully", note: updatedNote });
});
// delete note
app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const deletedNote = await Note.findByIdAndDelete(id);
  if (!deletedNote) {
    return res.status(404).json({ message: "Note not found" });
  }
  res.status(200).json({ message: "Note deleted successfully" });
});

// get all teacher
app.get("/api/teachers", (req, res) => {
  res.json(teachers);
});
// add a teacher
app.post("/api/teachers", (req, res) => {
  const { name, gender, age } = req.body;
  if (!name || !age || !gender) {
    res.status(400).json({ message: "Please enter alll details." });
    return;
  }
  const newTeacher = {
    id: teachers.length + 1,
    name,
    age,
    gender,
  };
  teachers.push(newTeacher);
  res.json({ message: "Teacher added successfully", newTeacher });
});
// update a teacher
app.put("/api/teachers/:id", (req, res) => {
  const teacherId = req.params.id;
  const { name, gender, age } = req.body;

  const teacher = teachers.find((i) => i.id === +teacherId);
  if (teacher) {
    if (name) {
      teacher.name = name;
    }
    if (gender) {
      teacher.gender = gender;
    }
    if (age) {
      teacher.age = age;
    }
    res.status(201).json({ message: "Teacher updated successfully." });
  } else {
    res.status(404).json({ message: "Teacher not found." });
  }
});
// get a single teacher
app.get("/api/teacher/:id", (req, res) => {
  const teacherId = req.params.id;
  const teacher = teachers.find((t) => t.id === +teacherId);
  if (teacher) {
    res.json(teacher);
  } else {
    res.status(404).json({ message: "Teacher not found" });
  }
});
app.delete("/api/teacher/:id", (req, res) => {
  const teacherId = req.params.id;
  const index = teachers.findIndex((t) => t.id === +teacherId);
  if (index !== -1) {
    teachers.splice(index, 1);
    res.json({ message: "Teacher is deleted successfully", teachers });
  } else {
    res.status(404).json({ message: "Teacher not found" });
  }
});

// get a teacher
app.listen(3000, () => {
  console.log(`server is working`);
});
