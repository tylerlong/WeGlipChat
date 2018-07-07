import Vue from 'vue'
import * as R from 'ramda'

import { initialState } from './state'

export const reset = state => {
  const s = initialState()
  Object.keys(s).forEach(key => {
    state[key] = s[key]
  })
}

export const set = (state, { key, value }) => {
  Vue.set(state, key, value)
}

export const addGroup = (state, group) => {
  state.groups.unshift(group)
}

export const addPost = (state, post) => {
  state.posts[post.groupId].unshift(post)
  const group = state.groups.find(g => g.id === post.groupId)
  if (R.isNil(group)) {
    return
    // todo: should fetch the group from server
  }
  state.groups = [group, ...R.reject(g => g.id === group.id, state.groups)]
}

export const setPersons = (state, persons) => {
  for (const person of persons) {
    Vue.set(state.persons, person.id, person)
  }
}

export const setPosts = (state, { groupId, posts }) => {
  const oldPosts = state.posts[groupId] || []
  if (R.isEmpty(R.difference(posts, oldPosts))) {
    // console.log('no new or changed posts')
    return
  }
  Vue.set(state.posts, groupId, posts)
}

export const setGroups = (state, groups) => {
  const oldGroups = state.groups || []
  if (R.isEmpty(R.difference(groups, oldGroups))) {
    // console.log('no new or changed groups')
    return
  }
  state.groups = groups
}

export const setExtension = (state, extension) => {
  extension.id = extension.id.toString()
  state.extension = extension
}

export const showLoginModal = state => {
  state.loginModalVisible = true
}

export const hideLoginModal = state => {
  state.loginModalVisible = false
}
