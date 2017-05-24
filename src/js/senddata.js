/* 
 * senddata.js
 * module to send the data to the backend
 * Yotam 2016
 */

var jQuery = require("jquery-browserify");



/*
	this is the formatting of the json object sent to the backend: 
	{
		data: {
			raw: "",
			type: "" 
		}
		input_options: "",
		output_options: ""
	}

 */




/* basic function to make the AJAX request to the server */
module.exports = function(compState, callback) {
	var dataObject = {}; 
	if (compState.fileInput) {
		dataObject = parseFileInput(compState.fileData);
	} else {
		dataObject = parseTextInput(compState.textData);
	}
	sendObject = { /* obejct being sent to the server */
		data: dataObject, 
		input_opt: compState.inputOptions,
		output_opt: compState.outputOptions
	}
    jQuery.ajax({
        type: "POST", 
        url: "/uploaddata",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(sendObject), 
        success: function(data) {
            data = JSON.parse(data);
            callback(null, data);
        }, 
        error: function(err) {
           callback(err)
        }
    });
}



function parseFileInput(fileData) {
	var retObj = {}; 
	/* parse data type from the filename */
	var fname = fileData.fileName.toLowerCase();
	if ( fname.indexOf("fasta") > -1) { /* TODO: write a regex to make this more permissive/exact */ 
		retObj.type = "fasta"
	} else if ( fname.indexOf("csv") > -1) { /* TODO: write a regex to make this more permissive/exact */ 
		retObj.type = "csv"
	} else {
		retObj.type = "na"
	}
	retObj.raw = fileData.fileText
	return retObj;
}

function parseTextInput(textData) {
	var retObj = {}; 
	retObj.type = textData.dataType; 
	retObj.raw = textData.data;
	return retObj;
}












