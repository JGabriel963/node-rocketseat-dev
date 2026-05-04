import Firecrwal from '@mendable/firecrawl-js'

export const firecrawl = new Firecrwal({
  apiKey: process.env.FIRECRAWL_API_KEY!,
})
