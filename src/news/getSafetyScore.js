const { Worker } = require('worker_threads');
const path = require('path');

const getSafetyScore = async (request, h) => {
  const { location } = request.params;
  let allResults = [];
  let page = 0;
  const maxPages = 10;

  // Function to create a worker and fetch results
  const fetchResultsWithWorker = (page, location) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(path.resolve(__dirname, 'fetchWorker.js'), {
        workerData: { page, location },
      });

      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  };

  // Fetch results from multiple pages using workers
  const fetchPromises = [];
  while (page < maxPages) {
    fetchPromises.push(fetchResultsWithWorker(page, location));
    page += 1;
  }

  const results = await Promise.all(fetchPromises);
  allResults = results.flat();

  // Calculate match score for each result
  const resultsWithScore = allResults.map((result) => {
    const snippet = result.snippet || '';
    const matchScore = (
      snippet.match(/(begal|perkosa|pelecehan|kejahatan|cabul|bunuh)/gi) || []
    ).length;
    return { ...result, matchScore };
  });

  // Sort by match score in descending order
  resultsWithScore.sort((a, b) => b.matchScore - a.matchScore);

  // Calculate overall safety score
  const safetyScore = calculateSafetyScore(resultsWithScore);

  return {
    status: 'success',
    data: {
      safetyScore,
      news: resultsWithScore,
    },
  };
};

const dangerKeywordsRegex =
  /\b(begal|perkosa|pelecehan|kejahatan|cabul|bunuh)\b/gi;
const hoaxKeywordsRegex = /\b(hoax|tidak benar|fitnah|berita palsu)\b/gi;

// Calculate safety score (higher dangerCount = lower score)
function calculateSafetyScore(filteredResults) {
  let dangerCount = 0;
  let validSnippetCount = 0;

  filteredResults.forEach((result) => {
    const snippet = result.snippet || '';

    // Ignore snippets with hoax-related terms
    if (hoaxKeywordsRegex.test(snippet.toLowerCase())) {
      return;
    }

    validSnippetCount += 1;
    if (dangerKeywordsRegex.test(snippet.toLowerCase())) {
      dangerCount += 1;
    }
  });

  // Return safety score (higher dangerCount -> lower score)
  if (validSnippetCount === 0) {
    return 100; // No valid data implies maximum safety
  }

  const dangerRatio = dangerCount / validSnippetCount;
  const safetyScore = Math.max(1, 100 - Math.floor(dangerRatio * 100)); // Ensure score is between 1-100
  return safetyScore;
}

module.exports = { getSafetyScore };
