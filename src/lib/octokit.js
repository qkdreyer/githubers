import { Octokit } from 'https://cdn.skypack.dev/octokit'
import { getParam } from '@/lib/params'

export default new Octokit({
  auth: getParam('token')
})