import Vue from 'vue'
import * as R from 'ramda'
import dayjs from 'dayjs'

import { initialState } from './state'

export const setNetworkTimestamp = (state) => {
  state.networkTimestamp = dayjs(new Date()).valueOf()
}

export const setEnableNotifications = (state, value) => {
  state.config.enableNotifications = value
}

export const setTheme = (state, value) => {
  state.config.theme = value
}

export const moveGroupToFirst = (state, group) => {
  state.groups = [group, ...R.reject(g => g.id === group.id, state.groups)]
}

export const addPost = (state, post) => {
  state.posts[post.groupId].unshift(post)
}

export const removePost = (state, postId) => {
  for (const posts of R.values(state.posts)) {
    const index = R.findIndex(p => p.id === postId, posts)
    if (index === -1) {
      continue
    }
    posts.splice(index, 1)
    break
  }
}

export const updatePost = (state, post) => {
  const posts = state.posts[post.groupId]
  const index = R.findIndex(p => p.id === post.id, posts)
  Vue.set(posts, index, post)
}

export const updateGroup = (state, group) => {
  const index = R.findIndex(g => g.id === group.id, state.groups)
  Vue.set(state.groups, index, group)
}

export const reset = state => {
  const s = initialState()
  Object.keys(s).forEach(key => {
    state[key] = s[key]
  })
}

export const loadCache = (state, cachedState) => {
  const s = initialState()
  Object.keys(s).forEach(key => {
    if (key !== 'extension' && !R.isNil(cachedState[key])) {
      state[key] = cachedState[key]
    }
  })
}

export const addGroup = (state, group) => {
  state.groups.unshift(group)
  Vue.set(state.readTimestamps, group.id, dayjs(new Date()).subtract(1, 'hour').valueOf())
}

export const setPersons = (state, persons) => {
  for (const person of persons) {
    person.lastFetchedTime = new Date().getTime()
    Vue.set(state.persons, person.id, person)
  }
}

export const setPosts = (state, { groupId, posts, pageToken }) => {
  const oldPosts = state.posts[groupId]
  if (R.isNil(oldPosts) || R.difference(posts, R.slice(0, posts.length, oldPosts)).length > 0) {
    Vue.set(state.posts, groupId, posts)
    Vue.set(state.groupPageTokens, groupId, pageToken)
  }
}

export const appendPosts = (state, { groupId, posts, pageToken }) => {
  state.posts[groupId] = [...state.posts[groupId], ...posts]
  Vue.set(state.groupPageTokens, groupId, pageToken)
}

export const setGroups = (state, groups) => {
  const oldGroups = state.groups
  if (R.isNil(oldGroups) || R.difference(groups, oldGroups).length > 0) {
    state.groups = groups
    for (const group of groups) {
      if (R.isNil(state.readTimestamps[group.id])) {
        Vue.set(state.readTimestamps, group.id, dayjs(new Date()).subtract(1, 'hour').valueOf())
      }
    }
  }
}

export const setGroup = (state, group) => {
  const index = R.findIndex(g => g.id === group.id, state.groups)
  if (index === -1) {
    if (group.isPublic) {
      state.groups.unshift(group)
    } else {
      state.groups.push(group)
    }
  } else {
    if (!R.equals(state.groups[index], group)) {
      Vue.set(state.groups, index, group)
    }
  }
}

export const setExtension = (state, extension) => {
  extension.id = extension.id.toString()
  state.extension = extension
}

export const updateReadTimestamp = (state, groupId) => {
  Vue.set(state.readTimestamps, groupId, dayjs(new Date()).valueOf())
}
