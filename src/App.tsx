import React, { Ref } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { OrbitControls, Stars } from "@react-three/drei";
import HeaderGrid from "./HeaderGrid";
import HeadHeader from "./HeadHeader";

function Box() {
  const [ref, api]: any = useBox(() => ({ mass: 1, position: [0, 10, 0] }));
  return (
    <mesh onClick={() => api.velocity.set(0, 2, 0)} ref={ref}>
      <boxBufferGeometry attach={"geometry"} />
      <meshLambertMaterial attach={"material"} color={"hotpink"} />
    </mesh>
  );
}

function Plane() {
  const [ref]: any = usePlane(() => ({
    mass: 0,
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach={"geometry"} args={[100, 100]} />
      <meshLambertMaterial attach={"material"} color={"lightblue"} />
    </mesh>
  );
}

function App() {
    const colors = {
        pink: '#FF5D9E',
        purple: '#8F71FF',
        blue: '#82ACFF',
        lightBlue: '#8BFFFF'
    }


  return (
      // <HeaderGrid totalPoints={1000}/>
      <>
          <HeadHeader colors={colors}/>
      </>
    // <Canvas>
    //     <OrbitControls />
    //   <Stars />
    //   <ambientLight intensity={0.5} />
    //   <spotLight position={[10, 15, 10]} angle={0.3} />
    //   <Physics>
    //     <Box />
    //     <Plane />
    //   </Physics>
    // </Canvas>
  );
}

export default App;
