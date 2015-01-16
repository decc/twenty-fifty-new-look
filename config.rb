###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page "/components/**.*.html", layout: false
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

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
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

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  activate :asset_hash

  # Or use a different image path
  # set :http_prefix, "/Content/images/"

  # optimise image files on build
  activate :imageoptim
end

