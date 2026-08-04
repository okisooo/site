'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { VRMLoaderPlugin, VRM } from '@pixiv/three-vrm';
import * as THREE from 'three';

interface VRMModelProps {
    url: string;
}

function CameraAdjuster() {
    const { camera, size } = useThree();

    useEffect(() => {
        if (camera instanceof THREE.PerspectiveCamera) {
            const aspect = size.width / size.height;
            
            const targetDistance = 2.0;
            const fitHeight = 1.5; // Zooms in on the character (fits torso and head)
            const fitWidth = 2.2;  // Fits wide T-pose model width + padding

            const fovHeight = 2 * Math.atan(fitHeight / (2 * targetDistance)) * (180 / Math.PI);
            const fovWidth = 2 * Math.atan(fitWidth / (2 * targetDistance * aspect)) * (180 / Math.PI);

            // Fitting WIDTH by inflating the VERTICAL fov only stays sane while the
            // canvas is roughly square. On a portrait phone (390x844, aspect 0.46)
            // this formula returns ~100deg, and a 100deg vertical fov renders the
            // model visibly stretched and distorted.
            // Clamp it. Desktop resolves to ~61.5deg, so a 60deg ceiling leaves the
            // existing framing effectively untouched; narrow viewports now crop the
            // T-pose arms instead of distorting the whole figure, which is the
            // normal trade for portrait framing.
            const MAX_FOV = 60;
            const MIN_FOV = 30;
            camera.fov = Math.min(MAX_FOV, Math.max(MIN_FOV, Math.max(fovHeight, fovWidth)));
            camera.updateProjectionMatrix();
        }
    }, [size.width, size.height, camera]);

    return null;
}

function VRMModel({ url }: VRMModelProps) {
    const vrmRef = useRef<VRM | null>(null);
    const { scene } = useThree();
    const clock = useRef(new THREE.Clock());

    useEffect(() => {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        loader.setDRACOLoader(dracoLoader);
        loader.register((parser) => new VRMLoaderPlugin(parser));

        loader.load(
            url,
            (gltf) => {
                const vrm = gltf.userData.vrm as VRM;
                if (vrm) {
                    vrmRef.current = vrm;
                    scene.add(vrm.scene);
                    vrm.scene.rotation.y = Math.PI; // Face camera

                    // The bounding box logic was pushing the model into the shadow realm.
                    // VRMs natively spawn at 0,0,0 feet-first, so this is correct.
                    vrm.scene.position.set(0, 0, 0);
                }
            },
            undefined,
            (error) => {
                console.error('Error loading VRM:', error);
            }
        );

        return () => {
            if (vrmRef.current) {
                scene.remove(vrmRef.current.scene);
                vrmRef.current = null;
            }
        };
    }, [url, scene]);

    useFrame(() => {
        if (vrmRef.current) {
            vrmRef.current.update(clock.current.getDelta());
        }
    });

    return null;
}

interface VRMViewerProps {
    modelUrl: string;
    className?: string;
    height?: string;
}

export default function VRMViewer({ modelUrl, className, height = '100%' }: VRMViewerProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={className} style={{ height, position: 'relative' }}>
            {!isLoaded && (
                /* Tactical, not frosted glass. A white blurred pill over the hero
                   composition broke the whole aesthetic at the worst possible
                   moment — the first seconds after the boot sequence. */
                <div className="absolute inset-0 z-10 flex items-end justify-start p-4">
                    <div className="flex items-center gap-2 border border-white/15 bg-[#0c0c0e]/85 px-3 py-2">
                        <span className="h-1.5 w-1.5 animate-pulse bg-[#e6112b]" />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#eceae5]">
                            Loading subject
                        </span>
                    </div>
                </div>
            )}
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 1.1, 2.0], fov: 35 }}
                onCreated={() => {
                    // Small delay to let the model start loading
                    setTimeout(() => setIsLoaded(true), 1000);
                }}
                className="rounded-ba"
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.8} color="#fff5f0" />
                <directionalLight position={[2, 3, 4]} intensity={1.2} color="#ffffff" />
                <directionalLight position={[-2, 2, -1]} intensity={0.4} color="#B8E2FF" />
                <pointLight position={[0, 2, 0]} intensity={0.5} color="#FFB8D4" />

                <VRMModel url={modelUrl} />
                <CameraAdjuster />

                <OrbitControls
                    target={[0, 1.1, 0]}
                    enableZoom={false}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                    autoRotate
                    autoRotateSpeed={1.5}
                />
            </Canvas>
        </div>
    );
}
