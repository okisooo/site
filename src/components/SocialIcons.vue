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
  #social-icons {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 20px;
  }
  #social-icons a {
    color: black;
    font-size: 60px;
    text-decoration: none;
    transition: transform 0.3s ease, color 0.3s ease;
    text-shadow: 1px 1px 2px white, -1px -1px 2px white;
  }
  #social-icons a:hover {
    color: gray;
    transform: translateY(-10px) scale(1.2);
  }
  </style>