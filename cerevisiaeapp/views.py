from cerevisiaeapp import app
from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound 

@app.route("/")
def hello():
    return render_template("index.html")

