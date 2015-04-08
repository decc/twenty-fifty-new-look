require 'jshintrb/jshinttask'
require 'json'

Jshintrb::JshintTask.new :jshint do |t|
  t.pattern = 'source/javascripts/**/*.js'
  t.exclude_pattern = 'source/javascripts/{vendor/**/*,require}.js'
  t.options = JSON.parse(IO.read('.jshintrc'))
end

desc "Compile webfonts"
task :fonts do
  `fontcustom compile`
end

