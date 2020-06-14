const users = await Query.users()
await Promise.all(users.forEach(fetchPosts))

const posts = users.flatMap((u) => u.posts)
await Promise.all(posts.forEach(fetchComments))

process.nextTick(() => {
  sendToQueryEngine()
})
