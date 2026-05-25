'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRM, VRMHumanBoneName, VRMExpressionPresetName } from '@pixiv/three-vrm';
import * as THREE from 'three';

interface VRMModelProps {
    url: string;
    pose: 'idle' | 'wave' | 'joy';
    onLoaded?: () => void;
}

function VRMModel({ url, pose, onLoaded }: VRMModelProps) {
    const [vrm, setVrm] = useState<VRM | null>(null);
    const vrmRef = useRef<VRM | null>(null);
    const { scene } = useThree();
    const clock = useRef(new THREE.Clock());

    useEffect(() => {
        const loader = new GLTFLoader();
        loader.register((parser) => new VRMLoaderPlugin(parser));

        loader.load(
            url,
            (gltf) => {
                const loadedVrm = gltf.userData.vrm as VRM;
                if (loadedVrm) {
                    setVrm(loadedVrm);
                    scene.add(loadedVrm.scene);
                    loadedVrm.scene.rotation.y = Math.PI; // Face camera

                    // The bounding box logic was pushing the model into the shadow realm.
                    // VRMs natively spawn at 0,0,0 feet-first, so this is correct.
                    loadedVrm.scene.position.set(0, 0, 0);
                    
                    if (onLoaded) onLoaded();
                }
            },
            undefined,
            (error) => {
                console.error('Error loading VRM:', error);
            }
        );

        return () => {
            if (vrm) {
                scene.remove(vrm.scene);
                setVrm(null);
            }
        };
    }, [url, scene, onLoaded]);

    // Apply poses
    useEffect(() => {
        if (!vrm) return;

        // Reset expressions
        if (vrm.expressionManager) {
            vrm.expressionManager.setValue(VRMExpressionPresetName.Joy, 0);
            vrm.expressionManager.setValue(VRMExpressionPresetName.Angry, 0);
            vrm.expressionManager.setValue(VRMExpressionPresetName.Sad, 0);
            vrm.expressionManager.setValue(VRMExpressionPresetName.Relaxed, 0);
        }
        
        const resetBone = (boneName: VRMHumanBoneName) => {
            const node = vrm.humanoid?.getNormalizedBoneNode(boneName);
            if (node) node.rotation.set(0, 0, 0);
        };

        resetBone(VRMHumanBoneName.LeftUpperArm);
        resetBone(VRMHumanBoneName.LeftLowerArm);
        resetBone(VRMHumanBoneName.LeftHand);
        resetBone(VRMHumanBoneName.RightUpperArm);
        resetBone(VRMHumanBoneName.RightLowerArm);
        resetBone(VRMHumanBoneName.RightHand);

        if (pose === 'wave') {
            const leftUpper = vrm.humanoid?.getNormalizedBoneNode(VRMHumanBoneName.LeftUpperArm);
            if (leftUpper) {
                leftUpper.rotation.z = Math.PI / 3;
            }
            
            const leftLower = vrm.humanoid?.getNormalizedBoneNode(VRMHumanBoneName.LeftLowerArm);
            if (leftLower) {
                leftLower.rotation.z = -Math.PI / 4;
            }
            
            if (vrm.expressionManager) {
                vrm.expressionManager.setValue(VRMExpressionPresetName.Joy, 1);
            }
        } else if (pose === 'joy') {
            const rightUpper = vrm.humanoid?.getNormalizedBoneNode(VRMHumanBoneName.RightUpperArm);
            if (rightUpper) {
                rightUpper.rotation.z = -Math.PI / 4;
                rightUpper.rotation.x = Math.PI / 4;
            }
            
            const leftUpper = vrm.humanoid?.getNormalizedBoneNode(VRMHumanBoneName.LeftUpperArm);
            if (leftUpper) {
                leftUpper.rotation.z = Math.PI / 4;
                leftUpper.rotation.x = Math.PI / 4;
            }

            if (vrm.expressionManager) {
                vrm.expressionManager.setValue(VRMExpressionPresetName.Relaxed, 1);
            }
        }
    }, [vrm, pose]);

    useFrame(() => {
        if (vrm) {
            if (pose === 'wave') {
                // Add a little wave animation to the lower arm
                const leftLower = vrm.humanoid?.getNormalizedBoneNode(VRMHumanBoneName.LeftLowerArm);
                if (leftLower) {
                    leftLower.rotation.z = -Math.PI / 4 + Math.sin(clock.current.getElapsedTime() * 5) * 0.2;
                }
            } else if (pose === 'joy') {
                // Add a little bounce
                vrm.scene.position.y = Math.abs(Math.sin(clock.current.getElapsedTime() * 3)) * 0.05;
            } else {
                vrm.scene.position.y = 0;
            }
            vrm.update(clock.current.getDelta());
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
    const [pose, setPose] = useState<'idle' | 'wave' | 'joy'>('idle');

    return (
        <div className={className} style={{ height, position: 'relative' }}>
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-ba z-10">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-ba-red/30 border-t-ba-red rounded-full animate-spin" />
                        <span className="text-sm font-display font-bold text-ba-muted">Loading model...</span>
                    </div>
                </div>
            )}
            
            {/* Pose Controls */}
            {isLoaded && (
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    <button 
                        onClick={() => setPose('idle')} 
                        className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${pose === 'idle' ? 'bg-ba-pink text-white border-ba-pink' : 'bg-black/50 text-white/50 border-white/20 hover:border-white'}`}
                    >
                        IDLE
                    </button>
                    <button 
                        onClick={() => setPose('wave')} 
                        className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${pose === 'wave' ? 'bg-ba-pink text-white border-ba-pink' : 'bg-black/50 text-white/50 border-white/20 hover:border-white'}`}
                    >
                        WAVE
                    </button>
                    <button 
                        onClick={() => setPose('joy')} 
                        className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${pose === 'joy' ? 'bg-ba-pink text-white border-ba-pink' : 'bg-black/50 text-white/50 border-white/20 hover:border-white'}`}
                    >
                        JOY
                    </button>
                </div>
            )}

            <Canvas
                camera={{ position: [0, 1.0, 3.0], fov: 35 }}
                className="rounded-ba"
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.8} color="#fff5f0" />
                <directionalLight position={[2, 3, 4]} intensity={1.2} color="#ffffff" />
                <directionalLight position={[-2, 2, -1]} intensity={0.4} color="#B8E2FF" />
                <pointLight position={[0, 2, 0]} intensity={0.5} color="#FFB8D4" />

                <VRMModel url={modelUrl} pose={pose} onLoaded={() => setIsLoaded(true)} />

                <OrbitControls
                    target={[0, 1.0, 0]}
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
