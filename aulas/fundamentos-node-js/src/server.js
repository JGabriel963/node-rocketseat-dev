import http from "node:http";

const users = [];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "GET" && url === "/users") {
    return res
      .setHeader("Content-type", "application/json")
      .end(JSON.stringify(users));
  }

  if (method === "POST" && url === "/users") {
    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 0;

    users.push({
      id: newId,
      name: "John Doe",
      email: "johndoe@gmail.com",
    });

    return res.writeHead(201).end();
  }

  return res.writeHead(404).end();
});

server.listen(3333, () => {
  console.log("Opaaaaa!");
});
