<center><img src="https://github.com/insaid2018/Term-1/blob/master/Images/INSAID_Full%20Logo.png?raw=true" width="240" height="100" /></center>

<center><h1>NoteIt: Code Walkthrough</h1></center>

## **Project Structure:**

```
├── backend
|   ├── models
|   |   └── noteitDB.js
|   ├── routes
|   |   └── note.js
|   ├── server.js
|   ├── package-lock.json
|   └── package.json
|
└── frontend
    ├── node_modules
    ├── public
    ├── src
    |   └── components
    |   |   └── NavBar.jsx
    |   |   └── CreateNoteForm.jsx
    |   |   └── EditNoteForm.jsx
    |   |   └── Note.jsx
    |   |   └── NotesList.jsx
    |   ├── App
    │   ├── index.css
    │   └── index.js
    ├── build.css
    ├── package-lock.json
    ├── package.json
    ├── tailwind.config.js
    └── README.md
```

> ## **BACKEND**

### 1. **`noteiDB.js`**

```javascript
const mongoose = require("mongoose");

const noteitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Note = mongoose.model("Note", noteitSchema);

module.exports = Note;
```

- `noteitDB.js` file sets up the database schema and model for our NoteIt application using Mongoose, allowing us to work with notes in our MongoDB database easily.

- In this file, we are using the Mongoose library to define the database schema and model for our NoteIt application. We start by requiring the `mongoose` module, which will allow us to interact with the MongoDB database.

- Next, we define the `noteitSchema` using the `mongoose.Schema` class. This schema represents the structure of a note in our application. We specify three fields: `title`, `content`, and `created_at`. The `title` field is of type `String` and is marked as required, meaning every note must have a title. Similarly, the `content` field is of type `String` and is also marked as required. The `created_at` field is of type `Date` and has a default value of the current date and time using `Date.now`.

- To configure the schema options, we set the `versionKey` option to `false`. This ensures that Mongoose doesn't add a `__v` property to documents by default, which is used for versioning.

- After defining the schema, we create the `Note` model using `mongoose.model`. This model represents the collection in the database where our notes will be stored. We pass in two arguments: the model name (in this case, "Note") and the schema (`noteitSchema`).

- Lastly, we export the `Note` model from this module so that we can use it in other parts of our application, such as in our routes or controllers.

### 2. **`note.js`**

```javascript
const express = require("express");
const mongoose = require("mongoose");

const Note = require("../models/noteitDB");

const router = express.Router();

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single note
router.get("/:id", getNote, (req, res) => {
  res.json(res.note);
});

// Create a new note
router.post("/", async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    created_at: req.body.created_at,
  });
  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a note
router.patch("/:id", getNote, async (req, res) => {
  if (req.body.title != null) {
    res.note.title = req.body.title;
  }
  if (req.body.content != null) {
    res.note.content = req.body.content;
  }
  if (req.body.created_at != null) {
    res.note.created_at = req.body.created_at;
  }
  try {
    const updatedNote = await res.note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a note
router.delete("/:id", async (req, res) => {
  try {
    const result = await Note.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getNote(req, res, next) {
  let note;
  try {
    note = await Note.findById(req.params.id);
    if (note == null) {
      return res.status(404).json({ message: "Note not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.note = note;
  next();
}

module.exports = router;
```

- `note.js` file sets up the routes for handling CRUD operations on notes in the NoteIt application. It defines routes to get all notes, get a single note, create a new note, update a note, and delete a note.

- First, we require the `express` and `mongoose` modules to work with the Express.js framework and MongoDB.

- We also import the `Note` model from the `../models/noteitDB` file, which we defined earlier.

- Next, we create an instance of the Express Router using `express.Router()`. This will allow us to define our API routes.

  1. **Get all notes**: The `router.get("/")` defines a route to retrieve all the notes. Inside the route handler, we use `Note.find()` to fetch all the notes from the database. If the operation is successful, we respond with a JSON representation of the notes using `res.json(notes)`. If an error occurs, we send a 500 status code along with an error message.

  2. **Get a single note**: The `router.get("/:id")` defines a route to retrieve a single note by its ID. We use a custom middleware function `getNote` to find the note based on the provided ID. If the note is found, we respond with the note as JSON using `res.json(res.note)`.

  3. **Create a new note**: The `router.post("/")` defines a route to create a new note. We create a new instance of the `Note` model using the data from the request body. If the note is successfully saved to the database, we respond with a 201 status code and the newly created note as JSON using `res.status(201).json(newNote)`. If there is an error, we send a 400 status code along with an error message.

  4. **Update a note**: The `router.patch("/:id")` defines a route to update a note by its ID. Again, we use the `getNote` middleware to retrieve the note. We then check the request body for updated values for the note's title, content, and created_at fields. If any of these fields are provided, we update the corresponding fields of the retrieved note. After saving the updated note, we respond with the updated note as JSON using `res.json(updatedNote)`. If an error occurs, we send a 400 status code along with an error message.

  5. **Delete a note**: The `router.delete("/:id")` defines a route to delete a note by its ID. We use `Note.deleteOne()` to remove the note from the database based on the provided ID. If the note is not found, we respond with a 404 status code and a "Note not found" message. If the deletion is successful, we respond with a JSON object containing a "Note deleted" message.

- Lastly, we have the `getNote` function, which is an asynchronous function used as middleware to fetch a specific note based on the ID. It attempts to find the note using `Note.findById()`. If the note is not found, a 404 status code is returned with an error message. If there's an error during the database operation, a 500 status code is returned with an error message. If the note is found, it is attached to the `res` object for further use, and the control is passed to the next middleware.

- Finally, we export the `router` instance at the end of the file, making these routes available for use in other parts of the application.

### 3. **`server.js`**

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const noteRouter = require("./routes/note");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/notes", noteRouter);

const dbUrl = "mongodb://127.0.0.1:27017/noteitDB";
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to NoteIt");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

- `server.js` file sets up the backend server for the NoteIt application. It initializes the Express application, sets up middleware, connects to the MongoDB database, defines routes, and starts the server to listen for incoming requests.

- First, we require the necessary modules: `express` for creating the server, `body-parser` for parsing JSON data from the request body, `mongoose` for connecting to the database, `cors` for handling cross-origin resource sharing, and `noteRouter` to handle the routes for notes.

- We then create an instance of the Express application using `express()` and assign it to the `app` variable. This instance will be used to handle HTTP requests and responses.

- Next, we set up middleware using `app.use()`:

  1. We use `body-parser.json()` to parse JSON data from the request body.
  2. We use `cors()` to enable Cross-Origin Resource Sharing, allowing requests from different domains or origins.
  3. We mount the `noteRouter` at the `/notes` endpoint. This means that any requests starting with `/notes` will be handled by the `noteRouter`.

- The next block of code connects to the MongoDB database using Mongoose. We define the `dbUrl` variable with the connection URL for the database. Then, we use `mongoose.connect()` to establish the connection. We pass in the `dbUrl` and set some options: `useNewUrlParser` to ensure compatibility with the MongoDB driver's new connection string parser, and `useUnifiedTopology` to use the new Server Discovery and Monitoring engine. If the connection is successful, "Database connected" is logged to the console. If there's an error, the error is logged to the console.

- The next route is a simple GET route that responds with "Welcome to NoteIt" when the root URL ("/") is accessed.

- Lastly, we specify the port on which the server will listen. We use the `process.env.PORT` variable, which allows the server to use the port specified in the environment variables if it exists. If not, it defaults to port 5000. The server starts listening on the specified port, and once it's running, a message is logged to the console.

> ## **FRONTEND**

### 1. **`NavBar.jsx`**

```javascript
import React from "react";
import { GiNotebook } from "react-icons/gi";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="bg-yellow-400 fixed left-0 top-0 w-full z-10 ease-in duration-300">
      <div className="max-w-[1920px] m-auto flex justify-center items-center p-4 text-white px-10">
        <Link to="/" className="flex">
          <GiNotebook size={35} className="mx-2" />
          <h1 className="font-bold lg:text-4xl md:text-3xl text-2xl cursor-pointer">
            NoteIt
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
```

### 1. **`NavBar.jsx`**

- `NavBar.jsx` component renders a fixed navigation bar at the top of the page, displaying the NoteIt logo, and providing a link to the homepage.

1. First, we import the necessary dependencies:

   - `React` is imported from the "react" package.
   - The `GiNotebook` icon from the "react-icons/gi" package is imported. This icon will be used as a visual representation in the navigation bar.
   - The `Link` component from "react-router-dom" is imported. It allows us to create links within the application.

2. Next we define NavBar component is as a functional component using an arrow function.

3. Inside the component's return statement, we have the JSX code that represents the navigation bar UI.

   - The outermost `div` element sets the background color of the navigation bar to a yellowish tone (`bg-yellow-400`). It is fixed to the top-left of the screen (`fixed left-0 top-0`) and spans the full width (`w-full`). The `z-10` class ensures that the navigation bar is placed above other elements.
   - Within this outer `div`, we have an inner `div` that limits the maximum width of the navigation bar to 1920 pixels (`max-w-[1920px]`) and centers its content horizontally (`m-auto flex justify-center items-center`). It also adds padding on all sides (`p-4`).
   - Inside the inner `div`, we use the `Link` component to create a link to the root URL ("/") of the application. When clicked, it navigates to the home page.
   - Within the `Link` component, we have a flex container with the `flex` class. It contains the `GiNotebook` icon, imported from `react-icons/gi`, which represents a notebook. The `size={35}` prop sets the size of the icon to 35 pixels. We also apply some margin (`mx-2`) to provide spacing.
   - Next, we have an `h1` element with a bold font weight (`font-bold`). The text size is responsive based on screen size: it is set to 4xl on large screens (`lg:text-4xl`), 3xl on medium screens (`md:text-3xl`), and 2xl on small screens (`text-2xl`). It also has a cursor pointer (`cursor-pointer`) for interactivity. The text content is "NoteIt", representing the name of the application.

4. Finally, we export the `NavBar` component as the default export of the module.

### 2. **`CreateNoteForm.jsx`**

```javascript
import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:5000";

function CreateNoteForm(props) {
  const [isExpanded, setExpanded] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  async function submitNote(event) {
    event.preventDefault();

    if (!note.title || !note.content) {
      toast.error("All fields are mandatory!");
      return;
    }

    try {
      const response = await axios.post("/notes", note);
      setNote({
        title: "",
        content: "",
      });
      toast.success("Note Added Successfully!");
      props.fetchNotes();
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div className="mt-32 flex justify-center items-center">
      <form className="w-[720px] mx-8 my-5 px-4 rounded-lg shadow-lg shadow-gray-300 items-center justify-center place-items-center">
        {isExpanded ? (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
            required
            className="w-full p-2 text-2xl text-semibold outline-none"
          />
        ) : null}

        <TextareaAutosize
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          minRows={1}
          maxRows={15}
          required
          className="w-full p-2 text-2xl outline-none resize-none"
        />

        {isExpanded && (
          <button
            onClick={submitNote}
            className="bg-yellow-400 rounded-full p-2 text-white float-right mr-10 my-5 shadow-md hover:bg-yellow-300 duration-300 transform hover:scale-110"
          >
            <HiPlus size={30} className="hover:scale-110 duration-300" />
          </button>
        )}
      </form>
    </div>
  );
}

export default CreateNoteForm;
```

- `CreateNoteForm.jsx` file defines the component for creating a new note in NoteIt application. It includes form fields for the note title and content, handles form submission, and displays toast notifications for success or failure.

1. First, we import the necessary dependencies for the component:

   - `React` from the "react" package: This allows us to define and use React components.
   - `HiPlus` from the "react-icons/hi" package: This is an icon component from the "react-icons" library, specifically the "HiPlus" icon.
   - `axios` for making HTTP requests to the backend server.
   - `TextareaAutosize` from the "react-textarea-autosize" package: This is a textarea component that automatically adjusts its height based on the content.
   - `toast` from the "react-toastify" package: This is used to display toast notifications.

2. Then we define `CreateNoteForm` component as a functional component using the `function` keyword.

3. Within the component, we use the `useState` hook to define state variables:

   - `isExpanded`: This variable keeps track of whether the note form is expanded or not.
   - `note`: This variable holds the note object with `title` and `content` properties. It is initialized with empty values.

4. The `handleChange` function is responsible for updating the `note` state whenever the user types in the input fields. It updates the `note` state by merging the new value with the existing state using the spread operator.

5. The `submitNote` function is an async function that handles the submission of the note form. It is triggered when the form is submitted. It performs the following tasks:

   - Prevents the default form submission behavior.x
   - Checks if the `title` and `content` fields are filled. If any field is empty, it displays an error toast using the `react-toastify` package. and returns early, Otherwise, it sends a POST request to the backend server using `axios.post("/notes", note)`.
   - If the request is successful, it resets the `note` state by setting `title` and `content` to empty strings, displays a success toast, and fetches the updated list of notes by calling `props.fetchNotes()`.
   - If there's an error, it displays an error toast and logs the error to the console.

6. The `expand` function is called when the textarea is clicked, and it sets the `isExpanded` state to `true`, expanding the note form.

7. The JSX code represents the structure and content of the create note form. It uses Tailwind CSS classes for styling and layout:

   - The outermost `<div>` element has the following Tailwind CSS classes:

     - `mt-32`: Adds a top margin of 32 units.
     - `flex`: Sets the display property to flex.
     - `justify-center`: Centers the content horizontally.
     - `items-center`: Centers the content vertically.

   - Inside the `<div>`, we have a `<form>` element that has the following Tailwind CSS classes:

     - `w-[720px]`: Sets the width to 720 pixels.
     - `mx-8`: Adds horizontal margin of 8 units.
     - `my-5`: Adds vertical margin of 5 units.
     - `px-4`: Adds horizontal padding of 4 units.
     - `rounded-lg`: Rounds the corners of the form.
     - `shadow-lg`: Adds a shadow effect to the form.
     - `shadow-gray-300`: Sets the shadow color to gray.
     - `justify-center items-center`: Centers the content both horizontally and vertically.

   - Inside the form, there's an `<input>` element for the title field, which is conditionally rendered based on the `isExpanded` state. It has the following Tailwind CSS classes:

     - `w-full`: Sets the width to 100%.
     - `p-2`: Adds padding of 2 units.
     - `text-2xl`: Sets the font size to 2xl.
     - `text-semibold`: Sets the font weight to semibold.
     - `outline-none`: Removes the default outline styling.

   - The `<TextareaAutosize>` component represents the textarea for the note content. It automatically adjusts its height based on the content. It triggers the `expand` function when clicked and updates the `note` state when its value changes. It has the following Tailwind CSS classes:

     - `w-full`: Sets the width to 100%.
     - `p-2`: Adds padding of 2 units.
     - `text-2xl`: Sets the font size to 2xl.
     - `outline-none`: Removes the default outline styling.
     - `resize-none`: Disables the resizing of the textarea by the user.

   - A button is conditionally rendered when the form is expanded. It triggers the `submitNote` function when clicked and displays the "HiPlus" icon. It has the following Tailwind CSS classes:
     - `bg-yellow-400`: Sets the background color to yellow-400.
     - `rounded-full`: Rounds the corners of the button.
     - `p-2`: Adds padding of 2 units.
     - `text-white`: Sets the text color to white.
     - `float-right`: Positions the button to the right.
     - `mr-10`: Adds right margin of 10 units.
     - `my-5`: Adds vertical margin of 5 units.
     - `shadow-md`: Adds a medium shadow effect.
     - `hover:bg-yellow-300`: Sets the background color to yellow-300 on hover.
     - `duration-300`: Sets the transition duration to 300ms.
     - `hover:scale-110`: Scales the button to 1.1 times its size on hover.

8. Finally, we export the `CreateNoteForm` component as the default export, making it available for use in other parts of the application.

### 3. **`CreateNoteForm.jsx`**

```javascript
import React, { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { HiX } from "react-icons/hi";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5000";

function EditNoteForm(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { noteId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/notes/${noteId}`)
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        setTitle(response.title);
        setContent(response.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.patch(`/notes/${noteId}`, {
        title,
        content,
        created_at: Date.now(),
      });
      toast.success("Note Updated Successfully!");
      props.fetchNotes();
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30">
      <div className="w-[720px] mx-8 my-5 px-4 bg-white rounded-lg shadow-lg">
        <form className="flex flex-col">
          <input
            name="title"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
            placeholder="Title"
            required
            className="w-full p-2 text-2xl font-semibold outline-none"
          />

          <TextareaAutosize
            name="content"
            onChange={(event) => setContent(event.target.value)}
            value={content}
            placeholder="Content"
            required
            className="w-full p-2 text-2xl outline-none resize-none"
          />

          <div className="flex justify-end m-5">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-yellow-400 mr-3 rounded-full p-2 text-white shadow-md hover:bg-yellow-300 duration-300 transform hover:scale-110"
            >
              <FiCheck size={30} className="hover:scale-110 duration-300" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-400 rounded-full p-2 ml-2 text-white shadow-md hover:bg-red-300 duration-300 transform hover:scale-110"
            >
              <HiX size={30} className="hover:scale-110 duration-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditNoteForm;
```

- `EditNoteForm.jsx` defines the form component for editing an existing note in NoteIt application. It uses Tailwind CSS classes to style the components, providing visual appeal and responsiveness to the form elements and buttons.

1. First, we import the necessary dependencies for the component, including React, useEffect, useState, FiCheck and HiX icons from react-icons, axios, TextareaAutosize, toast from react-toastify, useNavigate, and useParams from react-router-dom.

2. Then we define `EditNoteForm` component is as a functional component using the `function` keyword.

3. Within the component, we define state variables using the `useState` hook: `title` and `content`.

4. We use the `useParams` hook from react-router-dom to get the `noteId` parameter from the URL.

5. We use the `useNavigate` hook from react-router-dom to get access to the navigation object, which allows us to navigate to different routes.

6. We use the `useEffect` hook to fetch the note data when the component mounts. We make a GET request to the server using the `fetch` function and update the `title` and `content` states based on the response.

7. The `handleSubmit` function is defined to handle form submission. It makes a PATCH request to update the note with the provided `title`, `content`, and `created_at` using `axios.patch()`. It displays success or error toast notifications, fetches the updated notes, and navigates back to the home page ("/").

8. The `handleCancel` function is defined to handle the cancellation of the editing process. It navigates back to the home page ("/") without making any changes.

9. The JSX code represents the structure and content of the edit note form:

   - The outermost `<div>` element has the Tailwind CSS classes "fixed inset-0 flex justify-center items-center bg-black bg-opacity-30" to create a fixed overlay with a black semi-transparent background and center the content.
   - Inside the `<div>`, we have another `<div>` element with Tailwind CSS classes "w-[720px] mx-8 my-5 px-4 bg-white rounded-lg shadow-lg" to define the width, margins, padding, background color, and visual appearance of the form container.
   - Within the form container, we have a `<form>` element with Tailwind CSS class "flex flex-col" to arrange the form elements in a vertical column.
   - The `<input>` element is used for the note title. It has Tailwind CSS classes "w-full p-2 text-2xl font-semibold outline-none" to control its width, padding, font size, font weight, and remove the default outline.
   - The `<TextareaAutosize>` component is used for the note content textarea. It has Tailwind CSS classes "w-full p-2 text-2xl outline-none resize-none" to control its width, padding, font size, and remove the default outline. It automatically adjusts its height based on the content.
   - Inside the form, we have a `<div>` element with Tailwind CSS classes "flex justify-end m-5" to align the buttons to the right side of the form.
   - Two `<button>` elements are rendered for submitting the form and canceling the edit.
   - The submit button has Tailwind CSS classes "bg-yellow-400 mr-3 rounded-full p-2 text-white shadow-md hover:bg-yellow-300 duration-300 hover:scale-110" to style the button with a yellow background, rounded shape, padding, text color, box shadow, and hover effect. It displays a check icon using the `FiCheck` component from the "react-icons" package.
   - The cancel button has Tailwind CSS classes "bg-red-400 rounded-full p-2 ml-2 text-white shadow-md hover:bg-red-300 duration-300 hover:scale-10" to style the button with a red background, rounded shape, padding, text color, box shadow, and hover effect. It displays a cross icon using the `HiX` component from the "react-icons" package.

10. Finally, we export the component as the default export.

### 4. **`Note.jsx`**

```javascript
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EditNoteForm from "./EditNoteForm";

function Note(props) {
  const [showEditForm, setShowEditForm] = useState(false);

  const navigate = useNavigate();

  function handleEditClick(id) {
    setShowEditForm(true);
    navigate("notes/edit/" + id);
  }

  function handleDeleteClick() {
    props.onDelete(props.id);
  }

  function handleEditCancel() {
    setShowEditForm(false);
  }

  const formattedDate = new Date(props.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div className="my-5 mr-5 rounded-xl shadow-lg shadow-gray-50 p-3 w-80 float-left border-[1px]">
      <h1 className="font-medium text-2xl mb-2">{props.title}</h1>
      <p
        className="text-xl mb-3 break-words whitespace-pre-wrap"
        id="note-content"
      >
        {props.content}
      </p>
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">{formattedDate}</p>
        <div className="flex items-center">
          <button
            className="relative bg-yellow-400 rounded-full p-2 mr-3 hover:bg-yellow-300 duration-300 hover:scale-110"
            onClick={() => handleEditClick(props.id)}
          >
            <RiEdit2Fill
              size={20}
              className="text-white duration-300 hover:scale-105"
            />
          </button>
          <button
            className="relative bg-yellow-400 rounded-full p-2 hover:bg-yellow-300 duration-300 hover:scale-110"
            onClick={handleDeleteClick}
          >
            <FaTrash
              size={20}
              className="text-white duration-300 hover:scale-1"
            />
          </button>
        </div>
      </div>
      {showEditForm && (
        <EditNoteForm
          onUpdate={() => {
            toast.success("Note Updated Successfully!");
          }}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
}

export default Note;
```

- `Note.jsx` defines the component for rendering an individual note in the NoteIt application. It displays the note's title, content, creation date, and provides buttons for editing and deleting the note. When the edit button is clicked, it renders the `EditNoteForm` component for updating the note. The component utilizes Tailwind CSS classes for styling, resulting in a visually appealing and responsive layout.

1. First, we import the necessary dependencies for the component, including React, useState, FaTrash and RiEdit2Fill icons from react-icons, useNavigate from react-router-dom, toast from react-toastify, and the `EditNoteForm` component.

2. Then we define `Note` component as a functional component using the `function` keyword.

3. Within the component, we define a state variable `showEditForm` using the `useState` hook to keep track of whether the edit form should be displayed or not.

4. We use the `useNavigate` hook from "react-router-dom" to get the navigation object for programmatically navigating to different routes.

5. The `handleEditClick` function is defined to handle the click event when the edit button is clicked. It sets the `showEditForm` state to true and navigates to the edit route for the specific note using the `navigate` function.

6. The `handleDeleteClick` function is defined to handle the click event when the delete button is clicked. It calls the `onDelete` function passed as a prop to delete the note.

7. The `handleEditCancel` function is defined to handle the cancellation of the edit form. It sets the `showEditForm` state to false.

8. The `formattedDate` variable uses the `toLocaleString` method to format the `props.createdAt` date value into a human-readable format with the year, month, day, hour, and minute.

9. The JSX code represents the structure and content of a note:

   - The outermost `<div>` element has Tailwind CSS classes to control the margin, rounded corners, box shadow, padding, and width of the note container.
   - Inside the container, we have an `<h1>` element to display the note title. It has a Tailwind CSS class for styling the font size and margin.
   - The note content is displayed using a `<p>` element. It has Tailwind CSS classes to control the font size, margin, and handle line breaks and white spaces.
   - The note's creation date is displayed using a `<p>` element with a Tailwind CSS class for styling the text color and size.
   - The edit and delete buttons are displayed using `<button>` elements with Tailwind CSS classes for styling the background color, rounded shape, padding, and hover effect. The buttons include the edit and delete icons from the react-icons package.
   - When the edit button is clicked and the `showEditForm` state is true, the `<EditNoteForm>` component is rendered. It is passed the `onUpdate` and `onCancel` functions as props to handle successful updates and cancellations.

10. Finally, the `Note` component is exported as the default export.

### 5. **`NotesList.jsx`**

```javascript
import React from "react";
import Note from "./Note";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

const NotesList = ({ notes, onDelete, onEdit }) => {
  // Reverse the notes array to display the latest note first
  const reversedNotes = notes.slice().reverse();

  return (
    <div className="mt-16 mx-9 justify-center place-items-center items-start grid grid-cols-1 md:grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:justify-normal ">
      {reversedNotes.map((noteItem) => (
        <Note
          key={noteItem._id}
          title={noteItem.title}
          content={noteItem.content}
          createdAt={noteItem.created_at}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default NotesList;
```

- `NotesList.jsx` defines the component responsible for rendering the list of notes in the NoteIt application. It receives an array of notes as a prop and iterates over each note, rendering a `Note` component for each one. The `NotesList` component utilizes Tailwind CSS classes to create a responsive grid layout for the notes, ensuring a visually pleasing display of the notes in the UI.

1. First, we import the necessary dependencies for the component, including React, and the `Note` component.

2. We the define the `NotesList` component as a functional component using the arrow function syntax.

3. The component receives the following props: `notes`, `onDelete`, and `onEdit`.

4. Inside the component, we create a new array `reversedNotes` by calling the `slice()` method on the `notes` array and then using `reverse()` to reverse the order of the notes. This is done to display the latest note first.

5. The JSX code represents the structure and content of the notes list:

   - The outermost `<div>` element has Tailwind CSS classes for styling, including margins, grid layout, and responsive behavior.
   - Inside the `<div>`, we use the `map()` method to iterate over each `noteItem` in the `reversedNotes` array.
   - For each `noteItem`, we render a `Note` component, passing the necessary props: `key` (using the note's `_id`), `id`, `title`, `content`, `createdAt`, `onDelete`, and `onEdit`.

6. Finally, the `NotesList` component is exported as the default export.

### 6. **`App.js`**

```javascript
import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import CreateNoteForm from "./components/CreateNoteForm";
import NotesList from "./components/NotesList";
import EditNoteForm from "./components/EditNoteForm";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5000";

const App = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const response = await axios.get("/notes");
      setNotes(response.data);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  }

  async function addNote(newNote) {
    try {
      const response = await axios.post("/notes", newNote);
      setNotes((prevNotes) => [...prevNotes, response.data]);
      toast.success("Note Added Successfully!");
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  }

  async function deleteNote(id) {
    if (
      window.confirm(
        "Are you sure you want to delete the note? This action is permanent."
      )
    ) {
      try {
        await axios.delete(`/notes/${id}`);
        setNotes(notes.filter((note) => note._id !== id));
        toast.success("Note deleted successfully!");
      } catch (error) {
        toast.error(error);
        console.log(error);
      }
    }
  }

  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <ToastContainer
          autoClose={1000}
          hideProgressBar={true}
          newestOnTop={true}
          theme="colored"
        />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <CreateNoteForm onAdd={addNote} fetchNotes={fetchNotes} />
                <NotesList notes={notes} onDelete={deleteNote} />
              </div>
            }
          />

          <Route
            path="/notes/edit/:noteId"
            element={<EditNoteForm fetchNotes={fetchNotes} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
```

- `App.js` defines the main component of the NoteIt application. It sets up routing using react-router-dom and contains the necessary logic and state to manage notes. The `App` component renders the navigation bar, toast notifications, and different components based on the defined routes.

1. First, we import the necessary dependencies and components, including React, the `NavBar`, `CreateNoteForm`, `NotesList`, and `EditNoteForm` components, as well as various utilities from axios, react-toastify, and react-router-dom.

2. Then, we set the base URL for axios to "http://localhost:5000" so that all subsequent requests will be sent to this URL.

3. Next, we define `App` component as a functional component using the arrow function syntax.

4. Inside the component, we define the `notes` state using the `useState` hook. It represents the array of notes in the application.

5. We use the `useEffect` hook to fetch the notes when the component mounts. The `fetchNotes` function is called within the `useEffect` hook.

6. The `fetchNotes` function is an asynchronous function that makes a GET request to "/notes" using axios. Upon successful response, it sets the `notes` state with the received data.

7. The `addNote` function is an asynchronous function that makes a POST request to "/notes" with the newNote data. Upon successful response, it adds the new note to the `notes` state.

8. The `deleteNote` is an asynchronous function that takes an `id` parameter. It prompts the user to confirm the deletion and, if confirmed, sends a DELETE request to "/notes/:id" using axios to delete the note from the server. If the request is successful, it updates the `notes` state by filtering out the deleted note from the array. It also displays a success toast. If the request fails, it displays an error toast.

9. The JSX code represents the structure and routing of the application:

   - We wrap the entire component with the `BrowserRouter` component from "react-router-dom" to enable routing functionality.
   - Inside the `<div>`, we render the `NavBar` component, which represents the navigation bar at the top of the application.
   - The `ToastContainer` component from "react-toastify" is used to display toast notifications.
   - The `Routes` component is used to define the routes for different components.
   - Inside the `Routes`, we define two routes using the `Route` component:
     - The first route has a path of "/" and renders a `<div>` containing the `CreateNoteForm` component and the `NotesList` component. It passes the necessary props: `onAdd` (addNote function) and `fetchNotes` (fetchNotes function). The `CreateNoteForm` component is responsible for adding new notes, while the `NotesList` component displays the list of notes.
     - The second route has a path of "/notes/edit/:noteId" and renders the `EditNoteForm` component. It passes the `fetchNotes` function as a prop. This component is responsible for editing existing notes.

10. Finally, we export `App` component as the default export.
