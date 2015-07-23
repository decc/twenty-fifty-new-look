# encoding: utf-8
require 'sinatra'
require 'erb'
require 'json'

require_relative './model/data_from_model'

# This deals with urls that relate to previous versions of the 2050 calculator.
# If you are developing your own calculator, delete from here to the line marked STOP DELETING HERE
class TwentyFiftyServer < Sinatra::Base

  set :public_folder, File.join(File.dirname(__FILE__), 'build')

  enable :lock # The C 2050 model is not thread safe

  # This allows users to download the excel spreadsheet version of the model
  get '/model.xlsx' do
    send_file 'model/model.xlsx'
  end

  if development?
    # This is the main method for getting data
    get '/pathways/:id/data' do |id|
      DataFromModel.new.calculate_pathway(id).to_json
    end
  else
    # This is the main method for getting data
    get '/pathways/:id/data' do |id|
      last_modified Model.last_modified_date # Don't bother recalculating unless the model has changed
      expires (24*60*60), :public # cache for 1 day
      content_type :json # We return json
      DataFromModel.new.calculate_pathway(id).to_json
    end
  end

  get '/pathways/11111111111111111111111111111111111111111111111111111/primary_energy_chart' do 
    redirect to('/')
  end

  get '/pathways/:id/:action' do |id, action|
    redirect "http://old-interface.2050.org.uk/pathways/#{id}/#{action}"
  end

  get '/pathways/:id' do |id|
    redirect "http://old-interface.2050.org.uk/pathways/#{id}"
  end

  get '*' do 
    send_file 'build/index.html'
  end

end
