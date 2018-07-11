import MarkdownIt from 'markdown-it'

const mdi = new MarkdownIt({
  html: true,
  linkify: true
})

const text = `<pre>
node_modules/
build/

config.js
config.prod.js
confix.sandbox.js
yarn-error.log

temp.spec.js
</pre>`

console.log(mdi.render(text))
