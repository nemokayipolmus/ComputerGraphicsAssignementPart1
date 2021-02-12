"use strict";

var canvas;
var gl;

var bufferTri, bufferRect, bufferRect2, bufferRect3, triVertices, rectVertices, rectVertices2, rectVertices3;
var vPosition,color;
var transformationMatrix, transformationMatrixLoc;
var translate_X = 0;
var translate_Y = 0;
var scaling = 1;
var rotating = 0;
var speed = 1;
var red = 0;
var green = 0;
var blue = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Make the letters
    triVertices = [
        vec2(  -0.1,  -0.2 ), 
        vec2(  0.1,  -0.2 ),
        vec2(  0, 0.2 )
    ];

    rectVertices = [
        vec2(  -0.1,  -0.2 ),
        vec2(  0.1,  -0.2 ),
        vec2(  -0.1,  0.2 ),
        vec2(  0.1,  0.2 )
    ];
	
    rectVertices2 = [
        vec2(  -0.1,  -0.2 ),
        vec2(  0.1,  -0.2 ),
        vec2(  -0.1,  0.2 ),
        vec2(  0.1,  0.2 )
    ];
	
    rectVertices3 = [
        vec2(  -0.1,  -0.2 ),
        vec2(  0.1,  -0.2 ),
        vec2(  -0.1,  0.2 ),
        vec2(  0.1,  0.2 )
    ];

    // Load the data into the GPU
    bufferTri = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferTri );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(triVertices), gl.STATIC_DRAW );

    // Load the data into the GPU
    bufferRect = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices), gl.STATIC_DRAW );

	bufferRect2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices2), gl.STATIC_DRAW );
	
	bufferRect3 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect3 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices3), gl.STATIC_DRAW );
	
    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" );
	
	color = gl.getUniformLocation(program, "color");

    document.getElementById("inp_objX").oninput = function(event) {
        translate_X = document.getElementById("inp_objX").value;
    };
    document.getElementById("inp_objY").oninput = function(event) {
        translate_Y = document.getElementById("inp_objY").value;
    };
    document.getElementById("inp_obj_scale").oninput = function(event) {
		scaling = document.getElementById("inp_obj_scale").value;
    };
    document.getElementById("inp_obj_rotation").oninput = function(event) {
		rotating = document.getElementById("inp_obj_rotation").value;
    };
    document.getElementById("inp_wing_speed").oninput = function(event) {
        speed = document.getElementById("inp_wing_speed").value;
    };
    document.getElementById("redSlider").oninput = function(event) {
        red = document.getElementById("redSlider").value;
    };
    document.getElementById("greenSlider").oninput = function(event) {
        green = document.getElementById("greenSlider").value;
    };
    document.getElementById("blueSlider").oninput = function(event) {
        blue = document.getElementById("blueSlider").value;
    };

    render();

};

var ramount = 0;
var amount = 0.5;
var speedAmount = 0;

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    transformationMatrix = mat4();
	
	transformationMatrix = mult(transformationMatrix, translate(translate_X, translate_Y, 0));
	transformationMatrix = mult(transformationMatrix, scalem(scaling, scaling, 1));
	transformationMatrix = mult(transformationMatrix, rotateZ(rotating));
	
	transformationMatrix = mult(transformationMatrix, scalem(2,2,0));
	
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
	gl.uniform4fv( color, flatten([red,green,blue,1]));
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferTri );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 3 );
	
	if(speed != 0){
	speedAmount = amount * speed;
	}
	
	ramount = ramount + speedAmount;
	
	
	transformationMatrix = mult(transformationMatrix, scalem(0.5,0.6,0));
	transformationMatrix = mult(transformationMatrix, translate(0,0.2,0));

	transformationMatrix = mult(transformationMatrix, translate(0,0.05,0));
	transformationMatrix = mult(transformationMatrix, rotateZ(ramount));
	transformationMatrix = mult(transformationMatrix, translate(0,-0.05,0));
	
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
	gl.uniform4fv( color, flatten([1,0,0,1]));
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	

	transformationMatrix = mult(transformationMatrix, translate(0,0.1,0));
	transformationMatrix = mult(transformationMatrix, rotateZ(120));
	transformationMatrix = mult(transformationMatrix, translate(0,-0.1,0));
	
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
	gl.uniform4fv( color, flatten([0,0,1,1]));
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect2 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	

	transformationMatrix = mult(transformationMatrix, translate(0,0.1,0));
	transformationMatrix = mult(transformationMatrix, rotateZ(120));
	transformationMatrix = mult(transformationMatrix, translate(0,-0.1,0));
	
	gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
	gl.uniform4fv( color, flatten([0,1,0,1]));
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect3 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    window.requestAnimFrame(render);
}
