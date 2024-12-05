const { parentPort, workerData } = require('worker_threads');

async function getSearchResults(page, location) {
  const query = process.env.CUSTOM_SEARCH_QUERY.replaceAll(
    '{location}',
    location,
  );
  const perPage = 10;
  const start = page * perPage;

  const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.CUSTOM_SEARCH_API_KEY}&cx=${process.env.CUSTOM_SEARCH_ENGINE_ID}&q=${query}&start=${start}&dateRestrict=y1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    parentPort.postMessage(data?.items || []);
  } catch (error) {
    console.error('Error fetching data:', error);
    parentPort.postMessage([]);
  }
}

getSearchResults(workerData.page, workerData.location);
