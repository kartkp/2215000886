const express = require('express');
const { getTopUsers, getPopularPosts, getLatestPosts } = require('./services/apiService');

const app = express();
const PORT = 3000;

app.get('/users', async (req, res) => {
  try {
    const topUsers = await getTopUsers();
    res.json(topUsers);
  } catch (err) {
    console.error('Error in /users route:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const type = req.query.type;
    if (type === 'popular') {
      const popularPosts = await getPopularPosts();
      res.json(popularPosts);
    } else if (type === 'latest') {
      const latestPosts = await getLatestPosts();
      res.json(latestPosts);
    } else {
      res.status(400).json({ error: "Invalid parameter value. Please use 'popular' or 'latest'." });
    }
  } catch (err) {
    console.error('Error in /posts route:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
