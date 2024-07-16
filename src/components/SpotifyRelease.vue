<template>
  <div id="spotify-release" :style="{ width: `${width}px`, height: `${height}px` }">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else>
      <div class="content-wrapper">
        <div v-if="songName" class="song-name">{{ songName }}</div>
        <a :href="albumUrl" target="_blank" rel="noopener noreferrer">
          <img :src="albumImage" :alt="songName || 'Latest Spotify Release'" />
        </a>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SpotifyRelease',
  props: {
    albumId: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      songName: '',
      albumUrl: '',
      albumImage: '',
      loading: true,
      error: null,
      accessToken: null,
      tokenExpirationTime: 0
    };
  },
  mounted() {
    this.fetchAlbumData();
  },
  methods: {
    async getAccessToken() {
      if (this.accessToken && Date.now() < this.tokenExpirationTime) {
        return this.accessToken;
      }

      const clientId = '5df02388c3524f7a9d72cf3f02bb6139';
      const clientSecret = '9eaa1b52f6c54719a08d88820ddd58d8';

      try {
        const response = await axios.post('https://accounts.spotify.com/api/token', 
          'grant_type=client_credentials', 
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            }
          }
        );

        this.accessToken = response.data.access_token;
        this.tokenExpirationTime = Date.now() + (response.data.expires_in * 1000);
        return this.accessToken;
      } catch (error) {
        console.error('Error getting Spotify access token:', error);
        throw error;
      }
    },
    async fetchAlbumData() {
      try {
        this.loading = true;
        this.error = null;
        const token = await this.getAccessToken();
        const response = await axios.get(`https://api.spotify.com/v1/albums/${this.albumId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data && response.data.tracks && response.data.tracks.items.length > 0) {
          this.songName = response.data.tracks.items[0].name;
          this.albumUrl = response.data.external_urls.spotify;
          this.albumImage = response.data.images[0].url;
        }
      } catch (error) {
        console.error('Error fetching album data:', error);
        this.error = 'Failed to load album data. Please try again later.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
#spotify-release {
  position: fixed;
  bottom: 40px;
  right: 40px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  overflow: hidden;
}

.content-wrapper {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 0px;
  padding: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.song-name, .loading, .error {
  color: white;
  font-size: 18px;
  margin-bottom: 15px;
  text-align: center;
}

#spotify-release img {
  width: 100%;
  height: auto;
  border-radius: 0px;
}

@media (max-width: 768px) {
  #spotify-release {
    width: 250px;
    height: 250px;
  }
}
</style>