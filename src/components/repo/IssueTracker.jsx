import React, { useState, useEffect } from "react";
import "./issueTracker.css";

const IssueTracker = ({ repoId }) => {
  const [issues, setIssues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchIssues = async () => {
    try {
      const response = await fetch(`http://localhost:3002/issue/all/${repoId}`);
      if (response.ok) {
        const data = await response.json();
        setIssues(data);
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  useEffect(() => {
    if (repoId) fetchIssues();
  }, [repoId]);

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to create an issue.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3002/issue/create/${repoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        },
      );

      if (response.ok) {
        setTitle("");
        setDescription("");
        setShowForm(false);
        fetchIssues(); // Refresh the list automatically
      }
    } catch (err) {
      console.error("Error creating issue:", err);
    }
  };

  return (
    <div className="issue-tracker-container">
      <div className="issue-header">
        <h3>
          Issues <span className="issue-count">{issues.length}</span>
        </h3>
        <button
          className="new-issue-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "New Issue"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateIssue} className="issue-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="issue-input"
          />
          <textarea
            placeholder="Leave a comment"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="issue-textarea"
          />
          <button type="submit" className="submit-issue-btn">
            Submit new issue
          </button>
        </form>
      )}

      <div className="issue-list">
        {issues.length === 0 && !showForm ? (
          <div className="empty-issues">No open issues.</div>
        ) : (
          issues.map((issue) => (
            <div key={issue._id} className="issue-card">
              <div className="issue-status">
                {issue.status === "open" ? "🟢" : "🔴"}
              </div>
              <div className="issue-details">
                <h4 className="issue-title">{issue.title}</h4>
                <p className="issue-desc">{issue.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IssueTracker;
