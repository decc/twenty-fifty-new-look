# DECC 2050 Calculator

Front end for [DECC 2050 calculator](https://github.com/decc/twenty-fifty)

## Development

### Dependencies

* Requires ruby 2.2.2
* Fontcustom has its own dependencies. See
  [github](https://github.com/FontCustom/fontcustom)

### Setup

* `git clone`
* `bundle install`
* `middleman build`
* `bundle exec rackup`

Open your browser at <http://localhost:9292>

### Building

In source/javascripts/config.js set `apiUrl`, and `siteUrl`.
Then `middleman build`.

resulting code will be in `./build`. This is the code to deploy.

### Icon font

Built with font custom gem. Svg files go in `source/icons`, run `rake fonts` to
compile.

