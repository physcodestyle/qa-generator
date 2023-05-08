module.exports = {
  layout: 'base.njk',

  pagination: {
    data: 'collections.qasByDiscipline',
    size: 1,
    alias: 'qas',
  },

  permalink: '/{{qas}}/index.xml',

  eleventyComputed: {
    qaList: function (data) {
      const { collections, qas } = data
      const parts = qas.split('/')
      const qaAsTree = collections.qasAsTree
      if (Object.keys(qaAsTree).includes(parts[0])) {
        const qaAsTreeSpecialty = qaAsTree[parts[0]]
        if (Object.keys(qaAsTreeSpecialty).includes(parts[1])) {
          const qaAsTreeSpecialtyCompetence = qaAsTreeSpecialty[parts[1]]
          return qaAsTreeSpecialtyCompetence[parts[2]]
        }
      }
      return []
    },
  },
}