const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		"main": path.resolve(__dirname, './main.js'),
		"tests": path.resolve(__dirname, './tests.js'),
		"PlanDocuments": path.resolve(__dirname, './PlanDocuments/PlanDocuments.js')
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, '../dist/Admin')
	}
};
