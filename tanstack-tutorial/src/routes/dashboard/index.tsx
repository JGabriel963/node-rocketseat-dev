// import { getSessionFn } from '#/data/session'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  // component: RouteComponent,
  // loader: () => getSessionFn(),
  beforeLoad: () => {
    throw redirect({ to: '/dashboard/import' })
  },
})

// function RouteComponent() {
//   const data = Route.useLoaderData()
//   return <div>{JSON.stringify(data.user, null, 2)}</div>
// }
