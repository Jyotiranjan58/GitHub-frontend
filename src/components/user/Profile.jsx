import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { useAuth } from "../../authContext";
import { FiBookOpen } from "react-icons/fi";
import { RiGitRepositoryLine } from "react-icons/ri";
import HeatMapProfile from "./HeatMap";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { setCurrentUser } = useAuth();

  const tabs = [
    { id: "overview", label: "Overview", icon: <FiBookOpen /> },
    {
      id: "starred",
      label: "Starred Repositories",
      icon: <RiGitRepositoryLine />,
    },
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || userId === "undefined") {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3002/userProfile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUserDetails(response.data);
      } catch (err) {
        console.error("Cannot fetch user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-state">Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <UnderlineNav className="profile-nav" aria-label="Profile navigation">
        {tabs.map((tab) => (
          <UnderlineNav.Item
            key={tab.id}
            aria-current={activeTab === tab.id ? "page" : undefined}
            onClick={() => setActiveTab(tab.id)}
            style={{ cursor: "pointer", color: "#ffffff" }}
          >
            {tab.icon}
            {tab.label}
          </UnderlineNav.Item>
        ))}
      </UnderlineNav>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrentUser(null);
          window.location.href = "/auth";
        }}
        id="logout"
      >
        Logout
      </button>

      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          <div className="profile-image-container">
            {userDetails?.avatarUrl ? (
              <img
                src={userDetails.avatarUrl}
                alt="Profile Avatar"
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-image-placeholder">
                {userDetails?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="user-name">
            <h3>{userDetails?.username || "Username"}</h3>
          </div>

          {userDetails?.bio && <p className="user-bio">{userDetails.bio}</p>}

          <button className="follow-btn">Edit profile</button>

          <div className="follower">
            <p>
              <strong>{userDetails?.followedUsers?.length || 0}</strong>{" "}
              Following
            </p>
            <p>
              <strong>0</strong> Followers
            </p>
          </div>

          {userDetails?.location && (
            <div className="user-location">
              <span className="location-text">{userDetails.location}</span>
            </div>
          )}
        </div>

        <div className="heat-map-section">
          {activeTab === "overview" ? (
            <>
              <HeatMapProfile />
              <div className="profile-repos-section">
                <h4>Popular repositories</h4>
                <div className="profile-repo-grid">
                  {userDetails?.repositories &&
                  userDetails.repositories.length > 0 ? (
                    userDetails.repositories.map((repo) => {
                      const repoId = repo._id || repo;
                      return (
                        <div key={repoId} className="repo-card-mini">
                          <Link
                            to={`/repo/${repoId}`}
                            className="repo-mini-name"
                          >
                            {repo.name || "Repository"}
                          </Link>
                          <p className="repo-mini-desc">
                            {repo.description || "No description provided."}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="no-repos-text">
                      No repositories created yet.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="starred-repos-container">
              <h4>Starred Repositories</h4>
              {userDetails?.starRepos && userDetails.starRepos.length > 0 ? (
                userDetails.starRepos.map((repo) => {
                  const repoId = repo._id || repo;
                  return (
                    <div key={repoId} className="repo-card-mini">
                      <Link to={`/repo/${repoId}`} className="repo-mini-name">
                        {repo.name}
                      </Link>
                      <p className="repo-mini-desc">{repo.description}</p>
                    </div>
                  );
                })
              ) : (
                <div className="empty-issues">
                  <p>You don't have any starred repositories yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
