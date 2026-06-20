"use client";
import React, { useEffect, useRef } from 'react';

export default function GradientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cleanup: Array<() => void> = [];

    (function() {
      var canvas = container.querySelector('.exp-mesh') as HTMLCanvasElement;
      if (!canvas) return;
      var gl = canvas.getContext('webgl');
      if (!gl) return;
      var VS = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;
      var FS = `
        precision highp float; uniform vec2 iResolution; uniform float iTime; uniform int uMovementMode; uniform float uScale; uniform float uMorphSpeed; uniform float uTwist; uniform float uDriftSpeed; uniform sampler2D uColorRamp;
        const int iterationTime1 = 20; const int iterationTime2 = 20;
        float f(in vec2 p) { return sin(p.x+sin(p.y+iTime*0.1))*sin(p.y*p.x*0.1+iTime*uMorphSpeed); }
        struct Field { vec2 vel; vec2 pos; };
        Field field(in vec2 p, in int mode) {
          Field fld; vec2 ep=vec2(0.05,0.); vec2 rz=vec2(0);
          if(mode==0) { for(int i=0;i<iterationTime1;i++) { float t0=f(p); float t1=f(p+ep.xy); float t2=f(p+ep.yx); vec2 g=vec2((t1-t0),(t2-t0))/ep.xx; vec2 t=vec2(-g.y,g.x); p+=(uTwist*0.01)*t+g*(1./200.); p.x=p.x+sin(iTime*uDriftSpeed/10.)/10.; p.y=p.y+cos(iTime*uDriftSpeed/10.)/10.; rz=g; } fld.vel=rz; return fld; }
          if(mode==1||mode==2) { for(int i=0;i<iterationTime1;i++) { float t0=f(p); float t1=f(p+ep.xy); float t2=f(p+ep.yx); vec2 g=vec2((t1-t0),(t2-t0))/ep.xx; vec2 t=vec2(-g.y,g.x); p+=(uTwist*0.01)*t+g*(1./200.); p.x=p.x+sin(iTime*uDriftSpeed/10.)/10.; p.y=p.y+cos(iTime*uDriftSpeed/10.)/10.; rz=g; } fld.vel=rz; if(mode==2) { for(int i=1;i<iterationTime2;i++) { p.x+=0.3/float(i)*sin(float(i)*3.*p.y+iTime*uDriftSpeed)+0.5; p.y+=0.3/float(i)*cos(float(i)*3.*p.x+iTime*uDriftSpeed)+0.5; } } fld.pos=p; return fld; }
          return fld;
        }
        vec3 getBaseColor(in Field fld, in int mode) { if(mode==0) { vec2 p=fld.vel; return vec3(p*0.5+0.5,1.5); } vec2 p=fld.pos; float r=cos(p.x+p.y+1.)*.5+.5; float g=sin(p.x+p.y+1.)*.5+.5; float b=(sin(p.x+p.y)+cos(p.x+p.y))*.3+.5; return vec3(r,g,b); }
        void main() { vec2 p=(gl_FragCoord.xy/iResolution.xy)-0.5; p.x*=iResolution.x/iResolution.y; p*=uScale; Field fld=field(p,uMovementMode); vec3 col=getBaseColor(fld,uMovementMode); float lum=dot(col,vec3(0.299,0.587,0.114)); vec4 finalCol=texture2D(uColorRamp,vec2(lum,0.5)); gl_FragColor=vec4(finalCol.rgb*finalCol.a, finalCol.a); }
      `;
      function mkShader(t: number, s: string) { var sh = gl!.createShader(t); if (!sh) return null; gl!.shaderSource(sh, s); gl!.compileShader(sh); return sh; }
      var prog=gl.createProgram(); if (!prog) return; gl.attachShader(prog,mkShader(gl.VERTEX_SHADER,VS)!); gl.attachShader(prog,mkShader(gl.FRAGMENT_SHADER,FS)!); gl.linkProgram(prog);
      var buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
      var posLoc=gl.getAttribLocation(prog,'aPosition'); gl.enableVertexAttribArray(posLoc); gl.vertexAttribPointer(posLoc,2,gl.FLOAT,false,0,0);
      var tex=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,tex); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      var colors=[{"id":"d2995127-571e-4806-bdd7-1210b7602580","color":"#ffffff","alpha":0.8},{"id":"7343214b-e97e-4ceb-a834-e91c089de94a","color":"#4200bd","alpha":1}]; var rc=document.createElement('canvas'); rc.width=256; rc.height=1; var rctx=rc.getContext('2d'); if (!rctx) return; var grd=rctx.createLinearGradient(0,0,256,0);
      colors.forEach(function(item: any, i: number){ var offset=colors.length===1?0:i/(colors.length-1); var hex=item.color; var r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); grd.addColorStop(offset,'rgba('+r+','+g+','+b+','+item.alpha+')'); });
      rctx.fillStyle=grd; rctx.fillRect(0,0,256,1); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,rc);
      function resize(){if (!canvas) return; canvas.width=canvas.parentElement!.clientWidth;canvas.height=canvas.parentElement!.clientHeight;gl!.viewport(0,0,canvas.width,canvas.height);}
      resize(); window.addEventListener('resize',resize);
      cleanup.push(function() { window.removeEventListener('resize',resize); });
      var startTime=Date.now(); var reqId: number;
      var params={movementMode:0,scale:4.7,morphSpeed:0.49,twist:39,driftSpeed:2.5};
      function render(){
        if (!gl) return;
        gl.useProgram(prog); var t=(Date.now()-startTime)/1000.0;
        gl.uniform1f(gl.getUniformLocation(prog!,'iTime'),t); gl.uniform2f(gl.getUniformLocation(prog!,'iResolution'),canvas.width,canvas.height);
        gl.uniform1i(gl.getUniformLocation(prog!,'uMovementMode'),params.movementMode); gl.uniform1f(gl.getUniformLocation(prog!,'uScale'),params.scale);
        gl.uniform1f(gl.getUniformLocation(prog!,'uMorphSpeed'),params.morphSpeed); gl.uniform1f(gl.getUniformLocation(prog!,'uTwist'),params.twist); gl.uniform1f(gl.getUniformLocation(prog!,'uDriftSpeed'),params.driftSpeed);
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
        reqId = requestAnimationFrame(render);
      }
      reqId = requestAnimationFrame(render);
      cleanup.push(function() { cancelAnimationFrame(reqId); });
    })();

    return () => {
      cleanup.forEach(fn => fn());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{ background: '#000000', zIndex: -1 }}
    >
      {/* SVG Definitions for custom paths */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
        </defs>
      </svg>
      <canvas className="exp-mesh absolute inset-0 w-full h-full" style={{ zIndex: 0 }}></canvas>
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 9999, opacity: 0.33, backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgODAwIj48ZmlsdGVyIGlkPSJncmFpbi1mIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC41IiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2dyYWluLWYpIi8+PC9zdmc+")', backgroundSize: '800px' }}></div>
    </div>
  );
}
