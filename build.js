({
  baseUrl: './build/javascripts',
  name: 'main',
  mainConfigFile: 'build/javascripts/main.js',
  deps: [
    'main',
    'components/calculatorHeader',
    'components/faq',
    'components/mainNav',
    'components/share',
    'components/pathwaySidebar',
    'components/chartTabs',

    'components/calculator',
    'components/allPathwayActions',

    'components/chartViews/airQuality',
    'components/chartViews/costs',
    'components/chartViews/emissions',
    'components/chartViews/energySecurity',
    'components/chartViews/flows',
    'components/chartViews/map',
    'components/chartViews/overview',
    'components/chartViews/tabbed'
  ],
  optimize: 'none',
  removeCombined: true,
  findNestedDependencies: true,
  out: 'build/javascripts/main.js'
})

