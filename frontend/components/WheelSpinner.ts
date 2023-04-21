/* eslint-disable react-hooks/exhaustive-deps */
'use client';
function _interopDefault (ex: any) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
import {useState, useEffect} from 'react';

export default function WheelSpinner(
    {
        segments,
        segColors,
        winningSegment,
        onFinished,
        primaryColor,
        contrastColor,
        buttonText,
        isOnlyOnce,
        size,
        upDuration,
        downDuration,
        fontFamily,
        width,
        height,
    }:{
        segments: string[],
        segColors: string[],
        winningSegment: string,
        onFinished: (winner: string) => void,
        primaryColor: string,
        contrastColor: string,
        buttonText: string,
        isOnlyOnce: boolean,
        size: number,
        upDuration: number,
        downDuration: number,
        fontFamily: string,
        width: number,
        height: number,
}) {
    var currentSegment = '';
    var isStarted = false;

    const [isFinished, setIsFinished] = useState<boolean>(false);

    var timerHandle: number | NodeJS.Timer = 0;
    var timerDelay = segments.length;
    var angleCurrent = 0;
    var angleDelta = 0;
    var canvasContext: CanvasRenderingContext2D | null = null;
    var maxSpeed = Math.PI / segments.length;
    var upTime = segments.length * upDuration;
    var downTime = segments.length * downDuration;
    var spinStart = 0;
    var frames = 0;
    var centerX = 300;
    var centerY = 300;

    useEffect(() => {
        wheelInit();
        //Optional for positioning
        // setTimeout( () => {
        //     window.scrollTo(0,1);
        // }, 0);

        
    }, [wheelInit]);

    function wheelInit() {
        initCanvas();
        wheelDraw();
    }

    function initCanvas() {
        var canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        console.log(navigator);

        //Checks for MS internet explorer
        if(navigator.userAgent.indexOf('MSIE') !== -1){
            canvas = document.createElement('canvas');
            canvas.setAttribute('width', width.toString());
            canvas.setAttribute('height', height.toString());
            canvas.setAttribute('id', 'canvas');
            document.getElementById('wheel')?.appendChild(canvas);
        }

        canvas?.addEventListener('click', spin, false);
        canvasContext = canvas.getContext('2d');
    };

    function spin() {
        isStarted = true;

        if(timerHandle === 0){
            spinStart = new Date().getTime();
            maxSpeed = Math.PI / segments.length;
            frames = 0;
            timerHandle = setInterval(onTimerTick, timerDelay);
        }
    };

    function onTimerTick() {
        frames++;
        draw();
        var duration = new Date().getTime() - spinStart;
        var progress = 0;
        var finished = false;

        if(duration < upTime){
            progress = duration / upTime;
            angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2);
        }else {
            if(winningSegment){
                if(currentSegment === winningSegment && frames > segments.length){
                    progress = duration / upTime;
                    angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2 + Math.PI / 2);
                    progress = 1;
                } else {
                    progress = duration / downTime;
                    angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2 + Math.PI / 2);
                }
            } else {
                progress = duration / downTime;
                angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2 + Math.PI / 2);
            }

            if (progress >= 1) finished = true;

            angleCurrent += angleDelta;

            while (angleCurrent >= Math.PI * 2) {
            angleCurrent -= Math.PI * 2;
            }

            if (finished) {
            setIsFinished(true);
            onFinished(currentSegment);
            clearInterval(timerHandle);
            timerHandle = 0;
            angleDelta = 0;
            }
        }
    };

    var wheelDraw = function wheelDraw() {
        clear();
        drawWheel();
        drawNeedle();
    };

    var draw = function draw() {
        clear();
        drawWheel();
        drawNeedle();
    };

    var drawSegment = function drawSegment(key: number, lastAngle: number, angle: number) {
        var ctx = canvasContext;
        var value = segments[key];
        if(ctx){
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, size, lastAngle, angle, false);
            ctx.lineTo(centerX, centerY);
            ctx.closePath();
            ctx.fillStyle = segColors[key];
            ctx.fill();
            ctx.stroke();
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((lastAngle + angle) / 2);
            ctx.fillStyle = contrastColor;
            ctx.font = 'bold 1em ' + fontFamily;
            ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
            ctx.restore();
        }
      };
    
      var drawWheel = function drawWheel() {
        var ctx = canvasContext;
        var lastAngle = angleCurrent;
        var len = segments.length;
        var PI2 = Math.PI * 2;
        if(ctx){
            ctx.lineWidth = 1;
            ctx.strokeStyle = primaryColor;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.font = '1em ' + fontFamily;
        }
        for (var i = 1; i <= len; i++) {
          var angle = PI2 * (i / len) + angleCurrent;
          drawSegment(i - 1, lastAngle, angle);
          lastAngle = angle;
        }
        if(ctx){
            ctx.beginPath();
            ctx.arc(centerX, centerY, 50, 0, PI2, false);
            ctx.closePath();
            ctx.fillStyle = primaryColor;
            ctx.lineWidth = 10;
            ctx.strokeStyle = contrastColor;
            ctx.fill();
            ctx.font = 'bold 1em ' + fontFamily;
            ctx.fillStyle = contrastColor;
            ctx.textAlign = 'center';
            ctx.fillText(buttonText, centerX, centerY + 3);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(centerX, centerY, size, 0, PI2, false);
            ctx.closePath();
            ctx.lineWidth = 10;
            ctx.strokeStyle = primaryColor;
            ctx.stroke();
        }
      };
    
      var drawNeedle = function drawNeedle() {
        var ctx = canvasContext;
        if(ctx) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = contrastColor;
            ctx.fillStyle = contrastColor;
            ctx.beginPath();
            ctx.moveTo(centerX + 20, centerY - 50);
            ctx.lineTo(centerX - 20, centerY - 50);
            ctx.lineTo(centerX, centerY - 70);
            ctx.closePath();
            ctx.fill();
            var change = angleCurrent + Math.PI / 2;
            var i = segments.length - Math.floor(change / (Math.PI * 2) * segments.length) - 1;
            if (i < 0) i = i + segments.length;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = primaryColor;
            ctx.font = 'bold 1.5em ' + fontFamily;
            currentSegment = segments[i];
            isStarted && ctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
        }
      };
    
      var clear = function clear() {
        var ctx = canvasContext;
        if(ctx) ctx.clearRect(0, 0, 1000, 800);
      };

      return /*#__PURE__*/React__default.createElement("div", {
        id: "wheel"
      }, /*#__PURE__*/React__default.createElement("canvas", {
        id: "canvas",
        width: width,
        height: height,
        style: {
          pointerEvents: isFinished && isOnlyOnce ? 'none' : 'auto'
        }
      }));
}