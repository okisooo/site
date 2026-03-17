'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRM } from '@pixiv/three-vrm';
import * as THREE from 'three';

interface VRMModelProps {
    url: string;
}

function VRMModel({ url }: VRMModelProps) {
    const vrmRef = useRef<VRM | null>(null);
    const { scene } = useThree();
    const clock = useRef(new THREE.Clock());

    useEffect(() => {
        const loader = new GLTFLoader();
        loader.register((parser) => new VRMLoaderPlugin(parser));

        loader.load(
            url,
            (gltf) => {
                const vrm = gltf.userData.vrm as VRM;
                if (vrm) {
                    vrmRef.current = vrm;
                    scene.add(vrm.scene);
                    vrm.scene.rotation.y = Math.PI; // Face camera

                    // Reset model position
                    const box = new THREE.Box3().setFromObject(vrm.scene);
                    const center = box.getCenter(new THREE.Vector3());
                    vrm.scene.position.sub(center);
                    vrm.scene.position.y += box.getSize(new THREE.Vector3()).y / 2;
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

export default function VRMViewer({ modelUrl, className, height = '500px' }: VRMViewerProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={className} style={{ height, position: 'relative' }}>
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-ba z-10">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-ba-sky/30 border-t-ba-sky rounded-full animate-spin" />
                        <span className="text-sm font-display font-bold text-ba-muted">Loading model...</span>
                    </div>
                </div>
            )}
            <Canvas
                camera={{ position: [0, 1.2, 2.5], fov: 35 }}
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

                <OrbitControls
                    target={[0, 1, 0]}
                    minDistance={1.5}
                    maxDistance={5}
                    maxPolarAngle={Math.PI / 1.8}
                    minPolarAngle={Math.PI / 6}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={1.5}
                />
            </Canvas>
        </div>
    );
}
