import * as R from 'ramda'
import multipartMixedParser from 'multipart-mixed-parser'

import rc from '../api/ringcentral'

export const fetchExtension = async ({ commit }) => {
  const r = await rc.get('/restapi/v1.0/account/~/extension/~')
  commit('setExtension', r.data)
}

export const fetchGroups = async ({ commit }) => {
  const r = await rc.get('/restapi/v1.0/glip/groups', { params: { recordCount: 250 } })
  commit('setGroups', r.data.records)
}

export const fetchPosts = async ({ commit, state }, groupId) => {
  if (state.posts[groupId]) {
    return // Use data in cache
  }
  const r = await rc.get(`/restapi/v1.0/glip/groups/${groupId}/posts`)
  commit('setPosts', { groupId, posts: r.data.records })
}

export const fetchPersons = async ({ commit, state }, personIds) => {
  const idsToFetch = R.pipe(
    R.uniq,
    R.filter(id => !(id in state.persons))
  )(personIds)
  for (const ids of R.splitEvery(30, idsToFetch)) {
    const r = await rc.get(`/restapi/v1.0/glip/persons/${ids.join(',')}`)
    const persons = multipartMixedParser.parse(r.data).slice(1).filter(p => 'id' in p)
    commit('setPersons', persons)
  }
}
