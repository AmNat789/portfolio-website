import React, {Suspense, useEffect, useRef, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { LayerMaterial, Color, Depth, Fresnel, Gradient } from 'lamina'


interface GLTFResult extends GLTF{
    nodes: {
        [key: string]: any
    }
}

function useRelativeMousePos() {
    const [relPos, setRelPos] = useState<any>({x: 0.5, y: 0.5});

    useEffect(() => {
        const handleMouseMove = (event: {clientX: number, clientY: number}) => {
            setRelPos({ x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight })
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener(
                'mousemove',
                handleMouseMove
            );
        };
    }, []);

    return [relPos || {x:0.5, y:0.5}, setRelPos]
}

function Model({colors}: {colors: {[key: string]: any}}) {
    const gltf = useGLTF("/3d-models/B_Face.gltf") as GLTFResult;
    const depth = useRef();
    const model1: any = useRef();
    const model2: any = useRef();

    const [relPos, setRelPos] = useRelativeMousePos();

    const getRotation = (scale: number): any => [
        (Math.PI / 2) + ((-0.5 + relPos.y) * scale),
        0,
        (Math.PI/4 )+ ((0.5 - relPos.x) * scale),
    ]

    const baseRotation: [x: number, y: number, z: number] = [(Math.PI / 2), 0, (Math.PI / 4)]

    useFrame((_, delta) => {
        const speed = 5;

        const m1R = getRotation(0.5)
        const m2R = getRotation(0.3)

        model1.current.rotation.x += (m1R[0] - model1.current.rotation.x) * delta * speed;
        model1.current.rotation.z += (m1R[2] - model1.current.rotation.z) * delta * speed;
        model2.current.rotation.x += (m2R[0] - model2.current.rotation.x) * delta * speed;
        model2.current.rotation.z += (m2R[2] - model2.current.rotation.z) * delta * speed;
    })

    return (
        <group>
            <mesh
                rotation={baseRotation}
                geometry={gltf.nodes.Node_149997.geometry}
                position={[0, 0, 0]}
                ref={model1}
            >
                <meshBasicMaterial color={colors.purple}/>

            </mesh>
            <mesh
                rotation={baseRotation}
                geometry={gltf.nodes.Node_149997.geometry}
                position={[0, 0, 0]}
                ref={model2}
            >
                <LayerMaterial>
                    {/*<Color color={'black'} alpha={1} mode={'normal'}/>*/}
                    <Gradient/>
                    <Depth colorA={colors.blue} colorB={colors.purple} alpha={0.5} mode="normal" near={0} far={3} origin={[1, 1, 1]} />
                    <Depth ref={depth as any} colorA={colors.lightBlue} colorB="black" alpha={1} mode="subtract" near={0.25} far={2} origin={[1, 0, 0]} />
                    <Fresnel mode="screen" color="white" intensity={0.3} power={2} bias={0} />
                </LayerMaterial>
            </mesh>
        </group>
    );
}

function Lights(){
    const backLight = useRef<THREE.PointLight>();
    const fillLight = useRef<THREE.PointLight>();
    const keyLight = useRef<THREE.PointLight>();

    return (
        <>
            <pointLight
                ref={backLight as any}
                color={ new THREE.Color('#82ACFF')}
                intensity={3}
                decay={1}
                position={[-5, 5, -5]}
            />
            <pointLight
                ref={fillLight as any}
                color={ new THREE.Color('#82ACFF')}
                intensity={0.7}
                decay={20}
                position={[-5, 0, 5]}
            />
            <pointLight
                ref={keyLight as any}
                color={ new THREE.Color('#FF5D9E')}
                intensity={2}
                decay={20}
                position={[5, 0, 0]}
            />
        </>
    );
}

function Bg({colors}: {colors: {[key: string]: any}}) {
    const mesh: any = useRef()
    useFrame((state, delta) => {
        mesh.current.rotation.x = mesh.current.rotation.y = mesh.current.rotation.z += delta
    })
    return (
        <mesh ref={mesh} scale={100}>
            <sphereGeometry args={[1, 64, 64]} />
            <LayerMaterial attach="material" side={THREE.BackSide}>
                <Color color={colors.pink} alpha={1} mode="normal" />
                <Depth colorA={colors.purple} colorB={colors.lightBlue} alpha={0.5} mode="normal" near={0} far={300} origin={[100, 100, 100]} />
            </LayerMaterial>
        </mesh>
    )
}

export default function HeadHeader({colors}: {colors: {[key: string]: any}}) {

    return (
        <Canvas
        camera={{ position: [0, 0, 1] }}
        >
            <Suspense fallback={null}>
                <Bg colors={colors}/>
                {/*<ambientLight intensity={0.5} />*/}
                <Lights/>
                <Model colors={colors}/>
            </Suspense>
        </Canvas>
    );
}
