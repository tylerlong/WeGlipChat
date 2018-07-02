import * as R from 'ramda'
import multipartMixedParser from 'multipart-mixed-parser'
import localforage from 'localforage'

import rc from '../api/ringcentral'

export const sendMessage = async (context, { groupId, text }) => {
  rc.post('/restapi/v1.0/glip/posts', { groupId, text })
}

export const init = async ({ dispatch, commit, state }) => {
  await dispatch('fetchExtension')
  const cachedState = await localforage.getItem(`wgc.${state.extension.id}`)
  if (!R.isNil(cachedState)) {
    commit('set', { key: 'groups', value: cachedState.groups })
    commit('set', { key: 'posts', value: cachedState.posts })
    commit('set', { key: 'persons', value: cachedState.persons })
  }
  await dispatch('fetchGroups')
  const personIds = R.pipe(
    R.filter(g => g.type === 'PrivateChat' || g.type === 'Group'),
    R.map(g => g.members),
    R.reduce(R.concat, [])
  )(state.groups)
  await dispatch('fetchPersons', personIds)
}

export const fetchExtension = async ({ commit }) => {
  const r = await rc.get('/restapi/v1.0/account/~/extension/~')
  commit('setExtension', r.data)
}

export const fetchGroups = async ({ commit, state }) => {
  const r = await rc.get('/restapi/v1.0/glip/groups', { params: { recordCount: 250 } })
  commit('setGroups', r.data.records)
  localforage.setItem(`wgc.${state.extension.id}`, state)
}

export const fetchPosts = async ({ commit, state }, groupId) => {
  if (state.posts[groupId]) {
    return // Use data in cache
  }
  const r = await rc.get(`/restapi/v1.0/glip/groups/${groupId}/posts`)
  commit('setPosts', { groupId, posts: r.data.records })
  localforage.setItem(`wgc.${state.extension.id}`, state)
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
    localforage.setItem(`wgc.${state.extension.id}`, state)
  }
}
