/* a config file for the default options a user can select */

module.exports = {
	baseInputOptions : [ 
		{
			name: "minimum word match", 
			default_value: 0.7,
			minimum_value: 0.0, 
			maximum_value: 1.0,
			xstream_key: "-i"
		},
		{
			name: "minimum consensus match", 
			default_value: 0.8,
			minimum_value: 0.0, 
			maximum_value: 1.0,
			xstream_key: "-I"
		},
		{
			name: "minimum copy number", 
			default_value: 2,
			minimum_value: 1, 
			maximum_value: 20,
			xstream_key: "-e"
		},
		{
			name: "maximum gaps", 
			default_value: 3,
			minimum_value: 0, 
			maximum_value: 20,
			xstream_key: "-g"
		},
		{
			name: "minimum period", 
			default_value: 3,
			minimum_value: 1, 
			maximum_value: 100,
			xstream_key: "-m"
		},
		{
			name: "minimum tandem repeat domain length", 
			default_value: 10,
			minimum_value: 1, 
			maximum_value: 100,
			xstream_key: "-L"
		},
		{
			name: "inder error", 
			default_value: .5,
			minimum_value: 0, 
			maximum_value: 1.0,
			xstream_key: "-D"
		}
	],


	baseOutputOptions : {
		outputFormats: [
			{
				type: "CSV (Comma Seperated Values)", 
				encoding: "csv"
			}
		], 
		outputFields: [
			{
				type: "C count",
				encoding: "C",
				default: false
			}, 
			{
				type: "G count",
				encoding: "G",
				default: false
			}, 
			{
				type: "A count",
				encoding: "A",
				default: false
			}, 
			{
				type: "T count",
				encoding: "T",
				default: false
			}, 
			{
				type: "G + C value",
				encoding: "G+C",
				default: true
			}, 
			{
				type: "G - C value",
				encoding: "G-C",
				default: true
			}, 
			{
				type: "A + T value",
				encoding: "A+T", 
				default: true
			}, 
			{
				type: "A - T value",
				encoding: "A-T",
				default: true
			}, 
			{
				type: "A + T / Length value",
				encoding: "A+T/L",
				default: true
			}, 
			{
				type: "A - T / Length value",
				encoding: "A-T/L",
				default: true
			}, 
			{
				type: "G - C / Length value",
				encoding: "G-C/L",
				default: true
			}, 
			{
				type: "G + C / Length value",
				encoding: "G+C/L",
				default: true
			}, 
		]
	}
};