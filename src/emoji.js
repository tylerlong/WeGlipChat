import { Textcomplete, Textarea } from 'textcomplete'

import emojis from './emojis.json'

const emojiStrategy = {
  id: 'emoji',
  match: /(^|\s):([a-z0-9+\-_]*)$/,
  search: function (term, callback) {
    callback(Object.keys(emojis).filter(function (name) {
      return name.startsWith(term)
    }))
  },
  template: function (name) {
    return '<img src="' + emojis[name] + '"></img> ' + name
  },
  replace: function (name) {
    return '$1:' + name + ': '
  }
}

export const enableEmojiAutoComplete = textarea => {
  const editor = new Textarea(textarea)
  const textcomplete = new Textcomplete(editor, {
    dropdown: {
      maxCount: 6,
      placement: 'top'
    }
  })
  textcomplete.register([emojiStrategy])
}
