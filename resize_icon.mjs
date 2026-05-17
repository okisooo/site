import sharp from 'sharp';

async function resize() {
  try {
    await sharp('src/app/icon.png')
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile('icon_512.png');
    console.log('Image resized to 512x512 successfully');
  } catch (error) {
    console.error('Error resizing image:', error);
  }
}

resize();
