import { client } from '../client'
import type { Project } from '../types/project'

export const getProjects = async () => {
  return await client.getAllContents<Project>({
    endpoint: 'projects',
    queries: { orders: 'createdAt' },
  })
}
