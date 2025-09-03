import { create } from "../controllers/tickets/create.js";
import { index } from "../controllers/tickets/index.js";

export const tickets = [
  {
    method: "GET",
    path: "/tickets",
    controller: index,
  },
  {
    method: "POST",
    path: "/tickets",
    controller: create,
  },
];
