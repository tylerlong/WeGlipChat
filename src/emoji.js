import { Textcomplete, Textarea } from 'textcomplete'
import * as R from 'ramda'

import emojis from './emojis.json'

const emojiStrategy = {
  id: 'emoji',
  match: /(^|\s):([a-z0-9+\-_]*)$/,
  search: function (term, callback) {
    callback(Object.keys(emojis).filter(function (name) {
      return name.indexOf(term) !== -1
    }))
  },
  template: function (name) {
    return `<img src="${emojis[name]}"/> ${name}`
  },
  replace: function (name) {
    return `$1:${name}: `
  }
}

export const enableEmojiAutoComplete = textarea => {
  const editor = new Textarea(textarea)
  const textcomplete = new Textcomplete(editor, {
    dropdown: {
      maxCount: 8,
      placement: 'top'
    }
  })
  textcomplete.register([emojiStrategy])
}

export const emojiToImage = text => {
  let result = text
  R.forEach(shortname => {
    const word = R.tail(R.init(shortname))
    if (word in emojis) {
      result = result.replace(shortname, `<img src="${emojis[word]}" class="emoji-image" alt="${shortname}" title="${shortname}" /><span style="display: none;">${shortname}</span>`)
    }
  }, R.match(/:[a-z0-9_+-]+:/g, text))
  return result
}
