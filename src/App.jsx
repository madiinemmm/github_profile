import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import ThemeController from "./components/ThemeController";
import { CiSearch } from "react-icons/ci";
import { IoLocationSharp } from "react-icons/io5";
import { FaLink } from "react-icons/fa6";
import { SlSocialTwitter } from "react-icons/sl";
import { PiBuildings } from "react-icons/pi";
import DefaultAvatar from "./assets/blank-profile-picture-973460_640.png";
import ReactApexChart from "react-apexcharts";
import Modal from "./components/Modal";

function Piechart({ data, categories }) {
  const [chartData, setChartData] = useState({
    series: [{ data }],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories,
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
}

function Form({ getData }) {
  const inputText = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    getData(inputText.current.value);
  };

  return (
    <div>
      <form className="flex items-end gap-3" onSubmit={handleSubmit}>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Username:</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            ref={inputText}
          />
        </label>
        <button className="btn bg-secondary">Submit</button>
      </form>
    </div>
  );
}

function App() {
  const [username, setUsername] = useState("");
  const [followers, setFollowers] = useState(0);
  const [repos, setRepos] = useState(0);
  const [following, setFollowing] = useState(0);
  const [bio, setBio] = useState("Bio not defined");
  const [profileImage, setProfileImage] = useState(DefaultAvatar);
  const [joinedDate, setJoinedDate] = useState("");
  const [location, setLocation] = useState("Not Available");
  const [blog, setBlog] = useState("Not Available");
  const [twitter, setTwitter] = useState("Not Available");
  const [company, setCompany] = useState("Not Available");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [reposData, setReposData] = useState(null);
  const [categories, setCategories] = useState(null);
  const [data, setData] = useState(null);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [reposList, setReposList] = useState([]);

  const [modalType, setModalType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inputText = useRef();

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const getUserData = (username) => {
    fetch(`https://api.github.com/users/${username}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("User not found");
        }
        return response.json();
      })
      .then((user) => {
        setUsername(user.login);
        setFollowers(user.followers);
        setRepos(user.public_repos);
        setFollowing(user.following);
        setBio(user.bio || "Bio not defined");
        setProfileImage(user.avatar_url || DefaultAvatar);
        setJoinedDate(new Date(user.created_at).toLocaleDateString());
        setLocation(user.location || "Not Available");
        setBlog(user.blog || "Not Available");
        setTwitter(
          user.twitter_username
            ? `https://twitter.com/${user.twitter_username}`
            : "Not Available"
        );
        setCompany(user.company || "Not Available");
        setError("");
        inputText.current.value = "";
      })
      .catch((err) => {
        setError(err.message);
        setUsername("");
        setFollowers(0);
        setRepos(0);
        setFollowing(0);
        setBio("Bio not defined");
        setProfileImage(DefaultAvatar);
        setJoinedDate("");
        setLocation("Not Available");
        setBlog("Not Available");
        setTwitter("Not Available");
        setCompany("Not Available");
      });
  };

  const getReposData = (username) => {
    fetch(`https://api.github.com/users/${username}/repos`)
      .then((data) => data.json())
      .then((repos) => {
        setReposData(repos);
        setReposList(repos.map((repo) => repo.name));
      })
      .catch((err) => {
        setError("Failed to fetch repositories");
      });
  };

  const getFollowersData = (username) => {
    fetch(`https://api.github.com/users/${username}/followers`)
      .then((data) => data.json())
      .then((followers) =>
        setFollowersList(followers.map((follower) => follower.login))
      )
      .catch((err) => {
        setError("Failed to fetch followers");
      });
  };

  const getFollowingData = (username) => {
    fetch(`https://api.github.com/users/${username}/following`)
      .then((data) => data.json())
      .then((following) =>
        setFollowingList(following.map((following) => following.login))
      )
      .catch((err) => {
        setError("Failed to fetch following");
      });
  };

  useEffect(() => {
    if (username) {
      getReposData(username);
      getFollowersData(username);
      getFollowingData(username);
    }
  }, [username]);

  useEffect(() => {
    if (reposData) {
      const data = reposData.reduce((acc, curVal) => {
        const { language } = curVal;
        if (language) {
          acc[language] = (acc[language] || 0) + 1;
        }
        return acc;
      }, {});
      const keys = Object.keys(data);
      const values = Object.values(data);

      setCategories(keys);
      setData(values);
    }
  }, [reposData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    getUserData(inputText.current.value);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleOpenModal = (type) => {
    console.log(`Opening modal of type: ${type}`);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mt-5">
          <div className="mt-1">
            <h1 className="font-bold text-2xl leading-[38.51px]">devfinder</h1>
          </div>
          <div className="flex items-center gap-3">
            {theme === "dark" && <h1>LIGHT</h1>}
            {theme === "light" && <h1>DARK</h1>}
            <ThemeController onThemeChange={handleThemeChange} />
          </div>
        </div>
        <div className="w-[80%] mt-5 rounded-[20px] h-[69px] dark:bg-[#12192A] bg-white shadow-inputBoxShadow">
          <div className="flex gap-3 justify-between">
            <div className="flex gap-3 p-5">
              <CiSearch className="font-bold text-[24px] ml-2 text-[#0079FF]" />
              <input
                className="outline-none dark:text-white bg-inherit border-none text-base-content w-[250px] font-normal text-lg leading-[25px]"
                ref={inputText}
                type="text"
                placeholder="Search GitHub username…"
              />
            </div>
            <div className="p-2.5">
              <button className="btn btn-primary">Search</button>
            </div>
          </div>
        </div>
        {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
        <div className="rounded-[18px] mt-8 p-10">
          <div className="flex p-16 justify-between h-[200px]">
            <div className="flex gap-11">
              <img
                src={profileImage}
                className="w-[117px] h-[117px] rounded-full object-cover"
                alt="Profile"
              />
              <div>
                <h1 className="font-bold text-2xl text-gray">{username}</h1>
                <h3 className="text-[#0079FF] mt-1">@{username}</h3>
                <h2 className="mt-4 tracking-wide text-gray">{bio}</h2>
              </div>
            </div>
            <div>
              <h1 className="text-gray font-normal text-sm">
                Joined {joinedDate}
              </h1>
            </div>
          </div>
          <div className="bg-141D30 w-[73%] h-[85px] p-4 rounded-xl ml-[220px] dark:bg-[#12192A] bg-white shadow-inputBoxShadow">
            <div className="flex gap-[80px]">
              <div className="ml-8">
                <h1 className="text-base-content text-sm">Repos</h1>
                <h1 className="text-base-content font-bold text-2xl">
                  {repos}
                </h1>
                <button
                  className="text-blue-500 mt-2"
                  onClick={() => handleOpenModal("Repos")}>
                  View Repos
                </button>
              </div>
              <div>
                <h1 className="text-base-content text-sm">Followers</h1>
                <h1 className="text-base-content font-bold text-2xl">
                  {followers}
                </h1>
                <button
                  className="text-blue-500 mt-2"
                  onClick={() => handleOpenModal("Followers")}>
                  View Followers
                </button>
              </div>
              <div>
                <h1 className="text-base-content text-sm">Following</h1>
                <h1 className="text-base-content font-bold text-2xl">
                  {following}
                </h1>
                <button
                  className="text-blue-500 mt-2"
                  onClick={() => handleOpenModal("Following")}>
                  View Following
                </button>
              </div>
            </div>
          </div>
          <div className="text-gray mt-10">
            <div className="flex gap-16">
              <div className="ml-[220px]">
                <div className="flex text-gray gap-2 items-center">
                  <IoLocationSharp className="text-2xl" />
                  <h1 className="tracking-wide">{location}</h1>
                </div>
                <div className="flex gap-2 items-center mt-3">
                  <FaLink className="text-2xl" />
                  <a
                    href={blog}
                    className="tracking-wide"
                    target="_blank"
                    rel="noopener noreferrer">
                    {blog}
                  </a>
                </div>
              </div>
              <div>
                <div className="flex text-gray gap-2 items-center">
                  <SlSocialTwitter className="text-2xl" />
                  <a
                    href={twitter}
                    className="tracking-wide"
                    target="_blank"
                    rel="noopener noreferrer">
                    {twitter}
                  </a>
                </div>
                <div className="flex gap-2 items-center mt-3">
                  <PiBuildings className="text-2xl" />
                  <h1 className="tracking-wide">{company}</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            {categories && data && (
              <Piechart categories={categories} data={data} />
            )}
          </div>
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={
          modalType === "Repos"
            ? reposList
            : modalType === "Followers"
            ? followersList
            : followingList
        }
        type={modalType}
      />
    </div>
  );
}

export default App;
