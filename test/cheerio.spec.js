import cheerio from 'cheerio'

const $ = cheerio.load(`<p>
line 1
line 2
line3
</p>`)

$('p').replaceWith(function () {
  return $(this).html().trim().replace(/\n/g, '<br/>')
})

console.log($('body').html())
