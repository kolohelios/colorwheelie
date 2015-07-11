//= require_tree .
//= require jquery/dist/jquery.min.js
//= require angular/angular.min.js
//= require angular-foundation/mm-foundation.min.js
//= require angular-foundation/mm-foundation-tpls.min.js
//= require jquery-knob/dist/jquery.knob.min.js
//= require raphael/raphael-min.js
//= require toxiclibsjs/build/toxiclibs.min.js

angular.module('colorwheelie', ['mm.foundation'])
.controller('ColorWheelieCtrl', ['$scope', function($scope){
  $scope.glColor = [221/255,221/255,221/255];
  window.onload = function(){
    var container = document.getElementById("lightbox"),
        columns = 6, rows = 4,
        bounds,
        notepad,
        pos = new toxi.geom.Vec2D(),
        circles;

    bounds = new toxi.geom.Rect({
        x: container.offsetLeft,
        y: container.offsetTop,
        width: window.innerWidth,
        height: 400
    });
    //notepad is the raphael instance
    notepad = Raphael( container, bounds.width, bounds.height );
    //create all of the circles in a grid and set their attributes
    circles = (function createCircles(){
        var loc, circle, r, c, circles = [];
        var cellDim = new toxi.geom.Vec2D( bounds.width, bounds.height );
        cellDim.scaleSelf( 1/(columns-1), 1/(rows-1) );
        for( r=0; r<rows; r++ ){
            for( c=0; c<columns; c++ ){
                loc = cellDim.scale( c, r );
                circle = notepad.circle( loc.x, loc.y, 1, 1 );
                circle.attr({
                    fill: "#dddddd", stroke: "#dddddd",
                    opacity: 0.5,
                    r: 100
                });
                circles.push(circle);
            }
        }
        return circles;
    }());
    // track the mouse position
    document.addEventListener( "mousemove", function(event){
        pos.set( event.pageX, event.pageY );
        // update();
    },false);
    //track the first finger on any touch-device
    document.addEventListener( "touchmove", function(event){
        pos.set( event.touches[0].pageX, event.touches[0].pageY );
        //stop the page from scrolling if the touch was within the bounds
        if( pos.isInRectangle(bounds) ){
            event.preventDefault();
        }
        // update();
    },false);

    function update(){
        var i = 0, l = circles.length;
        for( i=0; i<l; i++ ){
            var circle = circles[i];
            var box = circle.getBBox();
            var color = toxi.color.TColor.newRGB($scope.glColor);
            circle.attr({ fill: color.toRGBACSS() });
        }
      }
  $(function(){
      $('.dial').knob({
        'change': function(){
          var knobs = {};
          $('.dial').each(function(){
            knobs[$(this).data('color')] = $(this).val();
          });
          $scope.glColor = [knobs.red / 255, knobs.green / 255, knobs.blue / 255];
          update();
        }
    });
  });
    };


}])
