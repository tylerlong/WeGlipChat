import { Textcomplete, Textarea } from 'textcomplete'
// import * as R from 'ramda'

const mentions = {
  'Tyler Liu': '850957020',
  'Max Jiang': '22222'
}

const mentionStrategy = {
  id: 'mention',
  match: /(^|\s)@([A-Za-z ]*)$/,
  search: function (term, callback) {
    callback(Object.keys(mentions).filter(function (name) {
      return name.indexOf(term) !== -1
    }))
  },
  template: function (name) {
    return `${name}`
  },
  replace: function (name) {
    return `$1![:Person](${mentions[name]}) `
  }
}

export const enableMentionAutoComplete = textarea => {
  const editor = new Textarea(textarea)
  const textcomplete = new Textcomplete(editor, {
    dropdown: {
      maxCount: 6,
      placement: 'top'
    }
  })
  textcomplete.register([mentionStrategy])
}
