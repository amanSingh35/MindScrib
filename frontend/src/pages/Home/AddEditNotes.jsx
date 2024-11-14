import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({ showToastMessage, getAllNotes, noteData, type, onClose }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  // Edit note
  const editnote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/edit-post/" + noteId, {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  // Add note
  const addNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }
    setError("");

    if (type === "edit") {
      editnote();
    } else {
      addNote();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white w-full md:w-1/2 p-6 rounded-md shadow-lg max-h-[90vh] overflow-y-auto">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center absolute top-4 right-4 hover:bg-slate-500 transition-colors"
          onClick={onClose}
        >
          <MdClose className="text-xl text-slate-400" />
        </button>

        <div className="flex flex-col gap-y-2">
          <label className="input-level">TITLE</label>
          <input
            type="text"
            className="text-lg text-slate-950 outline-none border border-slate-300 rounded p-2"
            placeholder="Go to gym"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">CONTENT</label>
          <textarea
            type="text"
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded border border-slate-300"
            placeholder="Content"
            rows={8}
            value={content}
            onChange={({ target }) => setContent(target.value)}
          />
        </div>
        <div className="mt-3">
          <label className="input-label">TAGS</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>
        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
        <button
          className="btn_primary font-medium mt-5 p-3"
          onClick={handleAddNote}
        >
          {type === "edit" ? "UPDATE" : "ADD"}
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;
