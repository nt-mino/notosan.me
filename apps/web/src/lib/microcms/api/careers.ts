import { client } from '../client'
import type { Career } from '../types/career'

export const getCareers = async () => {
  return await client.getList<Career>({
    endpoint: 'careers',
    queries: { limit: 100, orders: '-startDate' },
  })
}
