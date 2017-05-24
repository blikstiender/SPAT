# get_results.py
# url paths for a new result
# By: Yotam 2016

from flask         import request, send_file, Response
from cerevisiaeapp import app
import json
import os

@app.route('/resultavailable', methods=['GET'])
def result_available(): 
    result_id = request.args.get("id")
    if result_id == None: 
        return result_error()
    elif result_id.lower() in app.config["results"]:
        return json.dumps({"available": app.config["results"][result_id].job_complete})
    else:
        return json.dumps({
            "available": False, 
            "error": "result id incorrect"
        })

@app.route('/result/download/<path:path>')
def download_result(path): 
    filename = path
    file_path = "analysis_files/results/" + filename
    return send_file(file_path)

@app.route('/result/view/<path:path>')
def view_result_generate(path): 
    filename = app.config["results_dir"] + path
    if not os.path.isfile(filename): 
        return "Not found", 404
    def generate(): 
        with open(filename, 'r') as csvfile:
            for row in csvfile: 
                yield row + "\n"
    return Response(generate(), mimetype='text')

















