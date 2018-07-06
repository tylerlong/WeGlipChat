import * as R from 'ramda'
import { Markdown } from 'glipdown'
import cheerio from 'cheerio'

import { emojiToImage } from '../emoji'
import userAvatar from '../user-avatar.png'
import groupAvatar from '../group-avatar.png'

export const getPerson = state => id => {
  return state.persons[id]
}

export const getPostText = state => post => {
  const html = Markdown(post.text).replace(/\n/g, '<br/>')
  const $ = cheerio.load(html)
  $('a').addClass('external')
  let result = $('body').html()
  result = R.replace(/!\[:Person\]\(((?:glip-)?\d+)\)/g, (_, id) => {
    return `<a class="external" href="#/person/${id}">@${getPersonNameById(state)(id)}</a>`
  }, result)
  result = R.replace(/!\[:Team\]\((\d+)\)/g, (_, id) => {
    return `<a class="external" href="#/group/${id}">@${getGroupNameById(state)(id)}</a>`
  }, result)
  result = emojiToImage(result)
  return result
}

export const getPostPreviewText = state => post => {
  let text = ''
  if (!R.isNil(post.text) && !R.isEmpty(post.text)) {
    text = getPostText(state)(post)
    const $ = cheerio.load(text)
    text = $.text()
  }
  if (text === '' && !R.isNil(post.attachments) && post.attachments.length > 0) {
    text = `Uploaded ${post.attachments[0].name}`
  }
  if (text === '') {
    text = 'Unsupported message'
  }
  return text
}

export const getGroupMessagePreviewText = state => group => {
  const posts = state.posts[group.id]
  if (R.isNil(posts)) {
    return ''
  }
  const post = posts[0]
  if (R.isNil(post)) {
    return ''
  }
  return `${getPersonNameById(state)(post.creatorId) || 'Unknown user'}: ${getPostPreviewText(state)(post)}`
}

export const getGroupAvatar = state => group => {
  switch (group.type) {
    case 'PrivateChat':
      const userId = group.members.filter(id => !isMyself(state)(id))[0]
      return getPersonAvatar(state)(userId)
    case 'PersonalChat':
      return getPersonAvatar(state)(state.extension.id)
    default:
      return groupAvatar
  }
}

export const getPersonAvatar = state => id => {
  const person = state.persons[id]
  if (!person) {
    return userAvatar
  }
  const avatar = person.avatar
  if (R.isNil(avatar)) {
    return userAvatar
  }
  return avatar
}

export const getPersonNameById = state => id => {
  const person = state.persons[id]
  if (R.isNil(person)) {
    return undefined
  }
  if (!R.isNil(person.firstName) || !R.isNil(person.lastName)) {
    return `${R.isNil(person.firstName) ? '' : person.firstName} ${R.isNil(person.lastName) ? '' : person.lastName}`
  } else {
    return person.email
  }
}

export const getGroupNameById = state => id => {
  const group = getGroupById(state)(id)
  if (R.isNil(group)) {
    return undefined
  }
  switch (group.type) {
    case 'PrivateChat':
      const memberId = group.members.filter(id => !isMyself(state)(id))[0]
      return getPersonNameById(state)(memberId)
    case 'Group':
      const memberIds = group.members.filter(id => !isMyself(state)(id))
      const personNames = memberIds.map(id => getPersonNameById(state)(id)).filter(name => !R.isNil(name))
      return personNames.join(', ')
    case 'PersonalChat':
      return getPersonNameById(state)(state.extension.id)
    default: // Team
      return group.name
  }
}

export const getGroupById = state => id => {
  return R.find(g => g.id === id, state.groups || [])
}

export const getPostsByGroupId = state => groupId => {
  return state.posts[groupId]
}

export const isMyself = state => personId => {
  return state.extension && personId === state.extension.id
}

export const getPersonalGroup = state => () => {
  return R.find(g => g.type === 'PersonalChat', state.groups)
}

export const getPrivateGroup = state => personId => {
  return R.find(g => g.type === 'PrivateChat' && g.members.indexOf(personId) !== -1, state.groups)
}
