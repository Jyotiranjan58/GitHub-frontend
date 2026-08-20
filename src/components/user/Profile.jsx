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

  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      try {
        const response = await axios.get(
          `http://localhost:3002/userProfile/${userId}`,
        );

        console.log("User details:", response.data);

        setUserDetails(response.data);
      } catch (err) {
        console.error("Cannot fetch user details:", err);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />

      <UnderlineNav className="profile-nav" aria-label="Repository">
        <UnderlineNav.Item aria-current="page">
          <FiBookOpen />
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item onClick={() => navigate("/repo")}>
          <RiGitRepositoryLine />
          Starred Repositories
        </UnderlineNav.Item>
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
          <div className="profile-image"></div>

          <div className="user-name">
            <h3>{userDetails?.username || "Username"}</h3>
          </div>

          <button className="follow-btn">Follow</button>

          <div className="follower">
            <p>10 Followers</p>
            <p>3 Following</p>
          </div>
        </div>

        <div className="heat-map-section">
          <HeatMapProfile />
        </div>
      </div>
    </>
  );
};

export default Profile;
