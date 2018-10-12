(function() {
    function Cube(options) {
        this.x = options.x;
        this.y = options.y;
        this.z = options.z;
        this.rotation = options.rotation;
        this.offset = options.offset || {
            x: 0,
            y: 0,
            z: 0
        };
        this.$parent = options.$parent;
        this.panelTypes = ["top", "bottom", "left", "right", "front", "back"];

        this.render();
        this.refresh();
    }
    Cube.prototype.createStyleObjByProperties = function(width, height, marginLeft, marginTop) {
        return  {
            "width": width,
            "height": height,
            "margin-left": marginLeft,
            "margin-top": marginTop
        };
    }
    Cube.prototype.getPanelStyleObj = function(type) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var offset = this.offset;
        let styleObj = null;
        switch (type) {
            case "top":
                styleObj = this.createStyleObjByProperties(x, z, -x/2, -z/2);
                styleObj["transform"] = styleObj["-webkit-transform"] = styleObj["-moz-transform"] = styleObj["-o-transform"] = 'translateY(-'+(y/2+offset.y)+'px) rotateX(90deg)';
                break;
            case "bottom":
                styleObj = this.createStyleObjByProperties(x, z, -x/2, -z/2);
                styleObj["transform"] = styleObj["-webkit-transform"] = styleObj["-moz-transform"] = styleObj["-o-transform"] = 'translateY('+(y/2+offset.y)+'px) rotateX(90deg)';
                break;
            case "front":
                styleObj = this.createStyleObjByProperties(x, y, -x/2, -y/2);
                styleObj["transform"] = styleObj["-webkit-transform"] = styleObj["-moz-transform"] = styleObj["-o-transform"] = 'translateZ(-'+(z/2+offset.z)+'px)';
                break;
            case "back":
                styleObj = this.createStyleObjByProperties(x, y, -x/2, -y/2);
                styleObj["transform"] = styleObj["-webkit-transform"] = styleObj["-moz-transform"] = styleObj["-o-transform"] = 'translateZ('+(z/2+offset.z)+'px)';
                break;
            case "left":
                styleObj = this.createStyleObjByProperties(z, y, -z/2, -y/2);
                styleObj["transform"] = styleObj["-webkit-transform"] = styleObj["-moz-transform"] = styleObj["-o-transform"] = 'translateX(-'+(x/2+offset.x)+'px) rotateY(90deg)';
                break;
            case "right":
                styleObj = this.createStyleObjByProperties(z, y, -z/2, -y/2);
                styleObj["transform"] = styleObj["-webkit-transform"] = styleObj["-moz-transform"] = styleObj["-o-transform"] = 'translateX('+(x/2+offset.x)+'px) rotateY(90deg)';
                break;
        }

        return styleObj;
    }
    Cube.prototype.render = function() {
        var html = "";
        html += '<div class="cube">';
        this.panelTypes.forEach(function(type, index) {
            html += '   <div class="item '+type+'">'+(index+1)+'</div>';
        });
        html += '</div>';

        this.$el = $(html);
        this.$parent.append(this.$el);
    }
    Cube.prototype.refresh = function() {
        var $el = this.$el;
        var that = this;
        this.panelTypes.forEach(function(type, index) {
            $el.find("."+type).css(that.getPanelStyleObj(type));
        });
        this.rotate();
    }
    Cube.prototype.set = function(options) {
        options.x && (this.x = options.x);
        options.y && (this.y = options.y);
        options.z && (this.z = options.z);
        options.rotation && (this.rotation = options.rotation);
        options.offset && (this.offset = options.offset);

        this.refresh();
    }
    Cube.prototype.rotate = function(rotation) {
        if(typeof rotation !== "undefined") { // array, object
            this.rotation = rotation;
        }

        rotation = this.rotation;
        var styleText = "";
        switch (Object.prototype.toString.apply(rotation)) {
            case "[object Number]":
                styleText = "rotate("+rotation+"deg)";
                break;
            case "[object Object]":
                styleText = "rotateX("+rotation.x+"deg) rotateY("+rotation.y+"deg) rotateZ("+rotation.z+"deg) ";
                break;
        }

        var styleObj = {};
        styleObj["transform"] = styleObj["-webkit-transform"] = styleObj["-moz-transform"] = styleObj["-o-transform"] = styleText;
        styleText && this.$el.css(styleObj);
    }

    window.Cube = Cube;
})();