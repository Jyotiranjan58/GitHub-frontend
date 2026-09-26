import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // If there's no logged-in user yet, stop execution here
    if (!userId || userId === "undefined") return;

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/repo/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error("Error while fetching repositories : ", err);
      }
    };
    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3002/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data);
      } catch (err) {
        console.error("Error while fetching repositories : ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResult(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResult(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <section id="dashboard" className="dashboard-container">
        <aside className="sidebar-left">
          <h3>Suggested Repositories</h3>
          <div className="repo-list">
            {suggestedRepositories.map((repo) => (
              <div className="repo-card" key={repo._id}>
                <h4 className="repo-name">{repo.name}</h4>
                <p className="repo-description">{repo.description}</p>
              </div>
            ))}
          </div>
        </aside>

        <main className="dashboard-main">
          <h2>Your Repositories</h2>
          <div id="search" className="search-container">
            <input
              type="text"
              value={searchQuery}
              placeholder="Find a repository..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="repo-list">
            {searchResult.map((repo) => (
              <div className="repo-card main-repo-card" key={repo._id}>
                <Link
                  to={`/repo/${repo._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <h4 className="repo-name">{repo.name}</h4>
                </Link>
                <p className="repo-description">{repo.description}</p>
              </div>
            ))}
          </div>
        </main>

        <aside className="sidebar-right">
          <h3>Upcoming Events</h3>
          <ul className="events-list">
            <li className="event-item">
              <p>Tech Conference - Sep 15</p>
            </li>
            <li className="event-item">
              <p>Dev Meetup - Sep 25</p>
            </li>
            <li className="event-item">
              <p>React Summit - Dec 15</p>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
