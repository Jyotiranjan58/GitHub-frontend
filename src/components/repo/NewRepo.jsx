import React, { useState } from "react";
import "./newRepo.css";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

const NewRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    const owner = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Retrieve the token

    if (!owner) {
      alert("Please log in to create a repository.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/repo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token
        },
        body: JSON.stringify({
          name,
          description,
          visibility: visibility === "public",
          owner,
          issues: [],
          content: [],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/"); // Go back to dashboard on success
      } else {
        alert(data.error || "Failed to create repository");
      }
    } catch (err) {
      console.error("Error creating repository:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-repo-wrapper">
        <div className="create-repo-container">
          <h2>Create a new repository</h2>
          <p className="subtext">
            A repository contains all project files, including the revision
            history.
          </p>

          <form onSubmit={handleCreate} className="repo-form">
            <div className="form-group">
              <label>
                Repository name <span className="required">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="repo-input"
              />
            </div>

            <div className="form-group">
              <label>
                Description <span className="optional">(optional)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="repo-input"
              />
            </div>

            <hr className="divider" />

            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="public"
                  checked={visibility === "public"}
                  onChange={(e) => setVisibility(e.target.value)}
                />
                <div className="radio-text">
                  <strong>Public</strong>
                  <span>
                    Anyone on the internet can see this repository. You choose
                    who can commit.
                  </span>
                </div>
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  value="private"
                  checked={visibility === "private"}
                  onChange={(e) => setVisibility(e.target.value)}
                />
                <div className="radio-text">
                  <strong>Private</strong>
                  <span>
                    You choose who can see and commit to this repository.
                  </span>
                </div>
              </label>
            </div>

            <hr className="divider" />

            <button type="submit" className="create-btn">
              Create repository
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewRepo;
