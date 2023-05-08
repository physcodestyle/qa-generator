module.exports = {
  layout: 'base.njk',

  eleventyComputed: {
    documentTitle: function (data) {
      return data.title
    },
  }
}