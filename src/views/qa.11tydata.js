module.exports = {
  layout: 'base.njk',

  pagination: {
    data: 'collections.qas',
    size: 1,
    alias: 'qa',
  },

  permalink: '/{{qa.filePathStem}}.xml',

  eleventyComputed: {
    filename: function (data) {
      const { qa } = data
      const { fileSlug } = qa
      return fileSlug
    },

    title: function (data) {
      const { qa, filename } = data
      const { title } = qa.data
      return title || `Вопрос № ${filename}`
    },

    discipline: function (data) {
      const { qa } = data
      const { discipline } = qa.data
      return discipline
    },

    tags: function (data) {
      const { qa } = data
      const { tags } = qa.data
      return tags
    },

    answers: function (data) {
      const { qa } = data
      const { answers } = qa.data
      return answers || []
    },

    commentary: function (data) {
      const { qa } = data
      const { commentary } = qa.data
      return commentary || ''
    },

    response: function (data) {
      const { qa } = data
      const { response } = qa.data
      return response || ''
    },

    feedback: function (data) {
      const { qa } = data
      const { tags, feedback } = qa.data
      return feedback || (tags === 'essay' ? '' : [])
    },
    
    grade: function (data) {
      const { qa } = data
      const { grade } = qa.data
      return grade || 1.0000000
    },
    
    penalty:  function (data) {
      const { qa } = data
      const { penalty } = qa.data
      return penalty || 0.0000000
    },

    withSingleAnswer: function (data) {
      const { answers } = data
      return Array.isArray(answers) ? answers.filter((a) => a.fraction === 100).length > 0 : false
    },
    
    withShuffling:  function (data) {
      const { qa } = data
      const { withShuffling } = qa.data
      return withShuffling || false
    },
  },
}