import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Navbar";
import IssueTracker from "./IssueTracker";
import "./repoDetails.css";

const RepoDetails = () => {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3002/repo/${id}`);
        const data = await response.json();
        setRepo(data[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching repo details:", err);
        setLoading(false);
      }
    };

    fetchRepoDetails();
  }, [id]);

  if (loading) return <div className="loading-state">Loading...</div>;
  if (!repo) return <div className="error-state">Repository not found.</div>;

  return (
    <>
      <Navbar />
      <div className="repo-details-wrapper">
        <div className="repo-header">
          <div className="repo-title-row">
            <h2 className="repo-name">
              <Link to={`/profile`} className="owner-link">
                {repo.owner?.username || "user"}
              </Link>
              <span className="separator">/</span>
              <span className="name">{repo.name}</span>
            </h2>
            <span className="visibility-badge">
              {repo.visibility ? "Public" : "Private"}
            </span>
          </div>
          <p className="repo-description">{repo.description}</p>
        </div>

        <div className="repo-content-area">
          {/* We wrap the file explorer and issue tracker together in a flex container */}
          <div
            className="file-explorer-wrapper"
            style={{
              flex: 3,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div className="file-explorer">
              <div className="file-explorer-header">
                <span className="branch-label">main</span>
                <span className="commit-message">Initial commit</span>
              </div>

              {repo.content && repo.content.length > 0 ? (
                <ul className="file-list">
                  {repo.content.map((item, index) => (
                    <li key={index} className="file-item">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-repo">
                  <p>This repository is currently empty.</p>
                  <p>Use the CLI tool to push your first commit!</p>
                </div>
              )}
            </div>

            {/* The Issue Tracker is injected here! */}
            <IssueTracker repoId={id} />
          </div>

          <div className="repo-sidebar">
            <h3>About</h3>
            <p>
              {repo.description ||
                "No description, website, or topics provided."}
            </p>
            <hr />
            <h3>Issues</h3>
            <p>{repo.issues?.length || 0} Open</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RepoDetails;
