import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ThemeController from './components/ThemeController';
import { CiSearch } from "react-icons/ci";
import { IoLocationSharp } from "react-icons/io5";
import { FaLink } from "react-icons/fa6";
import { SlSocialTwitter } from "react-icons/sl";
import { PiBuildings } from "react-icons/pi";
import DefaultAvatar from './assets/blank-profile-picture-973460_640.png'; 
import Img from './assets/Bitmap (26).png';

function App() {
  // State o'zgaruvchilar
  const [username, setUsername] = useState('');
  const [followers, setFollowers] = useState(0);
  const [repos, setRepos] = useState(0);
  const [following, setFollowing] = useState(0);
  const [bio, setBio] = useState('Bio is not defined');
  const [profileImage, setProfileImage] = useState(DefaultAvatar);
  const [joinedDate, setJoinedDate] = useState('');
  const [location, setLocation] = useState('Not Available');
  const [blog, setBlog] = useState('Not Available');
  const [twitter, setTwitter] = useState('Not Available');
  const [company, setCompany] = useState('Not Available');
  const [error, setError] = useState('');
  const inputText = useRef();

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.className = theme; 
    localStorage.setItem('theme', theme); 
  }, [theme]);

  const getData = (userName) => {
    fetch(`https://api.github.com/users/${userName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('User not found');
        }
        return response.json();
      })
      .then((user) => {
        console.log(user);
        setUsername(user.login);
        setFollowers(user.followers);
        setRepos(user.public_repos);
        setFollowing(user.following);
        setBio(user.bio || 'Bio is not defined');
        setProfileImage(user.avatar_url || DefaultAvatar); 
        setJoinedDate(new Date(user.created_at).toLocaleDateString()); 
        setLocation(user.location || 'Not Available');
        setBlog(user.blog || 'Not Available');
        setTwitter(user.twitter_username ? `https://twitter.com/${user.twitter_username}` : 'Not Available');
        setCompany(user.company || 'Not Available');
        setError('');
        inputText.current.value = '';
      })
      .catch((err) => {
        setError(err.message);
        setUsername('');
        setFollowers(0);
        setRepos(0);
        setFollowing(0);
        setBio('Bio is not defined');
        setProfileImage(DefaultAvatar);
        setJoinedDate('');
        setLocation('Not Available');
        setBlog('Not Available');
        setTwitter('Not Available');
        setCompany('Not Available');
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    getData(inputText.current.value);
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit}>
        <div className='flex justify-between mt-5'>
          <div className='mt-1'>
            <h1 className='font-bold text-2xl leading-[38.51px]'>devfinder</h1>
          </div>
          <div className='flex items-center gap-3'>
            {theme === 'dark' && <h1>LIGHT</h1>}
            {theme === 'light' && <h1>DARK</h1>}
            <ThemeController onThemeChange={handleThemeChange} />
          </div>
        </div>
        <div className='w-full mt-5 rounded-[20px] h-[69px] bg-[#12192A]'>
          <div className='flex gap-3 justify-between'>
            <div className='flex gap-3 p-5'>
              <CiSearch className='font-bold text-[24px] ml-2 text-[#0079FF]' />
              <input className='outline-none border-none  bg-transparent w-[250px] font-normal text-lg leading-[25px]' ref={inputText} type="text" placeholder='Search GitHub username…' />
            </div>
            <div className='p-2.5'>
              <button className='btn btn-primary'>Search</button>
            </div>
          </div>
        </div>
        {error && <div className='text-red-500 mt-4 text-center'>{error}</div>}
        <div className='h-[419px] bg-1E2A49 rounded-[18px] mt-8'>
          <div className='flex p-16 justify-between h-[200px]'>
            <div className='flex gap-11'>
              <img src={profileImage} className='w-[117px] h-[117px] rounded-full object-cover' alt="Profile" />
              <div>
                <h1 className='font-bold text-2xl text-gray'>{username}</h1>
                <h3 className='text-[#0079FF] mt-1'>@{username}</h3>
                <h2 className='mt-4 tracking-wide text-gray'>{bio}</h2>
              </div>
            </div>
            <div>
              <h1 className='text-gray font-normal text-sm'>Joined {joinedDate}</h1>
            </div>
          </div>
          <div className='bg-141D30 w-[73%] h-[85px] p-4 rounded-xl ml-[220px] bg-[#12192A]'>
            <div className='flex gap-[80px]'>
              <div className='ml-8'>
                <h1 className='text-white text-sm'>Repos</h1>
                <h1 className='text-white font-bold text-2xl'>{repos}</h1>
              </div>
              <div>
                <h1 className='text-white text-sm'>Followers</h1>
                <h1 className='text-white font-bold text-2xl'>{followers}</h1>
              </div>
              <div>
                <h1 className='text-white text-sm'>Following</h1>
                <h1 className='text-white font-bold text-2xl'>{following}</h1>
              </div>
            </div>
          </div>
          <div className='text-gray mt-10'>
            <div className='flex gap-16'>
              <div className='ml-[220px]'>
                <div className='flex text-gray gap-2 items-center'>
                  <IoLocationSharp className='text-2xl' />
                  <h1 className='tracking-wide'>{location}</h1>
                </div>
                <div className='flex gap-2 items-center mt-3'>
                  <FaLink className='text-2xl' />
                  <a href={blog} className='tracking-wide' target="_blank" rel="noopener noreferrer">{blog}</a>
                </div>
              </div>
              <div>
                <div className='flex text-gray gap-2 items-center'>
                  <SlSocialTwitter className='text-2xl' />
                  <a href={twitter} className='tracking-wide' target="_blank" rel="noopener noreferrer">{twitter}</a>
                </div>
                <div className='flex gap-2 items-center mt-3'>
                  <PiBuildings className='text-2xl' />
                  <h1 className='tracking-wide'>{company}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
