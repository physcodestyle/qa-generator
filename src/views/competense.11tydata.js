module.exports = {
  layout: 'base.njk',

  pagination: {
    data: 'collections.qasByCompetence',
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
          const qaAsTreeSpecialtyKeys = Object.keys(qaAsTreeSpecialty[parts[1]])
          return qaAsTreeSpecialtyKeys
            .reduce((map, key) => [
              ...map,
              ...qaAsTreeSpecialty[parts[1]][key]
            ], [])
            .map((q) => {
              q['withSingleAnswer'] = Array.isArray(q.data.answers) ? q.data.answers.filter((a) => a.fraction === 100).length > 0 : false
              return q
            })
        }
      }
      return []
    },

    title: function (data) {
      const { qas } = data
      return `Компетенция «${qas.split('/')[1]}»`
    },
  },
}