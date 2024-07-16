<template>
  <div id="app">
    <ThreeScene />
    <SpotifyRelease albumId="5KkaHNaU8hPkXNi20ruDL9" :width="400" :height="400"  />
  </div>
</template>

<script>
import ThreeScene from './components/ThreeScene.vue'
import SpotifyRelease from './components/SpotifyRelease.vue';

export default {
  name: 'App',
  components: {
    ThreeScene,
    SpotifyRelease
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
}

</style>