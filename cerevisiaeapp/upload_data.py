from flask         import send_from_directory, request
from cerevisiaeapp import app
from result        import result
import os
import string
import random
import json


def id_generator(size=10, chars=string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

# --NOTE: content-type header must be set to "application/json" for this to work 
@app.route('/uploaddata', methods=['POST'])
def upload_data(): 
    content = request.get_json(silent=True)
    newid    = id_generator()
    if content["output_opt"]["outputFormat"] == "csv": 
	    filename = newid + "-result.xls"  # e.g. bl342kyi1k-result.xls
    app.config["results"][newid] = result(newid, input_data=content, filename=filename)
    return json.dumps({
    	"id": newid, 
    	"filename": filename
    })





