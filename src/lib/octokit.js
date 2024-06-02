import { Octokit } from 'https://esm.sh/octokit'
import { getParam } from '@/lib/params'

export default new Octokit({
  auth: getParam('token')
})