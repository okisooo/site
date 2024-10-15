<template>
  <div id="social-icons">
    <a href="https://github.com/okisooo" target="_blank" rel="noopener noreferrer">
      <i class="fab fa-github"></i>
    </a>
    <a href="https://twitter.com/okisooo_" target="_blank" rel="noopener noreferrer">
      <i class="fab fa-twitter"></i>
    </a>
    <a href="https://open.spotify.com/artist/2FSh9530hmphpeK3QmDSPm?si=2e66970ec68a4baa" target="_blank" rel="noopener noreferrer">
      <i class="fab fa-spotify"></i>
    </a>
    <a href="https://www.youtube.com/@okiso7" target="_blank" rel="noopener noreferrer">
      <i class="fab fa-youtube"></i>
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
  bottom: 15%;
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

/* Responsive styles */
@media (max-width: 768px) {
  #social-icons {
    bottom: 10%;
    gap: 15px;
  }
  #social-icons a {
    font-size: 30px;
  }
}

@media (max-width: 480px) {
  #social-icons {
    bottom: 5%;
    gap: 10px;
  }
  #social-icons a {
    font-size: 50px;
  }
}

/* Disable hover effect for touch devices */
@media (hover: none) {
  #social-icons a:hover {
    color: black;
    transform: none;
  }
}
</style>