<<<<<<< HEAD
# MERN Stack Notes Application

A full-featured notes application built using the MERN stack (MongoDB, Express, React, Node.js). This app allows users to create, edit, delete, search, and manage notes with features like authentication and note pinning.

## Features

1. **User Authentication**: Secure user registration and login using JWT.
2. **CRUD Operations**: Create, read, update, and delete notes.
3. **Pin Important Notes**: Users can pin notes to the top for quick access.
4. **Search Notes**: Search through your notes by title or content.
5. **Responsive Design**: Works well on both desktop and mobile devices.

## Technologies Used

1. **MongoDB**: Database to store users and notes.
2. **Express**: Backend framework to handle API requests.
3. **React**: Frontend library for building the user interface.
4. **Node.js**: Runtime environment for executing JavaScript on the server.
5. **JWT (JSON Web Tokens)**: Used for secure authentication.
6. **Mongoose**: ORM for MongoDB, providing easy interaction with the database.

## API Endpoints

### Authentication

- `POST /create-account`: Register a new user.
- `POST /login`: Log in an existing user and receive a JWT token.

### Notes

- `POST /add-note`: Add a new note (JWT required).
- `PUT /edit-post/:noteId`: Edit an existing note (JWT required).
- `DELETE /delete-note/:noteId`: Delete a note (JWT required).
- `GET /get-all-notes`: Retrieve all notes for the authenticated user (JWT required).
- `GET /search-notes?query=searchTerm`: Search for notes by title or content (JWT required).
- `PUT /edit-isPinned/:noteId`: Pin or unpin a note (JWT required).

## Screenshots

![Screenshot (129)](https://github.com/user-attachments/assets/8c7c0829-7107-49ce-a3d8-c52d5e6478ba)
![Screenshot (128)](https://github.com/user-attachments/assets/7db1e615-5e01-49af-93d9-fb06334b1a5e)
![Screenshot (127)](https://github.com/user-attachments/assets/0b7299ad-ae6d-49fd-816b-ceca3bba3c0e)
![Screenshot (126)](https://github.com/user-attachments/assets/e385d971-889b-42a8-867e-d03166bd5ef2)


## Future Improvements

- Add a feature to share notes with other users.
- Implement password hashing for better security.
- Add user profile management.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


Contact
For any inquiries or contributions, feel free to contact me at amansinghmail07@example.com.
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
>>>>>>> 1eb8729 (making responsive)
