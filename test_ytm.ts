import YTMusic from 'ytmusic-api';

const ytmusic = new YTMusic();
ytmusic.initialize().then(() => {
  ytmusic.search('OKISO where are you now?').then(r => {
    console.log(r.slice(0, 3));
  });
});
