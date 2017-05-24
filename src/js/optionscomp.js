var React = require("react");
var userOptions = require("./optionsconfig");
var baseInputOptions = userOptions.baseInputOptions;
var baseOutputOptions = userOptions.baseOutputOptions;


var UPDATETIMEOUT = 5; /* milisecond timeout to delay updates to parent state */

InputOption = React.createClass({
	getInitialState: function() {
	    return {
	    	value: this.props.defaultValue
	    };
	},
	componentDidMount: function() {
		this.updateData(this.props.defaultValue);
	},
	onBlur: function(event) {
		var inputValue = event.target.value; 
		if (inputValue < this.props.minimumValue) {
			inputValue = this.props.minimumValue;
		} else if (inputValue > this.props.maximumValue) {
			inputValue = this.props.maximumValue;
		} else if (isNaN(inputValue)) {
			inputValue = this.props.defaultValue;
		}
		this.updateData(inputValue);

	}, 
	onChange: function(event) {
		this.setState({value: event.target.value})
	},
	updateData: function(newValue) {
		this.setState({value: newValue});
		var dataUpdateObject = {}
		dataUpdateObject[this.props.xstreamKey] = newValue;
		this.props.updateData(dataUpdateObject);
	}, 
	render: function() {
		var descriptionString =  this.props.name + " (" + this.props.minimumValue + " - " + this.props.maximumValue + ")";
		return (
            <div className="optionSelect">
                <label>{descriptionString}:</label>
                <input type="text" className="optionValue" onChange={this.onChange} onBlur={this.onBlur} value={this.state.value}  ></input>
            </div>
		)
	}
});

InputOptions = React.createClass({
	updateData: function(newData) {
		var self = this; 
		self.setState(newData);
		window.setTimeout(function(){
			self.props.updateData({inputOptions: self.state})
		}, UPDATETIMEOUT);
	},
	render: function() {
		var self = this; 
		var inputOptions = baseInputOptions.map(function(opt, index){
			return (
				<InputOption key={index}
							 name={opt.name}
							 minimumValue = {opt.minimum_value} 
							 maximumValue = {opt.maximum_value} 
							 defaultValue = {opt.default_value}
							 xstreamKey   = {opt.xstream_key} 
							 updateData   = {self.updateData} />
			)
		});
		return (
			<div className="dataInput analysisOptions col3">
				<h4>Enter protein repeat (xstream) detection options: </h4>
				{inputOptions}
			</div>
		)
	}
});



/* Component to hold a radio button for output format selection */
OutputFileFormatOption = React.createClass({
	updateData: function(newOption) {
		/* This object is used by the parent to update internal state */
		var newDataObject = { 
			outputFormat: newOption
		};
		this.props.updateData(newDataObject);
	},
	onClick: function(event) {
		this.updateData(event.target.value);
	},
	onChange: function() {
		/* React necessitates this method for radio button. Does nothing. */
	},
	render: function() {
		return (
			<div>
				<input type="radio" value={this.props.value} checked={this.props.checked} onClick={this.onClick} onChange={this.onChange}/>
				<label>{this.props.title}</label>
			</div>
		)
	}
})

/* component for an output field (e.g. C+G value) */
OutputFieldOption = React.createClass({
	componentDidMount : function() {
		this.updateData(this.props.value);
	},
	updateData: function(newOption) {
		/* note: parent uses a set (implemented using a js dictionary) to check whether an option is selected */
		var newDataObject = {};
		newDataObject[newOption] = !this.props.checked;
		this.props.updateData(newDataObject);
	},
	onChange: function() {
		/* React necessitates this method for radio button. Does nothing. */
	},
	onClick: function(event) {
		this.updateData(event.target.value)
	},
	render: function() {
		return (
			<div>
				<input type="checkbox" value={this.props.value} checked={this.props.checked} onClick={this.onClick} onChange={this.onChange}/>
				<label>{this.props.title}</label>
			</div>
		)
	}
});

OutputOptions = React.createClass({
	updateData: function(newData) {
		var self = this; 
		self.setState(newData);
		window.setTimeout(function(){
			self.props.updateData({outputOptions: self.state})
		}, UPDATETIMEOUT);
	},
	getInitialState: function() {
		/* to maintain selected output fields we use a set. */
		stateObject = {}
		baseOutputOptions.outputFields.forEach(function(opt){
			stateObject[opt.encoding] = opt.default;
		});
		stateObject.outputFormat = "csv"; /*default output is csv */
	    return stateObject;
	},
	render: function() {
		var self = this; 
		var outputFormats = baseOutputOptions.outputFormats.map(function(opt, index){
			return (
				<OutputFileFormatOption checked={self.state.outputFormat === opt.encoding}
										value={opt.encoding}
										updateData={self.updateData}
										key={index}
										title={opt.type}/>
			)
		});
		var outputFields = baseOutputOptions.outputFields.map(function(opt, index) {
			return (
				<OutputFieldOption checked={self.state[opt.encoding]} 
								   value={opt.encoding}
								   updateData={self.updateData}
								   key={index}
								   title={opt.type}/>
			)
		});
		return (
			<div className="dataInput dataTypeSelection col3">
				<h4>Select Output Format:</h4>
				{outputFormats}
				<h4>Select Output Fields:</h4>
				{outputFields}
			</div>
		)
	}
})


module.exports.InputOptions  = InputOptions;
module.exports.OutputOptions = OutputOptions;