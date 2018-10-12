var cubeRotateMouseDownPos = null;
var cubePanelOffsetMouseDownPos = null;
var cubePanelOffsetType = null;
var cubeRotation = {
    x: 0,
    y: 0,
    z: 0
};
var $view = $("#view");
var cube = null;
var $sizeText = {
    x: $("#xSizeText"),
    y: $("#ySizeText"),
    z: $("#zSizeText")
};
var $offsetSizeText = $("#offsetSizeText");
var isMobile = (function() {
        var mobileArry = ["iPhone", "iPad", "Android", "Windows Phone", "BB10; Touch", "BB10; Touch", "PlayBook", "Nokia"];
        var ua = navigator.userAgent;
        var res=mobileArry.filter(function(arr) {
            return ua.indexOf(arr) > 0;
        });
        return res.length > 0;
    }
)();
// common
function getOperateType() {
    return $("input[type='radio'][name='operate']:checked").val();
}
function getColor() {
    return $("input[type='radio'][name='color']:checked").val();
}
function getEventPos(e) {
    if(isMobile) {
        var touch = e.changedTouches[0];
        return {
            x: touch.clientX,
            y: touch.clientY
        }
    } else {
        return {
            x: e.clientX,
            y: e.clientY
        };
    }
}
function getEventType(pcType) {
    switch(pcType) {
        case "mousemove":
            return isMobile ? "touchmove" : pcType;
            break;
        case "mousedown":
            return isMobile ? "touchstart" : pcType;
            break;
        case "mouseup":
            return isMobile ? "touchend" : pcType;
            break;
    }
}

$view.on("click", ".item", function() {
    var color = getColor();
    this.style.backgroundColor = color;
}).on(getEventType("mousedown"), ".item", function(e) {
    e.stopPropagation();
    cubePanelOffsetMouseDownPos = getEventPos(e.originalEvent);
    var className = this.className;
    if(className.indexOf("top") > -1 || className.indexOf("bottom") > -1) {
        cubePanelOffsetType = "y";
    } else if(className.indexOf("left") > -1 || className.indexOf("right") > -1) {
        cubePanelOffsetType = "x";
    } else {
        cubePanelOffsetType = "z";
    }
});
$("#toggleBtn").click(function() {
    console.log(this.checked);
});
$("input[type='range']").on(getEventType("mousedown"), function(e) {
    e.stopPropagation();
})
$(".sizeRange").on("input", function() {
    var type = this.getAttribute("data-type");
    var value = this.value;
    $sizeText[type].text(value);
    cube.set({
        [type]: value,
        rotation: cubeRotation.x = cubeRotation.y = 0
    });
});
$("#offsetRange").on("input", function() {
    let value = +this.value;
    cube.set({
        offset: {
            x: value,
            y: value,
            z: value
        }
    });
    $offsetSizeText.text(value);
});
// 监听整个场景的鼠标按下事件
document.addEventListener(getEventType("mousedown"), function(e) {
    cubeRotateMouseDownPos = getEventPos(e);
}, false);
// 监听整个场景的鼠标移动事件
document.addEventListener(getEventType("mousemove"), function(e) {
    if(!cubeRotateMouseDownPos && !cubePanelOffsetMouseDownPos) {
        return;
    }

    var pos = getEventPos(e);
    var x =pos.x;
    var y = pos.y;
    if(cubeRotateMouseDownPos) { // 如果是旋转立体方
        var sx = x - cubeRotateMouseDownPos.x;
        var sy = y - cubeRotateMouseDownPos.y;
        var rotationX = sy / 5;
        var rotationY = sx / 5;
        cubeRotation.x += rotationX;
        cubeRotation.y += rotationY;
        cube.rotate(cubeRotation);

        cubeRotateMouseDownPos = pos;
    } else if(cubePanelOffsetMouseDownPos) { // 如果是炸一下
        console.log(cubePanelOffsetMouseDownPos);
        var sx = x - cubePanelOffsetMouseDownPos.x;
        var offsetValue = sx;
        cube.offset[cubePanelOffsetType] += offsetValue;
        if(cube.offset[cubePanelOffsetType] < 0) {
            cube.offset[cubePanelOffsetType] = 0;
        }
        cube.set({});

        cubePanelOffsetMouseDownPos = getEventPos(e);
        $offsetSizeText.text("inherite");
    }
}, false);
// 鼠标抬起，清空数据
document.addEventListener(getEventType("mouseup"), function() {
    cubeRotateMouseDownPos = cubePanelOffsetMouseDownPos = null;
}, false);

// 初始化
cube = new Cube({
    $parent: $view,
    x: 200,
    y: 200,
    z: 200
});