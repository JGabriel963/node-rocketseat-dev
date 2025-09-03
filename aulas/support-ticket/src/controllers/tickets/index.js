export function index({ request, response, database }) {
  const { status } = request.query;

  const tickets = database.select("tickets") ?? [];

  return response.end(JSON.stringify(tickets));
}
