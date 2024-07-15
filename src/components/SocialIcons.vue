<template>
    <div id="social-icons">
      <a href="https://github.com/okisooo" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-github"></i>
      </a>
      <a href="https://twitter.com/okisooo_" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-twitter"></i>
      </a>
      <a href="https://instagram.com/okisooo_" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-instagram"></i>
      </a>
      <a href="https://discord.gg/oxo" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-discord"></i>
      </a>
      <a href="https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm?si=2e66970ec68a4baa" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-spotify"></i>
      </a>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SocialIcons'
  }
  </script>
  
  <style>
  #social-icons a {
    color: #0000FF; /* Default blue */
    font-size: 60px;
    text-decoration: none;
    transition: transform 0.3s ease, color 0.3s ease;
    text-shadow: 1px 1px 2px white, -1px -1px 2px white;
  }
  #social-icons a:hover {
    color: #1E90FF; /* Dodger blue */
    transform: translateY(-10px) scale(1.2);
  }
  #social-icons a:nth-child(1) {
    color: #0000FF; /* Blue */
  }
  #social-icons a:nth-child(2) {
    color: #4169E1; /* Royal blue */
  }
  #social-icons a:nth-child(3) {
    color: #4682B4; /* Steel blue */
  }
  #social-icons a:nth-child(4) {
    color: #5F9EA0; /* Cadet blue */
  }
  #social-icons a:nth-child(5) {
    color: #6495ED; /* Cornflower blue */
  }
  
  /* Disable hover effect for touch devices */
  @media (hover: none) {
    #social-icons a:hover {
      color: black;
      transform: none;
    }
  }
  </style>