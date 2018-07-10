import { Textcomplete, Textarea } from 'textcomplete'

export const enableMentionAutoComplete = (textarea, persons) => {
  const mentionStrategy = {
    id: 'mention',
    match: /(^|\s)@([A-Za-z ]*)$/,
    search: function (term, callback) {
      callback(persons.filter(person => person.name.toLowerCase().indexOf(term.toLowerCase()) !== -1))
    },
    template: function (person) {
      return `${person.name} (${person.id})`
    },
    replace: function (person) {
      return `$1![:Person](${person.id}) `
    }
  }
  const editor = new Textarea(textarea)
  const textcomplete = new Textcomplete(editor, {
    dropdown: {
      maxCount: 6,
      placement: 'top'
    }
  })
  textcomplete.register([mentionStrategy])
}
