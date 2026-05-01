import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/test')({
  server: {
    handlers: {
      GET: async () => {
        return new Response('Hello, World!')
      },
      POST: async ({ request }: { request: Request }) => {
        const data = await request.json()
        return new Response(JSON.stringify(data))
      },
    },
  },
})
