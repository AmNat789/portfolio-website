import React, { Suspense, useRef } from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { LayerMaterial, Color, Depth, Fresnel } from 'lamina'


interface GLTFResult extends GLTF{
    nodes: {
        [key: string]: any
    }
}

function Model() {
    const gltf = useGLTF("/3d-models/B_Face.gltf") as GLTFResult;
    // const material = new THREE.MeshBasicMaterial({
    //     color: 0x00000,
    // });

    return (
        <group>
            <mesh
                rotation={[Math.PI / 2,0, Math.PI/4]}
                geometry={gltf.nodes.Node_149997.geometry}
                position={[0, 0, 0]}
            >
                <meshStandardMaterial color={new THREE.Color('gray')}/>
            </mesh>
            {/*<mesh*/}
            {/*    rotation={[Math.PI / 2,0, Math.PI/4]}*/}
            {/*    geometry={gltf.nodes.Node_149997.geometry}*/}
            {/*    position={[0, 0, 0]}*/}
            {/*/>*/}
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

function Bg() {
    const mesh: any = useRef()
    useFrame((state, delta) => {
        mesh.current.rotation.x = mesh.current.rotation.y = mesh.current.rotation.z += delta
    })
    return (
        <mesh ref={mesh} scale={100}>
            <sphereGeometry args={[1, 64, 64]} />
            <LayerMaterial attach="material" side={THREE.BackSide}>
                <Color color={'#ff4eb8'} alpha={1} mode="normal" />
                <Depth colorA={'#ff8f00'} colorB={'#00ffff'} alpha={0.5} mode="normal" near={0} far={300} origin={[100, 100, 100]} />
            </LayerMaterial>
        </mesh>
    )
}

export default function HeadHeader() {
    return (
        <Canvas
        camera={{ position: [0, 0, 1] }}
        >
            <Suspense fallback={null}>
                <OrbitControls />
                <Bg/>
                {/*<ambientLight intensity={0.5} />*/}
                <Lights/>
                <Model />
            </Suspense>
        </Canvas>
    );
}
