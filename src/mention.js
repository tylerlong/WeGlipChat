import { Textcomplete, Textarea } from 'textcomplete'
import * as R from 'ramda'

export const enableMentionAutoComplete = (textarea, _persons) => {
  const persons = [{ id: 'ALL', name: 'All' }, ..._persons]
  const mentionStrategy = {
    id: 'mention',
    match: /(^|\s)@([A-Za-z ]*)$/,
    search: function (term, callback) {
      callback(persons.filter(person => !R.isNil(person.name) && person.name.toLowerCase().indexOf(term.toLowerCase()) !== -1))
    },
    template: function (person) {
      return `${person.name} (${person.id})`
    },
    replace: function (person) {
      if (person.id === 'ALL') {
        return _persons.map(p => `$1![:Person](${p.id}) `).join('')
      } else {
        return `$1![:Person](${person.id}) `
      }
    }
  }
  const editor = new Textarea(textarea)
  const textcomplete = new Textcomplete(editor, {
    dropdown: {
      maxCount: 8,
      placement: 'top'
    }
  })
  textcomplete.register([mentionStrategy])
}
