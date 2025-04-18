const axios = require('axios');
const baseurl = 'http://20.244.56.144/evaluation-service';
const headers = {
  'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTU0ODIxLCJpYXQiOjE3NDQ5NTQ1MjEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjUyMTJjMjI2LTU1MGEtNGJhMy1hYTYwLTVmYzY0OTExNmU1MSIsInN1YiI6ImthcnRpa2V5LnBhbmRleV9jczIyQGdsYS5hYy5pbiJ9LCJlbWFpbCI6ImthcnRpa2V5LnBhbmRleV9jczIyQGdsYS5hYy5pbiIsIm5hbWUiOiJrYXJ0aWtleSBwYW5kZXkiLCJyb2xsTm8iOiIyMjE1MDAwODg2IiwiYWNjZXNzQ29kZSI6IkNObmVHVCIsImNsaWVudElEIjoiNTIxMmMyMjYtNTUwYS00YmEzLWFhNjAtNWZjNjQ5MTE2ZTUxIiwiY2xpZW50U2VjcmV0IjoiQkhQS0NlcUZCV05LTldQeiJ9.Bseca-GQnZ-qed99E6bgIromHD5GO8rg9Lhkqm40QOQ`
};
async function fetchUsers() {
  try {
    console.log('Sending request to:', `${baseurl}/users`);
    const res = await axios.get(`${baseurl}/users`, { headers });
    console.log('Fetched users:', res.data);
    return res.data.users;
  } catch (err) {
    console.error('Error fetching users:', err.response ? err.response.data : err.message);
    if (err.response && err.response.status === 401) {
      console.error('Unauthorized - Invalid or expired token.');
    }
    throw new Error('Failed to fetch users');
  }
}
// async function fetchUsers() {
//   const res = await axios.get(`${baseurl}/users`, { headers });
//   return res.data.users;
// }
async function fetchPostsByUser(userId) {
  const res = await axios.get(`${baseurl}/users/${userId}/posts`, { headers });
  return res.data.posts || [];
}
async function fetchCommentsByPost(postId) {
  const res = await axios.get(`${baseurl}/posts/${postId}/comments`, { headers });
  return res.data.comments || [];
}
async function getTopUsers() {
  const users = await fetchUsers();
  const userIds = Object.keys(users);

  const userCommentCounts = await Promise.all(userIds.map(async (userId) => {
    const posts = await fetchPostsByUser(userId);
    let totalComments = 0;

    for (const post of posts) {
      const comments = await fetchCommentsByPost(post.id);
      totalComments += comments.length;
    }
    return { userId, userName: users[userId], totalComments };
  }));
  return userCommentCounts
    .sort((a, b) => b.totalComments - a.totalComments)
    .slice(0, 5);
}
async function getPopularPosts() {
  const users = await fetchUsers();
  const userIds = Object.keys(users);
  let allPosts = [];

  for (const userId of userIds) {
    const posts = await fetchPostsByUser(userId);
    allPosts.push(...posts);
  }
  const postWithCommentCounts = await Promise.all(allPosts.map(async (post) => {
    const comments = await fetchCommentsByPost(post.id);
    return { ...post, commentCount: comments.length };
  }));
  const maxCount = Math.max(...postWithCommentCounts.map(p => p.commentCount));
  return postWithCommentCounts.filter(p => p.commentCount === maxCount);
}
async function getLatestPosts() {
  const users = await fetchUsers();
  const userIds = Object.keys(users);
  let allPosts = [];

  for (const userId of userIds) {
    const posts = await fetchPostsByUser(userId);
    allPosts.push(...posts);
  }
  const sorted = allPosts.sort((a, b) => b.id - a.id);
  return sorted.slice(0, 5);
}
module.exports = {
  getTopUsers,
  getPopularPosts,
  getLatestPosts
};
