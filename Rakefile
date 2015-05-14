require 'jshintrb/jshinttask'
require 'json'
require 'pry'

Jshintrb::JshintTask.new :jshint do |t|
  t.pattern = 'source/javascripts/**/*.js'
  t.exclude_pattern = 'source/javascripts/{vendor/**/*,require}.js'
  t.options = JSON.parse(IO.read('.jshintrc'))
end

desc 'Compile webfonts'
task :fonts do
  # TODO: delete old before compiling
  `bundle exec fontcustom compile`
end

desc 'deploy preview - RUN FROM master'
task :preview do
  `middleman build`
  FileUtils.cp_r './build', '../preview/'
  FileUtils.rm_r './build'
  FileUtils.cd '../preview'
  `git add -A && git commit -m 'preview' && git push heroku master --force`

  head = `git rev-parse HEAD`.delete(" \n")
  last = `git rev-parse HEAD~1`.delete(" \n")

  `cb deploy #{last} #{head} \
    -e staging \
    -s staging.decc.monochromedns.co.uk \
    -b master \
    -h codebase.monochrome.co.uk -r decc-ui:decc-ui \
    --protocol https`
end

