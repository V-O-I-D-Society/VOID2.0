/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { Suspense, memo, useEffect, useRef, useState } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, useFBO, useGLTF } from '@react-three/drei';
import { easing } from 'maath';

const MODELS = {
  lens: { glb: '/assets/3d/lens.glb', geometryKey: 'Cylinder' },
  bar: { glb: '/assets/3d/bar.glb', geometryKey: 'Cube' },
  cube: { glb: '/assets/3d/cube.glb', geometryKey: 'Cube' }
};

// Animated backdrop the glass refracts.
function Backdrop({ top = '#14142a', bottom = '#07070e', glow = '#3b82f6' }) {
  const { viewport } = useThree();
  const matRef = useRef(null);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uTop: { value: new THREE.Color(top) },
          uBottom: { value: new THREE.Color(bottom) },
          uGlow: { value: new THREE.Color(glow) }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uTop;
          uniform vec3 uBottom;
          uniform vec3 uGlow;
          void main() {
            vec2 uv = vUv;
            vec3 col = mix(uBottom, uTop, pow(uv.y, 1.3));
            col += uGlow * 0.18 * smoothstep(0.85, 0.0, length(uv - vec2(0.5)));
            col += uGlow * 0.30 * smoothstep(0.42, 0.0, length(uv - vec2(0.28 + 0.18 * sin(uTime * 0.4), 0.35 + 0.15 * cos(uTime * 0.5))));
            col += uGlow * 0.30 * smoothstep(0.42, 0.0, length(uv - vec2(0.72 + 0.15 * cos(uTime * 0.35), 0.68 + 0.18 * sin(uTime * 0.45))));
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

// Glass object: renders the scene to an FBO, shows it full-screen, then draws
// the transmission-mesh glass that refracts it.
const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  clearColor = '#07070e',
  ...props
}) {
  const ref = useRef(null);
  const { nodes } = useGLTF(glb);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef(1);

  useEffect(() => {
    const geo = nodes[geometryKey]?.geometry;
    if (!geo) return;
    geo.computeBoundingBox();
    geoWidthRef.current = geo.boundingBox.max.x - geo.boundingBox.min.x || 1;
  }, [nodes, geometryKey]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    if (modeProps.scale == null) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(0.15, desired));
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(new THREE.Color(clearColor), 1);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      <mesh
        ref={ref}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        geometry={nodes[geometryKey]?.geometry}
        {...props}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          {...extraMat}
        />
      </mesh>
    </>
  );
});

/**
 * FluidGlass background (reactbits.dev FluidGlass, stripped of demo content).
 * Renders a 3D transmission-glass object refracting an animated backdrop.
 * Use it as a background layer — the wrapper fills its parent.
 */
export default function FluidGlassBg({
  mode = 'lens',
  modeProps = {},
  clearColor = '#07070e',
  top = '#14142a',
  bottom = '#07070e',
  glow = '#3b82f6',
  followPointer,
  lockToBottom,
  className = '',
  style
}) {
  const { glb, geometryKey } = MODELS[mode] || MODELS.lens;
  const follows = followPointer ?? mode === 'bar' ? false : true;
  const locksBottom = lockToBottom ?? mode === 'bar';

  return (
    <div className={className} style={style}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 15 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={Math.min(window.devicePixelRatio || 1, 1.5)}
      >
        <Suspense fallback={null}>
          <ModeWrapper
            glb={glb}
            geometryKey={geometryKey}
            followPointer={follows}
            lockToBottom={locksBottom}
            modeProps={modeProps}
            clearColor={clearColor}
          >
            <Backdrop top={top} bottom={bottom} glow={glow} />
          </ModeWrapper>
        </Suspense>
      </Canvas>
    </div>
  );
}
