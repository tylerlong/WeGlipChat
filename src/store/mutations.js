import Vue from 'vue'

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
