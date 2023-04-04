import {
  Color,
  FrontSide,
  Matrix4,
  Mesh,
  PerspectiveCamera,
  Plane,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
  Vector3,
  Vector4,
  WebGLRenderTarget,
} from "three";

/**
 * Work based on :
 * https://github.com/Slayvin: Flat mirror for three.js
 * https://home.adelphi.edu/~stemkoski/ : An implementation of water shader based on the flat mirror
 * http://29a.ch/ && http://29a.ch/slides/2012/webglwater/ : Water shader explanations in WebGL
 */

class Water {
  isWater: boolean;
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  constructor(mesh, options: any = {}) {
    this.isWater = true;

    const scope = mesh;
    this.mesh = mesh;
    const textureWidth =
      options.textureWidth !== undefined ? options.textureWidth : 512;
    const textureHeight =
      options.textureHeight !== undefined ? options.textureHeight : 512;

    const clipBias = options.clipBias !== undefined ? options.clipBias : 0.0;
    const alpha = options.alpha !== undefined ? options.alpha : 1;
    const time = options.time !== undefined ? options.time : 0.0;
    const normalSampler =
      options.waterNormals !== undefined ? options.waterNormals : null;
    const sunDirection =
      options.sunDirection !== undefined
        ? options.sunDirection
        : new Vector3(0.70707, 0.70707, 0.0);
    const sunColor = new Color(
      options.sunColor !== undefined ? options.sunColor : 0xffffff
    );
    const waterColor = new Color(
      options.waterColor !== undefined ? options.waterColor : 0x7f7f7f
    );
    const eye = options.eye !== undefined ? options.eye : new Vector3(0, 0, 0);
    const distortionScale =
      options.distortionScale !== undefined ? options.distortionScale : 20.0;
    const side = options.side !== undefined ? options.side : FrontSide;
    const fog = options.fog !== undefined ? options.fog : false;

    //

    const mirrorPlane = new Plane();
    const normal = new Vector3();
    const mirrorWorldPosition = new Vector3();
    const cameraWorldPosition = new Vector3();
    const rotationMatrix = new Matrix4();
    const lookAtPosition = new Vector3(0, 0, -1);
    const clipPlane = new Vector4();

    const view = new Vector3();
    const target = new Vector3();
    const q = new Vector4();

    const textureMatrix = new Matrix4();

    const mirrorCamera = new PerspectiveCamera();

    const renderTarget = new WebGLRenderTarget(textureWidth, textureHeight);

    const mirrorShader = {
      uniforms: UniformsUtils.merge([
        UniformsLib["fog"],
        UniformsLib["lights"],
        {
          normalSampler: { value: null },
          mirrorSampler: { value: null },
          alpha: { value: 1.0 },
          time: { value: 0.0 },
          size: { value: 2.0 },
          distortionScale: { value: 20.0 },
          textureMatrix: { value: new Matrix4() },
          sunColor: { value: new Color(0xffffff) },
          sunDirection: { value: new Vector3(0.70707, 0.70707, 0) },
          eye: { value: new Vector3() },
          waterColor: { value: new Color(0x555555) },
        },
      ]),

      vertexShader: /* glsl */ `
				uniform mat4 textureMatrix;
				uniform float time;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				#include <common>
				#include <fog_pars_vertex>
				#include <shadowmap_pars_vertex>
				#include <logdepthbuf_pars_vertex>

				void main() {
					mirrorCoord = modelMatrix * vec4( position, 1.0 );
					worldPosition = mirrorCoord.xyzw;
					mirrorCoord = textureMatrix * mirrorCoord;
					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
					gl_Position = projectionMatrix * mvPosition;

				#include <beginnormal_vertex>
				#include <defaultnormal_vertex>
				#include <logdepthbuf_vertex>
				#include <fog_vertex>
				#include <shadowmap_vertex>
			}`,

      fragmentShader: /* glsl */ `
				uniform sampler2D mirrorSampler;
				uniform float alpha;
				uniform float time;
				uniform float size;
				uniform float distortionScale;
				uniform sampler2D normalSampler;
				uniform vec3 sunColor;
				uniform vec3 sunDirection;
				uniform vec3 eye;
				uniform vec3 waterColor;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				vec4 getNoise( vec2 uv ) {
					vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
					vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
					vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
					vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
					vec4 noise = texture2D( normalSampler, uv0 ) +
						texture2D( normalSampler, uv1 ) +
						texture2D( normalSampler, uv2 ) +
						texture2D( normalSampler, uv3 );
					return noise * 0.5 - 1.0;
				}

				void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
					vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
					float direction = max( 0.0, dot( eyeDirection, reflection ) );
					specularColor += pow( direction, shiny ) * sunColor * spec;
					diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
				}

				#include <common>
				#include <packing>
				#include <bsdfs>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <lights_pars_begin>
				#include <shadowmap_pars_fragment>
				#include <shadowmask_pars_fragment>

				void main() {

					#include <logdepthbuf_fragment>
					vec4 noise = getNoise( worldPosition.xz * size );
					vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

					vec3 diffuseLight = vec3(0.0);
					vec3 specularLight = vec3(0.0);

					vec3 worldToEye = eye-worldPosition.xyz;
					vec3 eyeDirection = normalize( worldToEye );
					sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );

					float distance = length(worldToEye);

					vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
					vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );

					float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
					float rf0 = 0.3;
					float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
					vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
					vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);
					vec3 outgoingLight = albedo;
					gl_FragColor = vec4( outgoingLight, alpha );

					#include <tonemapping_fragment>
					#include <fog_fragment>
				}`,
    };

    const material = new ShaderMaterial({
      fragmentShader: mirrorShader.fragmentShader,
      vertexShader: mirrorShader.vertexShader,
      uniforms: UniformsUtils.clone(mirrorShader.uniforms),
      lights: true,
      side: side,
      fog: fog,
    });

    material.uniforms["mirrorSampler"].value = renderTarget.texture;
    material.uniforms["textureMatrix"].value = textureMatrix;
    material.uniforms["alpha"].value = alpha;
    material.uniforms["time"].value = time;
    material.uniforms["normalSampler"].value = normalSampler;
    material.uniforms["sunColor"].value = sunColor;
    material.uniforms["waterColor"].value = waterColor;
    material.uniforms["sunDirection"].value = sunDirection;
    material.uniforms["distortionScale"].value = distortionScale;

    material.uniforms["eye"].value = eye;
    this.material = material;
    scope.material = material;

    scope.onBeforeRender = function (renderer, scene, camera) {
      mirrorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
      cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

      rotationMatrix.extractRotation(scope.matrixWorld);

      normal.set(0, 0, 1);
      normal.applyMatrix4(rotationMatrix);

      view.subVectors(mirrorWorldPosition, cameraWorldPosition);

      // Avoid rendering when mirror is facing away

      if (view.dot(normal) > 0) return;

      view.reflect(normal).negate();
      view.add(mirrorWorldPosition);

      rotationMatrix.extractRotation(camera.matrixWorld);

      lookAtPosition.set(0, 0, -1);
      lookAtPosition.applyMatrix4(rotationMatrix);
      lookAtPosition.add(cameraWorldPosition);

      target.subVectors(mirrorWorldPosition, lookAtPosition);
      target.reflect(normal).negate();
      target.add(mirrorWorldPosition);

      mirrorCamera.position.copy(view);
      mirrorCamera.up.set(0, 1, 0);
      mirrorCamera.up.applyMatrix4(rotationMatrix);
      mirrorCamera.up.reflect(normal);
      mirrorCamera.lookAt(target);

      mirrorCamera.far = (camera as any).far; // Used in WebGLBackground

      mirrorCamera.updateMatrixWorld();
      mirrorCamera.projectionMatrix.copy(camera.projectionMatrix);

      // Update the texture matrix
      textureMatrix.set(
        0.5,
        0.0,
        0.0,
        0.5,
        0.0,
        0.5,
        0.0,
        0.5,
        0.0,
        0.0,
        0.5,
        0.5,
        0.0,
        0.0,
        0.0,
        1.0
      );
      textureMatrix.multiply(mirrorCamera.projectionMatrix);
      textureMatrix.multiply(mirrorCamera.matrixWorldInverse);

      // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
      // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
      mirrorPlane.setFromNormalAndCoplanarPoint(normal, mirrorWorldPosition);
      mirrorPlane.applyMatrix4(mirrorCamera.matrixWorldInverse);

      clipPlane.set(
        mirrorPlane.normal.x,
        mirrorPlane.normal.y,
        mirrorPlane.normal.z,
        mirrorPlane.constant
      );

      const projectionMatrix = mirrorCamera.projectionMatrix;

      q.x =
        (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) /
        projectionMatrix.elements[0];
      q.y =
        (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) /
        projectionMatrix.elements[5];
      q.z = -1.0;
      q.w =
        (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

      // Calculate the scaled plane vector
      clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));

      // Replacing the third row of the projection matrix
      projectionMatrix.elements[2] = clipPlane.x;
      projectionMatrix.elements[6] = clipPlane.y;
      projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
      projectionMatrix.elements[14] = clipPlane.w;

      eye.setFromMatrixPosition(camera.matrixWorld);

      // Render

      const currentRenderTarget = renderer.getRenderTarget();

      const currentXrEnabled = renderer.xr.enabled;
      const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

      scope.visible = false;

      renderer.xr.enabled = false; // Avoid camera modification and recursion
      renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

      renderer.setRenderTarget(renderTarget);

      renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897

      if (renderer.autoClear === false) renderer.clear();
      renderer.render(scene, mirrorCamera);

      scope.visible = true;

      renderer.xr.enabled = currentXrEnabled;
      renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

      renderer.setRenderTarget(currentRenderTarget);

      // Restore viewport

      const viewport = (camera as any).viewport;

      if (viewport !== undefined) {
        renderer.state.viewport(viewport);
      }
    };
  }
}

const City = {
  uniforms: {
    iTime: {
      value: 0,
    },
    iResolution: {
      value: new Vector3(1, 1, 1),
    },
  },

  vertexShader: `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }

  `,

  fragmentShader: `
  varying vec2 vUv;
  uniform vec3      iResolution;           // viewport iResolution (in pixels)
  uniform float     iTime;    
  float det=.001, br=0., tub=0., hit=0.;
  vec3 pos, sphpos;
  mat3 lookat(vec3 dir, vec3 up) {
    vec3 rt=normalize(cross(dir,up));
    return mat3(rt,cross(rt,dir),dir);
  }
  vec3 path(float t) {
    return vec3(sin(t+cos(t)*.5)*.5,cos(t*.5),t);
  }
  mat2 rot(float a) {
    float s=sin(a);
    float c=cos(a);
    return mat2(c,s,-s,c);
  }
  vec3 fractal(vec2 p) {
    p=fract(p*.1);
    float m=1000.;
    for (int i=0; i<7; i++) {
      p=abs(p)/clamp(abs(p.x*p.y),.25,2.)-1.2;
      m=min(m,abs(p.y)+fract(p.x*.3+iTime*.5+float(i)*.25));
    }
    m=exp(-6.*m);
    return m*vec3(abs(p.x),m,abs(p.y));
  }
  
  float coso(vec3 pp) {
    pp*=.7;
    pp.xy*=rot(pp.z*2.);
    pp.xz*=rot(iTime*2.);
    pp.yz*=rot(iTime);
    float sph=length(pp)-.04;
    sph-=length(sin(pp*40.))*.05;
    sph=max(sph,-length(pp)+.11);
    float br2=length(pp)-.03;
    br2=min(br2,length(pp.xy)+.005);
    br2=min(br2,length(pp.xz)+.005);
    br2=min(br2,length(pp.yz)+.005);
    br2=max(br2,length(pp)-1.);
    br=min(br2,br);
    float d=min(br,sph);
    return d;
  }
  
  
  float de(vec3 p) {
    hit=0.;
    br=1000.;
    vec3 pp=p-sphpos;
    p.xy-=path(p.z).xy;
    p.xy*=rot(p.z+iTime*.5);
    float s=sin(p.z*.5+iTime*.5);
    p.xy*=1.3-s*s*.7;
    
    for(int i=0; i<6; i++) {
      p=abs(p)-.4;
    }
    pos=p;
    tub=-length(p.xy)+.45+sin(p.z*10.)*.1*smoothstep(.4,.5,abs(.5-fract(p.z*.05))*2.);
    float co=coso(pp);
    co=min(co,coso(pp+.7));
    co=min(co,coso(pp-.7));
    float d=min(tub,co);
    if (d==tub) hit=step(fract(.1*length(sin(p*10.))),.05);
    return d*.3;
  }
  
  vec3 march(vec3 from, vec3 dir) {
    vec2 uv=vec2(atan(dir.x,dir.y)+iTime*.5,length(dir.xy)+sin(iTime*.2));
    vec3 col=fractal(uv);
    float d=0.,td=0.,g=0., ref=0., ltd=0., li=0.;
    vec3 p=from;
    for (int i=0; i<200; i++) {
      p+=dir*d;
      d=de(p);
      if (d<det && ref==0. && hit==1.) {
        vec2 e=vec2(0.,.1);
        vec3 n=normalize(vec3(de(p+e.yxx),de(p+e.xyx),de(p+e.xxy))-de(p));
        p-=dir*d*2.;
        dir=reflect(dir,n);
        ref=1.;
        td=0.;
        ltd=td;
        continue;
      }
      if (d<det || td>5.) break;
      td+=d;
      g+=.1/(.1+br*13.);
      li+=.1/(.1+tub*5.);
    }
    g=max(g,li*.15);
    float f=1.-td/3.;
    if (ref==1.) f=1.-ltd/3.;
    if (d<.01) {
      col=vec3(1.);
      vec2 e=vec2(0.,det);
      vec3 n=normalize(vec3(de(p+e.yxx),de(p+e.xyx),de(p+e.xxy))-de(p));
      col=vec3(n.x)*.7;
      col+=fract(pos.z*5.)*vec3(.2,.1,.5);
      col+=fractal(pos.xz*2.);
      if (tub>.01) col=vec3(0.);
    }
    col*=f;
    vec3 glo=g*.1*vec3(2.,1.,2.)*(.5+fract(sin(iTime)*123.456)*1.5)*.5;
    glo.rb*=rot(dir.y*1.5);
    col+=glo;
    col*=vec3(.8,.7,.7);
    col=mix(col,vec3(1.),ref*.3);
    return col;
  }
  
  void main( )
  {
    vec2 uv = vec2(vUv.x / iResolution.x, vUv.y / iResolution.y);
    uv -= 0.5;
    uv /= vec2(iResolution.y / iResolution.x, 1);
    float t=iTime;
    vec3 from= path(t);
    if (mod(iTime,10.)>5.) from=path(floor(t/4.+.5)*4.);
    sphpos=path(t+.5);
    from.x+=.2;
    vec3 fw=normalize(path(t+.5)-from);
    vec3 dir=normalize(vec3(uv,.5));
    dir=lookat(fw,vec3(fw.x*2.,1.,0.))*dir;
    dir.xz+=sin(iTime)*.3;
    vec3 col=march(from,dir);
    col=mix(vec3(.5)*length(col),col,.8);
    gl_FragColor =vec4(col,1.);
  }
    `,
};

export { Water, City };
