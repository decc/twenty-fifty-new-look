require 'rdiscount'

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page "/components/*", layout: false

#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###

helpers do
  def markdown(string)
    RDiscount.new(string).to_html
  end

  def m(i18n)
    markdown(I18n.t(i18n))
  end
end

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload, :host => "localhost"
end

activate :i18n

# Methods defined in the helpers block are available in templates
helpers do
  # Rails like path helpers
  # e.g. home_path => /#/home
  %W(home guide calculator share).each do |p|
    define_method("#{p}_path") do
      "/#/#{p}"
    end
  end
end

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

module RequireJS
    class << self
        def registered(app)
            app.after_build do |builder|
                exec('node r.js -o build/javascripts/app.build.js');
            end
        end
        alias :included :registered
    end
end

::Middleman::Extensions.register(:requirejs, RequireJS)

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript
  #
  # # build js
  # activate :requirejs

  # Enable cache buster
  # activate :asset_hash

  # Or use a different image path
  # set :http_prefix, "/Content/images/"

  # optimise image files on build
  activate :imageoptim
end

