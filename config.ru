# encoding: utf-8
require 'rubygems'
require 'bundler'
Bundler.setup

# The actual server code is in src/server.rb
require './server'

# The server can run in two modes, 'production' and 'development'
# the mode is set in the RACK_ENV or RAILS_ENV environment variables
ENV['RACK_ENV'] = ENV['RAILS_ENV'] if ENV['RAILS_ENV']

# This sets up the bits of the server

# To compress the data going back and forth
use Rack::Deflater
# This logs access and errors
use Rack::CommonLogger

# This is defined in src/server.rb
run TwentyFiftyServer
