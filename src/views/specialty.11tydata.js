module.exports = {
  layout: 'base.njk',

  pagination: {
    data: 'collections.qasBySpecialty',
    size: 1,
    alias: 'qas',
  },

  permalink: '/{{qas}}/index.xml',

  eleventyComputed: {
    qaList: function (data) {
      const { collections, qas } = data
      const parts = qas.split('/')
      const qaAsTree = collections.qasAsTree
      const result = []
      if (Object.keys(qaAsTree).includes(parts[0])) {
        const specialty = qaAsTree[parts[0]]
        Object.keys(specialty).forEach((competence) => {
          Object.keys(qaAsTree[parts[0]][competence]).forEach((discipline) => {
            result.push(...qaAsTree[parts[0]][competence][discipline])
          })
        })
      }
      return result
    },
  },
}