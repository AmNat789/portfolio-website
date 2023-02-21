import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import * as THREE from "three";
import {useLayoutEffect, useRef} from "react";

class Point {
    x: number;
    y: number;
    z: number;
    connectedPoints: Point[];

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.connectedPoints = [];
    }

    addConnectedPoint(point: Point) {
        if (this.connectedPoints.length > 1)
            throw new Error('Point can only have 2 connected points');
        else this.connectedPoints.push(point);
    }
}

class Edge {
    p1: Point;
    p2: Point;
    distance: number;

    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
        this.distance = this.getDistanceBetweenPoints(p1, p2);
    }

    getDistanceBetweenPoints(p1: Point, p2: Point) {
        const x = p1.x - p2.x;
        const y = p1.y - p2.y;
        const z = p1.z - p2.z;
        return Math.sqrt(x * x + y * y + z * z);
    }
}

function createEdges(points: Point[]) {
    const edges: Edge[] = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            edges.push(new Edge(points[i], points[j]));
        }
    }
    return edges.sort((a, b) => a.distance - b.distance);
}

function createPoints(total: number) {
    const points = [];
    for (let i = 0; i < total; i++) {
        //randCoords should create a random point within a sphere of 100 radius
        const randCoords = [Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100];

        points.push(new Point(randCoords[0], randCoords[1], randCoords[2]));
    }
    return points;
}

function setConnectedPoints(edges: Edge[]) {
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        if (edge.p1.connectedPoints.length < 2 && edge.p2.connectedPoints.length < 2) {
            edge.p1.addConnectedPoint(edge.p2);
            edge.p2.addConnectedPoint(edge.p1);
        }
    }
}

function edgeAsPrimativeLine(edge: Edge, key: string) {
    const pointsAsVectors = [edge.p1, edge.p2].map(point => new THREE.Vector3(point.x, point.y, point.z));
    const geometry = new THREE.BufferGeometry().setFromPoints(pointsAsVectors);
    const material = new THREE.LineBasicMaterial({color: 0x0000ff});
    return <primitive object={new THREE.Line(geometry, material)} key={key}/>
}

export interface HeaderGridProps {
    totalPoints: number;
}

export default function HeaderGrid({totalPoints}: HeaderGridProps) {
    const points = createPoints(totalPoints);
    const edges = createEdges(points);
    setConnectedPoints(edges);

    return <Canvas>
        <OrbitControls/>
        {edges.map((edge, i) => edgeAsPrimativeLine(edge, String(i)))}
    </Canvas>;
}
