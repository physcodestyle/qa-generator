function getAllQuestionWithAnswers(collectionAPI) {
  return collectionAPI.getFilteredByGlob(`src/!(views|data|includes|layouts)**/**/**/*.md`)
}

function qasAsTree(collectionApi) {
  const allQa = getAllQuestionWithAnswers(collectionApi)
  const result = allQa.reduce((map, qa) => {
    const specialty = qa.filePathStem.split('/')[1]
    const competence = qa.filePathStem.split('/')[2]
    const discipline = qa.filePathStem.split('/')[3]
    
    if (!Object.keys(map).includes(specialty)) {
      map[specialty] = {}
    }
    if (!Object.keys(map[specialty]).includes(competence)) {
      map[specialty][competence] = {}
    }
    if (!Object.keys(map[specialty][competence]).includes(discipline)) {
      map[specialty][competence][discipline] = []
    }
    map[specialty][competence][discipline].push(qa)

    return map
  }, {})
  return result
}

function getAllQuestionBySpecialty(collectionAPI, specialty) {
  return collectionAPI.getFilteredByGlob(`src/${specialty}/**/**/*.md`)
}

function getAllQuestionByCompetence(collectionAPI, specialty, competence) {
  return collectionAPI.getFilteredByGlob(`src/${specialty}/${competence}/**/*.md`)
}

function getAllQuestionByDiscipline(collectionAPI, specialty, competence, discipline) {
  return collectionAPI.getFilteredByGlob(`src/${specialty}/${competence}/${discipline}/*.md`)
}

module.exports = (config) => {
  config.addCollection('qas', (collectionApi) => {    
    return getAllQuestionWithAnswers(collectionApi)
  })

  config.addCollection('qasAsTree', (collectionAPI) => {
    return qasAsTree(collectionAPI)
  })

  config.addCollection('qasBySpecialty', (collectionAPI) => {
    const specialties = Object.keys(qasAsTree(collectionAPI))
    return specialties.reduce((map, s) => {
      return {
        ...map,
        [s]: [getAllQuestionBySpecialty(collectionAPI, s)],
      }
    }, {})
  })

  config.addCollection('qasByCompetence', (collectionAPI) => {
    const tree = qasAsTree(collectionAPI)
    const specialties = Object.keys(tree)
    const competencies = specialties.reduce((list, s) => {
      return [
        ...list,
        ...(Object.keys(tree[s]).map((v) => `${s}/${v}`))
      ]
    }, [])
    return competencies.reduce((map, competence) => {
      const parts = competence.split('/')
      return {
        ...map,
        [competence]: [getAllQuestionByCompetence(collectionAPI, parts[0], parts[1])],
      }
    }, {})
  })

  config.addCollection('qasByDiscipline', (collectionAPI) => {
    const tree = qasAsTree(collectionAPI)
    const specialties = Object.keys(tree)
    const competencies = specialties.reduce((list, s) => {
      return [
        ...list,
        ...(Object.keys(tree[s]).map((v) => `${s}/${v}`))
      ]
    }, [])
    const disciplines = competencies.reduce((list, c) => {
      const parts = c.split('/')
      return [
        ...list,
        ...(Object.keys(tree[parts[0]][parts[1]]).map((v) => `${parts[0]}/${parts[1]}/${v}`))
      ]
    }, [])
    return disciplines.reduce((map, discipline) => {
      const parts = discipline.split('/')
      const data = getAllQuestionByDiscipline(collectionAPI, parts[0], parts[1], parts[2])
      return {
        ...map,
        [discipline]: [...data],
      }
    }, {})
  })

  config.addTransform('xml-clean', (content) => {
    return content.replace(/([ ]*|)\n/gi, '\n').replace(/\n\n/gi, '\n').replace(/\n\n/gi, '\n')
  })

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: 'includes',
      layouts: 'layouts',
      data: 'data',
    },
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    passthroughFileCopy: true,
    templateFormats: [
      'md', 'njk'
    ],
  };
}