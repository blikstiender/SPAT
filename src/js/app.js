var ReactDOM = require("react-dom");
var React    = require("react");

var InputComponent   = require("./inputcomp");
var OptionsComponent = require("./optionscomp");
var ResultsComponent = require("./resultscomp");
var sendData         = require("./senddata");




var OptionsTab = React.createClass({
    render: function() {
        return (
            <div className="inputTypeSelection">
                <div className={"inputTypeTab " + (this.props.fileInput ? "tabSelected" : "")} onClick={function(){this.props.switchInputType("file")}.bind(this)}>
                    File Input
                </div>
                <div className={"inputTypeTab " + (!this.props.fileInput ? "tabSelected" : "")} onClick={function(){this.props.switchInputType("text")}.bind(this)}>
                    Text Input 
                </div>
            </div>
        )
    },

});

var initialToolState = {
    fileInput: true, 
    inputPhase: true, 
    inputOptions: {}, 
    outputOptions: {},
    textData: {}, 
    fileData: {}, 
    resultsAvailable: false, 
    resultId: "", 
    resultFilename: ""
}


var AnalysisTool = React.createClass({
    getInitialState: function() {
        return initialToolState;
    },
    switchInputType: function(type) {
        if (type === "file") {
            this.setState({fileInput: true});
        } else if (type === "text") {
            this.setState({fileInput: false});
        }
    },
    showResults: function(){
        this.setState({inputPhase: false});
    },
    showInput: function() {
        this.setState({inputPhase: true});
    },
    updateData: function(newData) {
        this.setState(newData);
    },
    showInputPhase: function() {
        this.setState(initialToolState);
    },
    render: function() {
        var inputView = (
            <div className="containInput">
                <OptionsTab      fileInput={this.state.fileInput} switchInputType={this.switchInputType}/>
                <InputComponent  fileInput={this.state.fileInput} onClick={this.sendData} updateData={this.updateData}/>
                <OptionsComponent.InputOptions  updateData={this.updateData}/>
                <OptionsComponent.OutputOptions updateData={this.updateData}/>
            </div>
        )
        var resultsView = (
            <div className="containResult">
                <ResultsComponent resultId={this.state.resultId} resultFilename={this.state.resultFilename} showInputPhase={this.showInputPhase}/>
            </div>
        ) 
        if (this.state.inputPhase) {
            return inputView;
        } else {
            return resultsView;
        }
    }, 
    sendData: function() {
        var self = this; 
        self.setState({
            inputPhase: false
        });
        sendData(this.state, function(err, result) {
            self.setState({
                resultsAvailable: true, 
                resultId: result.id,
                resultFilename: result.filename
            });
        });
    }

});

ReactDOM.render(<AnalysisTool />, document.querySelector(".contentWrapper"));

