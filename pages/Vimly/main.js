// Main

window.handlebars = require('handlebars');

window.qi = require('../../js/bam/data/qi.js');
window.sdo = require('../../js/bam/data/sdo.js');
window.dao = require('../../js/bam/data/dao.js');
window.bam = require('../../js/bam/bam.js')({});
window.obj = require('../../js/bam/data/objToArray');

window.vimly = require('./vimly.js');
window.environments = require('./environments.js');

require('./PlanDocuments/PlanDocuments.js');
