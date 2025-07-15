const sessionId = new Map();

function setUser(id, user) {
  sessionId.set(id, user);
}

function getUser(id) {
  console.log(sessionId.get(id));
  return sessionId.get(id);
}

module.exports = { setUser, getUser };
