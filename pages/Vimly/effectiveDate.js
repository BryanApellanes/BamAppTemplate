var effectiveDate = (function(){
    var _ = require('lodash'),
        proto = {
            getMonth: function(){
                return this.month < 10 ? `0${this.month}`: this.month.toString();
            },
            getDate: function(){
                return this.date < 10 ? `0${this.date}`: this.date.toString();
            },
            getYear: function(){
                return this.year;
            },
            toParameter: function(){
                return `${this.getYear()}-${this.getMonth()}-${this.getDate()}`;
            },
            value: function(){
                return this.toParameter();
            }
        };

    return {
        from: function(obj){
            if(_.isString(obj)){
                var parts = obj.split("-");
                if(parts.length !== 3){
                    throw new Error(`unrecognized date format, please specify the effectiveDate in the form YYYY-MM-DD: ${obj}`);
                }
                obj = {
                    year: parseInt(parts[0]),
                    month: parseInt(parts[1]),
                    date: parseInt(parts[2])
                }
            }
            return _.extend({}, proto, obj);
        }
    }
})()

module.exports = effectiveDate;

if(typeof window !== 'undefined'){
    window.effectiveDate = effectiveDate;
}