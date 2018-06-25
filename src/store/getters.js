import * as R from 'ramda'

export const getGroupById = state => id => {
  return R.find(g => g.id === id, state.groups || [])
}

export const getPostsByGroupId = state => groupId => {
  return state.posts[groupId]
}

export const isMyself = state => personId => {
  return state.extension && personId === state.extension.id.toString()
}
