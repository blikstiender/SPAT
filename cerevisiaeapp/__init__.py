# __init__.py
# set up for the web app
# By: Yotam 2016

from flask import Flask, Blueprint

app = Flask(__name__,  template_folder='public/html')
css  = Blueprint("css", __name__, static_folder="public/css")
js   = Blueprint("js", __name__, static_folder="public/js")
imgs = Blueprint("images", __name__, static_folder="public/img")
app.config["results"] = {}

app.register_blueprint(css)
app.register_blueprint(js)
app.register_blueprint(imgs)

import cerevisiaeapp.views
import cerevisiaeapp.upload_data
import cerevisiaeapp.get_results


# make the results directory
import os
import shutil

# super hacky way, make this better
if "yotam" not in os.path.realpath(__file__):
	app.config["analysis_dir"] = "/var/www/app/cerevisiaeapp/analysis_files/" 
	app.config["results_dir"]  = "/var/www/app/cerevisiaeapp/analysis_files/results/"
	app.config["temp_dir"]     = "/var/www/app/cerevisiaeapp/analysis_files/temp/"
	app.config["xstream_exec"] = "/var/www/app/cerevisiaeapp/bin/xstream.jar"

	if os.path.exists(app.config["analysis_dir"]):
		shutil.rmtree(app.config["analysis_dir"])

	os.makedirs(app.config["analysis_dir"])
	os.makedirs(app.config["results_dir"])
	os.makedirs(app.config["temp_dir"])
else: 
	app.config["analysis_dir"] = "cerevisiaeapp/analysis_files/" 
	app.config["results_dir"]  = "cerevisiaeapp/analysis_files/results/"
	app.config["temp_dir"]     = "cerevisiaeapp/analysis_files/temp/"
	app.config["xstream_exec"] = "cerevisiaeapp/bin/xstream.jar"

	if os.path.exists(app.config["analysis_dir"]):
		shutil.rmtree(app.config["analysis_dir"])

	os.makedirs(app.config["analysis_dir"])
	os.makedirs(app.config["results_dir"])
	os.makedirs(app.config["temp_dir"])


