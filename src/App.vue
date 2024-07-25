<template>
  <div id="app">
    <ThreeScene />
    <div id="spotify-player">
      <iframe class="spotify-embed" src="https://open.spotify.com/embed/track/76FpBihfLyLYSZm0GcyPSg?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
    </div>
  </div>
</template>

<script>
import ThreeScene from './components/ThreeScene.vue'
export default {
  name: 'App',
  components: {
    ThreeScene
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}
#spotify-player {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 300px; /* Adjust the width as needed */
  height: 352px; /* Adjust the height as needed */
  margin: 10px;
}
.spotify-embed {
  border-radius: 12px;
  width: 100%;
  height: 100%;
}

/* Add these media queries for mobile devices */
@media (max-width: 768px) {
  #spotify-player {
    top: 0;
    bottom: auto;
    width: 300px; /* Adjust the width for mobile */
    height: 200px; /* Adjust the height for mobile */
  }
}
</style>