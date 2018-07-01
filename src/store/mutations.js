import Vue from 'vue'

import { initialState } from './state'

export const reset = state => {
  const s = initialState()
  Object.keys(s).forEach(key => {
    state[key] = s[key]
  })
}

export const setPersons = (state, persons) => {
  for (const person of persons) {
    Vue.set(state.persons, person.id, person)
  }
}

export const setPosts = (state, { groupId, posts }) => {
  Vue.set(state.posts, groupId, posts)
}

export const setGroups = (state, groups) => {
  state.groups = groups
}

export const setExtension = (state, extension) => {
  extension.id = extension.id.toString()
  state.extension = extension
}

export const setToken = (state, token) => {
  state.token = token
}

export const showLoginModal = state => {
  state.loginModalVisible = true
}

export const hideLoginModal = state => {
  state.loginModalVisible = false
}
