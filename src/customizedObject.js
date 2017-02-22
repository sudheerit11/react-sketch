const fabric = require('fabric').fabric;

function CustomizedObject(className){

    fabric.CustomObject = fabric.util.createClass(className, {
        initialize: function(element, options) {
            this.callSuper('initialize', element, options);
            if(options){
                for (let key in options) {
                    if (options.hasOwnProperty(key)){
                        this.set(key, options[key]);
                    }
                }
            }
        },
        toObject: function() {
            return fabric.util.object.extend(this.callSuper('toObject'), { name: this.name , dude: this.dude});
        },
        fromObject: function(object, callback) {
            fabric.util.loadFromJSON(object, function() {
                callback && callback(new fabric.CustomObject(object));
            });
        }
    });
    return fabric.CustomObject;
}

export default CustomizedObject;