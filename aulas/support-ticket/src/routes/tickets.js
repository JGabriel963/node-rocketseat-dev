import { create } from "../controllers/tickets/create.js";

export const tickets = [
  {
    method: "GET",
    path: "/tickets",
    controller: (request, response) => {
      response.end("List de tickets");
    },
  },
  {
    method: "POST",
    path: "/tickets",
    controller: (request, response) => {
      create(request, response);
    },
  },
];
