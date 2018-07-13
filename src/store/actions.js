import * as R from 'ramda'
import multipartMixedParser from 'multipart-mixed-parser'
import localforage from 'localforage'

import rc from '../api/ringcentral'

export const updatePostText = (_, { groupId, postId, text }) => {
  rc.put(`/restapi/v1.0/glip/groups/${groupId}/posts/${postId}/text`, text, {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}

export const addPost = async ({ state, dispatch, commit }, post) => {
  const posts = state.posts[post.groupId]
  if (R.isNil(posts)) {
    await dispatch('fetchPosts', post.groupId)
  } else {
    commit('addPost', post)
  }
  const group = await dispatch('ensureGroup', post.groupId)
  commit('moveGroupToFirst', group)
}

export const ensureGroup = async ({ state }, groupId) => {
  let group = state.groups.find(g => g.id === groupId)
  if (R.isNil(group)) {
    const r = await rc.get(`/restapi/v1.0/glip/groups/${groupId}`)
    group = r.data
  }
  return group
}

export const ensurePrivateGroup = async ({ state, dispatch }, personId) => {
  let group = R.find(g => g.type === 'PrivateChat' && g.members.indexOf(personId) !== -1, state.groups)
  if (!group) {
    const r = await rc.post('/restapi/v1.0/glip/groups', {
      type: 'PrivateChat',
      members: [state.extension.id, personId]
    })
    group = r.data
    await dispatch('addGroup', group)
  }
  return group
}

export const addGroup = ({ dispatch, commit }, group) => {
  commit('addGroup', group)
  dispatch('fetchPersons', group.members)
}

export const shareFile = async (context, { groupId, file }) => {
  const data = new window.FormData()
  data.append('file', file)
  await rc.post('/restapi/v1.0/glip/files', data, { params: { groupId } })
}

export const sendMessage = async (context, { groupId, text }) => {
  await rc.post('/restapi/v1.0/glip/posts', { groupId, text })
}

export const init = async ({ dispatch, commit, state }, subscribe) => {
  await dispatch('fetchExtension')
  const cachedState = await localforage.getItem(`wgc.${state.extension.id}`)
  if (!R.isNil(cachedState)) {
    commit('loadCache', cachedState)
  }
  subscribe((_, state) => {
    if (!R.isNil(state.extension)) {
      localforage.setItem(`wgc.${state.extension.id}`, state)
    }
  })
  await dispatch('fetchGroups')
  const personIds = R.pipe(
    R.map(g => g.members),
    R.reduce(R.concat, [])
  )(state.groups)
  dispatch('fetchPersons', personIds)
  for (const group of state.groups.slice(0, 16)) {
    dispatch('fetchPosts', group.id)
  }
  for (const group of state.groups.slice(16)) {
    if (R.isNil(state.posts[group.id])) {
      await dispatch('fetchPosts', group.id)
    }
  }
}

export const fetchExtension = async ({ commit }) => {
  const r = await rc.get('/restapi/v1.0/account/~/extension/~')
  commit('setExtension', r.data)
}

export const fetchGroups = async ({ commit }) => {
  const r = await rc.get('/restapi/v1.0/glip/groups', { params: { recordCount: 250 } })
  commit('setGroups', r.data.records)
}

export const fetchGroup = async ({ commit }, groupId) => {
  const r = await rc.get(`/restapi/v1.0/glip/groups/${groupId}`)
  commit('setGroup', r.data)
}

export const fetchPosts = async ({ commit, state }, groupId) => {
  const r = await rc.get(`/restapi/v1.0/glip/groups/${groupId}/posts`, { params: { recordCount: 30 } })
  commit('setPosts', { groupId, posts: r.data.records, pageToken: r.data.navigation.prevPageToken })
}

export const fetchMorePosts = async ({ commit, state }, groupId) => {
  const r = await rc.get(`/restapi/v1.0/glip/groups/${groupId}/posts`, { params: {
    recordCount: 30,
    pageToken: state.groupPageTokens[groupId]
  } })
  commit('appendPosts', { groupId, posts: r.data.records, pageToken: r.data.navigation.prevPageToken })
}

export const fetchPersons = async ({ commit, state }, personIds) => {
  const idsToFetch = R.pipe(
    R.uniq,
    R.filter(id => !(id in state.persons) || new Date().getTime() - (state.persons[id].lastFetchedTime || 0) > 86400000)
  )(personIds)
  for (let ids of R.splitEvery(30, idsToFetch)) {
    if (ids.length === 1) { // turn a normal get to a batch get
      ids = [...ids, state.extension.id]
    }
    const r = await rc.get(`/restapi/v1.0/glip/persons/${ids.join(',')}`)
    const persons = multipartMixedParser.parse(r.data).slice(1).filter(p => 'id' in p)
    commit('setPersons', persons)
  }
}
