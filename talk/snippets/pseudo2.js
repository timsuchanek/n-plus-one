const users = await Query.users()
await Promise.all(users.forEach(fetchPosts))
process.nextTick(() => {})
