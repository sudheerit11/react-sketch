/*eslint no-unused-vars: 0*/
'use strict';

import FabricCanvasTool from './fabrictool'
const fabric = require('fabric').fabric;
import {linearDistance} from './utils';
import CustomizedObject from './customizedObject';

fabric.MyCircle = fabric.util.createClass(fabric.Circle, {
// only id and user field is added in custom method
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
    return fabric.util.object.extend(this.callSuper('toObject'), { id: this.id, user: this.user });
  }
});

fabric.MyCircle.fromObject = function(object, callback) {
  fabric.util.loadFromJSON(object, function() {
    callback && callback(new fabric.MyCircle(object));
  });
};

class Circle extends FabricCanvasTool {

    configureCanvas(props) {
        let canvas = this._canvas;
        canvas.isDrawingMode = canvas.selection = false;
        canvas.forEachObject((o) => o.selectable = o.evented = false);
        this._width = props.lineWidth;
        this._color = props.lineColor;
        this._fill = props.fillColor;
        this._user = props.user;
        this._id = props.id;
    }

    doMouseDown(o) {
        let canvas = this._canvas;
        this.isDown = true;
        let pointer = canvas.getPointer(o.e);
        [this.startX, this.startY] = [pointer.x, pointer.y];
        const customizedObject = CustomizedObject(fabric.Circle);
        this.circle = new customizedObject({
            left: this.startX, top: this.startY,
            originX: 'left', originY: 'center',
            strokeWidth: this._width,
            stroke: this._color,
            fill: this._fill,
            selectable: false,
            evented: false,
            radius: 1
        }, {id:this._id, user:this._user});
        canvas.add(this.circle);
    }

    doMouseMove(o) {
        if (!this.isDown) return;
        let canvas = this._canvas;
        let pointer = canvas.getPointer(o.e);
        this.circle.set({
            radius: linearDistance({x: this.startX, y: this.startY}, {x: pointer.x, y: pointer.y}) / 2,
            angle: Math.atan2(pointer.y - this.startY, pointer.x - this.startX) * 180 / Math.PI
        });
        this.circle.setCoords();
        canvas.renderAll();
    }

    doMouseUp(o) {
        this.isDown = false;
    }
}

export default Circle;