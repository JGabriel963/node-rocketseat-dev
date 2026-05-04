import { prisma } from '#/db'
import { importSchema } from '#/schemas/import'
import { createServerFn } from '@tanstack/react-start'

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .inputValidator(importSchema)
  .handler(async ({ data }) => {
    const { url } = data

    const item = await prisma.savedItem.create({
      data: {
        url: data.url,
        userId: 'afaf',
        status: 'PROCESSING',
      },
    })

    // const result = await firecrawl.scrape(url, {
    //   formats: ['markdown'],
    //   onlyMainContent: true,
    // })

    const result = {
      url,
    }

    console.log(result)
  })
