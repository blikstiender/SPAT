/*
 * resultcomp.js
 * component to show the search result, and display loading gif until it is ready. 
 * Yotam 2016 
 */


var React  = require("react");
var jQuery = require("jquery-browserify");

var READYTIMEOUT = 1000; /* miliseconds until re-check if ready */

/* send result id to server to find out if the result is ready */
var checkIfReady = function(resultId, callback) {
	jQuery.ajax({
		type: "GET", 
		url: "/resultavailable", 
		data: {"id": resultId}, 
		success: function(data) {
			data = JSON.parse(data);
			callback(null, data); 
		}, 
		error: function(err) {
			err = JSON.parse(err);
			callback(err); 
		} 
	});
}


module.exports = React.createClass({
	getInitialState: function() {
	    return {
			resultReady: false
	    };
	    
	},
	checkIfResultReady: function() {
		
		var self = this; 
		if (! this.state.resultReady) {
			checkIfReady(this.props.resultId, function(err, data) {
				if (!err) {
					if (data.available) {
						self.setState({
							resultReady: true
						}); 
					} 
				} else {
					console.error(err);
				}
			});
			window.setTimeout(self.checkIfResultReady, READYTIMEOUT); 
		}


	},
	backPress: function() {
		this.props.showInputPhase(); 
	},
	downloadResult: function() {
		var resultUrl = "/result/download/" + this.props.resultFilename
		window.open(resultUrl);
	},
	viewResult: function() {
		console.log("viewing");
		var resultUrl = "/result/view/" + this.props.resultFilename
		window.open(resultUrl);
	},
	render: function() {
		this.checkIfResultReady(); 
		var resultView = this.state.resultReady?
			(
				<div className="resultAccess">
					<div className="downloadResult" onClick={this.downloadResult}>Download<br/>&#x25bd;</div>
					<div className="viewResult" onClick={this.viewResult}>View in seperate page</div>
				</div>
			):
			(	<div className="resultAccess">
					<div className="loadingResult"></div>
				</div>
			);

		return (
			<div className="resultView">
				<a onClick={this.backPress} className="backButton">
					<span className="backSymbol">&#x25c1;</span>
					<span className="backText">Start a new job (current job erased)</span>
				</a>
				{resultView}
			</div>

		)
	}
})