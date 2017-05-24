var React    = require('react');
var jQuery   = require("jquery-browserify");


var UPDATETIMEOUT = 5; /* milisecond timeout to delay updates to parent state */

var FileInput = React.createClass({
	getInitialState: function() {
		return {
			fileText: "",
			fileName: "File Preview"
		}
	},
	componentDidMount:function() {
	      
	},
	fileSelected: function(e) {
		var self = this; 
		var file = e.target.files[0];
	    var reader = new FileReader();
	    reader.readAsText(file, "UTF-8");
	    reader.onload = function(e) {
	        fileRawContent = reader.result;
	        self.setState({
	        	fileText: fileRawContent,
	        	fileName: file.name
	        });
			window.setTimeout(function(){
				self.updateData()
			}, UPDATETIMEOUT);
	    };
	},
	updateData: function() {
		this.props.updateData({
			fileData: this.state
		})
	},
	render: function() {
		return (
				<div className="fileInput dataInput col3" style={{display: (this.props.visible? "": "none")}}>
					<h4>Select your data file:</h4>
					<a className="sendDataButton" onClick={this.props.onClick}> Get Results </a>
                    <span className="fileName">{this.state.fileName} </span>
                    <div className="filePreview">
                    	{this.state.fileText.substring(1, 1000)}
                    </div>
                    <label className="uploadFileInput">
                    	<div className="uploadButton">&#x25b3; Choose File...</div>
                    	<input type="file" onChange={this.fileSelected}/>
                    </label>
                </div> 
		)
	}
});


var TextInput = React.createClass({
	getInitialState: function(){
		return {
			dataType: "fasta", 
			data: ""
		}
	},
	componentDidMount:function() {
		this.updateData();
	},
	dataTypeChange: function(event) {
		this.setState({dataType: event.target.value})
		window.setTimeout(function(){
			self.updateData()
		}, UPDATETIMEOUT);
	},
	onChange: function(event) {
		this.setState({
			data: event.target.value
		});
		var self = this; 
		window.setTimeout(function(){
			self.updateData()
		}, UPDATETIMEOUT);
	},
	updateData: function() {
		this.props.updateData({
			textData: this.state
		});
	},
	render: function() {
		return (
			<div className="textInput dataInput col3" style={{display: (this.props.visible? "": "none")}}>
				<h4>Enter your data below:</h4>
				<a className="sendDataButton" onClick={this.props.onClick}> Get Results </a>
				<div className="textInput">
					<input type="radio" name="inputtype" value="fasta" onClick={this.dataTypeChange} defaultChecked={true}/>Fasta &nbsp;&nbsp;&nbsp;
					{/*<input type="radio" name="inputtype" value="seq" onClick={this.dataTypeChange}/>Sequence*/ /*Will add pure sequence in future*/}
					<textarea className="textInputArea" placeholder="enter your data here" value={this.state.data} onChange={this.onChange} />
				</div>
			</div>
		)
	}
});

var InputComponent = React.createClass({
	render: function() {
		return (
			<div>
				<FileInput onClick={this.props.onClick} updateData={this.props.updateData} visible={this.props.fileInput}/>
				<TextInput onClick={this.props.onClick} updateData={this.props.updateData} visible={!this.props.fileInput}/>
			</div>

		)	}
});


module.exports = InputComponent;
