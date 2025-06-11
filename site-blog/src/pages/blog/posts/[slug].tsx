import { useRouter } from 'next/router'

export default function PostPage() {
    const router = useRouter();
    console.log(router.query.slug)

  return (
    <div>
        {router.query.slug}
    </div>
  )
}
