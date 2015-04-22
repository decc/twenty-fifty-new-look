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

desc 'deploy preview'
task :preview do
  `middleman build`
  FileUtils.cp_r './build', '../preview/'
  FileUtils.rm_r './build'
  FileUtils.cd '../preview'
  `git add -A && git commit -m 'preview' && git push heroku master --force`
end

