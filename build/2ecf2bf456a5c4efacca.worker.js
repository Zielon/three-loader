!function(t){var e={};function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";var n=r(1);onmessage=n.handleMessage},function(t,e,r){"use strict";var n;r.r(e),function(t){t[t.POSITION_CARTESIAN=0]="POSITION_CARTESIAN",t[t.COLOR_PACKED=1]="COLOR_PACKED",t[t.COLOR_FLOATS_1=2]="COLOR_FLOATS_1",t[t.COLOR_FLOATS_255=3]="COLOR_FLOATS_255",t[t.NORMAL_FLOATS=4]="NORMAL_FLOATS",t[t.FILLER=5]="FILLER",t[t.INTENSITY=6]="INTENSITY",t[t.CLASSIFICATION=7]="CLASSIFICATION",t[t.NORMAL_SPHEREMAPPED=8]="NORMAL_SPHEREMAPPED",t[t.NORMAL_OCT16=9]="NORMAL_OCT16",t[t.NORMAL=10]="NORMAL"}(n||(n={}));var i={ordinal:1,size:4},a={ordinal:2,size:1},o={ordinal:3,size:1},u={ordinal:5,size:2};function s(t,e,r){return{name:t,type:e,numElements:r,byteSize:r*e.size}}var f=s(n.COLOR_PACKED,a,4),A={POSITION_CARTESIAN:s(n.POSITION_CARTESIAN,i,3),RGBA_PACKED:f,COLOR_PACKED:f,RGB_PACKED:s(n.COLOR_PACKED,a,3),NORMAL_FLOATS:s(n.NORMAL_FLOATS,i,3),FILLER_1B:s(n.FILLER,o,1),INTENSITY:s(n.INTENSITY,u,1),CLASSIFICATION:s(n.CLASSIFICATION,o,1),NORMAL_SPHEREMAPPED:s(n.NORMAL_SPHEREMAPPED,o,2),NORMAL_OCT16:s(n.NORMAL_OCT16,o,2),NORMAL:s(n.NORMAL,i,3)};!function(){function t(t){void 0===t&&(t=[]),this.attributes=[],this.byteSize=0,this.size=0;for(var e=0;e<t.length;e++){var r=t[e],n=A[r];this.attributes.push(n),this.byteSize+=n.byteSize,this.size++}}t.prototype.add=function(t){this.attributes.push(t),this.byteSize+=t.byteSize,this.size++},t.prototype.hasColors=function(){return void 0!==this.attributes.find(O)},t.prototype.hasNormals=function(){return void 0!==this.attributes.find(b)}}();function O(t){return t.name===n.COLOR_PACKED}function b(t){var e=t.name;return e===n.NORMAL_SPHEREMAPPED||e===n.NORMAL_FLOATS||e===n.NORMAL||e===n.NORMAL_OCT16}var c=function(){function t(t){this.versionMinor=0,this.version=t;var e=-1===t.indexOf(".")?t.length:t.indexOf(".");this.versionMajor=parseInt(t.substr(0,e),10),this.versionMinor=parseInt(t.substr(e+1),10),isNaN(this.versionMinor)&&(this.versionMinor=0)}return t.prototype.newerThan=function(e){var r=new t(e);return this.versionMajor>r.versionMajor||this.versionMajor===r.versionMajor&&this.versionMinor>r.versionMinor},t.prototype.equalOrHigher=function(e){var r=new t(e);return this.versionMajor>r.versionMajor||this.versionMajor===r.versionMajor&&this.versionMinor>=r.versionMinor},t.prototype.upTo=function(t){return!this.newerThan(t)},t}(),h=function(){function t(t){this.tmp=new ArrayBuffer(4),this.tmpf=new Float32Array(this.tmp),this.tmpu8=new Uint8Array(this.tmp),this.u8=new Uint8Array(t)}return t.prototype.getUint32=function(t){return this.u8[t+3]<<24|this.u8[t+2]<<16|this.u8[t+1]<<8|this.u8[t]},t.prototype.getUint16=function(t){return this.u8[t+1]<<8|this.u8[t]},t.prototype.getFloat32=function(t){var e=this.tmpu8,r=this.u8,n=this.tmpf;return e[0]=r[t+0],e[1]=r[t+1],e[2]=r[t+2],e[3]=r[t+3],n[0]},t.prototype.getUint8=function(t){return this.u8[t]},t}();r.d(e,"handleMessage",function(){return M});var I=Math.sign||function(t){return 0==(t=+t)||t!=t?t:t<0?-1:1};function M(t){for(var e=t.data.buffer,r=t.data.pointAttributes,i={attributeBuffers:{},currentOffset:0,data:new h(e),mean:[0,0,0],nodeOffset:t.data.offset,numPoints:t.data.buffer.byteLength/r.byteSize,pointAttributes:r,scale:t.data.scale,tightBoxMax:[Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY],tightBoxMin:[Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY],transferables:[],version:new c(t.data.version)},a=0,o=i.pointAttributes.attributes;a<o.length;a++){var u=o[a];S(u,i),i.currentOffset+=u.byteSize}for(var s=new ArrayBuffer(4*i.numPoints),f=new Uint32Array(s),O=0;O<i.numPoints;O++)f[O]=O;i.attributeBuffers[n.CLASSIFICATION]||function(t){for(var e=new ArrayBuffer(4*t.numPoints),r=new Float32Array(e),i=0;i<t.numPoints;i++)r[i]=0;t.attributeBuffers[n.CLASSIFICATION]={buffer:e,attribute:A.CLASSIFICATION}}(i);var b={buffer:e,mean:i.mean,attributeBuffers:i.attributeBuffers,tightBoundingBox:{min:i.tightBoxMin,max:i.tightBoxMax},indices:s};postMessage(b,i.transferables)}function S(t,e){var r=function(t,e){switch(t.name){case n.POSITION_CARTESIAN:return function(t,e){for(var r=new ArrayBuffer(4*e.numPoints*3),n=new Float32Array(r),i=0;i<e.numPoints;i++){var a=void 0,o=void 0,u=void 0;e.version.newerThan("1.3")?(a=e.data.getUint32(e.currentOffset+i*e.pointAttributes.byteSize+0)*e.scale,o=e.data.getUint32(e.currentOffset+i*e.pointAttributes.byteSize+4)*e.scale,u=e.data.getUint32(e.currentOffset+i*e.pointAttributes.byteSize+8)*e.scale):(a=e.data.getFloat32(i*e.pointAttributes.byteSize+0)+e.nodeOffset[0],o=e.data.getFloat32(i*e.pointAttributes.byteSize+4)+e.nodeOffset[1],u=e.data.getFloat32(i*e.pointAttributes.byteSize+8)+e.nodeOffset[2]),n[3*i+0]=a,n[3*i+1]=o,n[3*i+2]=u,e.mean[0]+=a/e.numPoints,e.mean[1]+=o/e.numPoints,e.mean[2]+=u/e.numPoints,e.tightBoxMin[0]=Math.min(e.tightBoxMin[0],a),e.tightBoxMin[1]=Math.min(e.tightBoxMin[1],o),e.tightBoxMin[2]=Math.min(e.tightBoxMin[2],u),e.tightBoxMax[0]=Math.max(e.tightBoxMax[0],a),e.tightBoxMax[1]=Math.max(e.tightBoxMax[1],o),e.tightBoxMax[2]=Math.max(e.tightBoxMax[2],u)}return{buffer:r,attribute:t}}(t,e);case n.COLOR_PACKED:return function(t,e){for(var r=new ArrayBuffer(3*e.numPoints),n=new Uint8Array(r),i=0;i<e.numPoints;i++)n[3*i+0]=e.data.getUint8(e.currentOffset+i*e.pointAttributes.byteSize+0),n[3*i+1]=e.data.getUint8(e.currentOffset+i*e.pointAttributes.byteSize+1),n[3*i+2]=e.data.getUint8(e.currentOffset+i*e.pointAttributes.byteSize+2);return{buffer:r,attribute:t}}(t,e);case n.INTENSITY:return function(t,e){for(var r=new ArrayBuffer(4*e.numPoints),n=new Float32Array(r),i=0;i<e.numPoints;i++)n[i]=e.data.getUint16(e.currentOffset+i*e.pointAttributes.byteSize);return{buffer:r,attribute:t}}(t,e);case n.CLASSIFICATION:return function(t,e){for(var r=new ArrayBuffer(e.numPoints),n=new Uint8Array(r),i=0;i<e.numPoints;i++)n[i]=e.data.getUint8(e.currentOffset+i*e.pointAttributes.byteSize);return{buffer:r,attribute:t}}(t,e);case n.NORMAL_SPHEREMAPPED:return function(t,e){for(var r=new ArrayBuffer(4*e.numPoints*3),n=new Float32Array(r),i=0;i<e.numPoints;i++){var a=e.data.getUint8(e.currentOffset+i*e.pointAttributes.byteSize+0),o=e.data.getUint8(e.currentOffset+i*e.pointAttributes.byteSize+1),u=a/255,s=o/255,f=2*u-1,A=2*s-1,O=1,b=f*-f+A*-A+1*O;O=b,f*=Math.sqrt(b),A*=Math.sqrt(b),f*=2,A*=2,O=2*O-1,n[3*i+0]=f,n[3*i+1]=A,n[3*i+2]=O}return{buffer:r,attribute:t}}(t,e);case n.NORMAL_OCT16:return function(t,e){for(var r=new ArrayBuffer(4*e.numPoints*3),n=new Float32Array(r),i=0;i<e.numPoints;i++){var a=e.data.getUint8(e.currentOffset+i*e.pointAttributes.byteSize+0),o=e.data.getUint8(e.currentOffset+i*e.pointAttributes.byteSize+1),u=a/255*2-1,s=o/255*2-1,f=1-Math.abs(u)-Math.abs(s),A=0,O=0;f>=0?(A=u,O=s):(A=-(s/I(s)-1)/I(u),O=-(u/I(u)-1)/I(s));var b=Math.sqrt(A*A+O*O+f*f);A/=b,O/=b,f/=b,n[3*i+0]=A,n[3*i+1]=O,n[3*i+2]=f}return{buffer:r,attribute:t}}(t,e);case n.NORMAL:return function(t,e){for(var r=new ArrayBuffer(4*e.numPoints*3),n=new Float32Array(r),i=0;i<e.numPoints;i++){var a=e.data.getFloat32(e.currentOffset+i*e.pointAttributes.byteSize+0),o=e.data.getFloat32(e.currentOffset+i*e.pointAttributes.byteSize+4),u=e.data.getFloat32(e.currentOffset+i*e.pointAttributes.byteSize+8);n[3*i+0]=a,n[3*i+1]=o,n[3*i+2]=u}return{buffer:r,attribute:t}}(t,e);default:return}}(t,e);void 0!==r&&(e.attributeBuffers[r.attribute.name]=r,e.transferables.push(r.buffer))}}]);
//# sourceMappingURL=2ecf2bf456a5c4efacca.worker.js.map