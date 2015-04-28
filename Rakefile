require 'jshintrb/jshinttask'
require 'json'

Jshintrb::JshintTask.new :jshint do |t|
  t.pattern = 'source/javascripts/**/*.js'
  t.exclude_pattern = 'source/javascripts/{vendor/**/*,require}.js'
  t.options = JSON.parse(IO.read('.jshintrc'))
end

desc 'Compile webfonts'
task :fonts do
  `fontcustom compile`
end

desc 'deploy preview - RUN FROM master'
task :preview do
  `middleman build`
  FileUtils.cp_r './build', '../preview/'
  FileUtils.rm_r './build'
  FileUtils.cd '../preview'
  `git add -A && git commit -m 'preview' && git push heroku master --force`

  head = `git rev-parse HEAD`
  last = `git rev-parse HEAD~1`

  'bundle exec cb deploy OLD NEW -e staging \
    -s staging.decc.monochromedns.co.uk \
    -b develop \
    -h codebase.monochrome.co.uk -r decc-ui:decc-ui \
    --protocol htts'
end

