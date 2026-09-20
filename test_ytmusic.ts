import YTMusic from "ytmusic-api"

async function test() {
  const ytmusic = new YTMusic()
  await ytmusic.initialize()

  const isrc = "JPU902401874" // some random ISRC, let's search for "OKISO LOVE LOOP" instead to be safe
  const searchResults = await ytmusic.search("OKISO LOVE LOOP")
  console.log("Search results for 'OKISO LOVE LOOP':")
  console.log(searchResults.slice(0, 2))

  const isrcResults = await ytmusic.search("QZJ842100000") // Example ISRC
  console.log("Search results for ISRC:")
  console.log(isrcResults.slice(0, 2))
}

test().catch(console.error)
