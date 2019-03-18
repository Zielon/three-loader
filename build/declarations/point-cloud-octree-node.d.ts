import { Box3, EventDispatcher, Object3D, Points, Sphere } from 'three';
import { PointCloudOctreeGeometryNode } from './point-cloud-octree-geometry-node';
import { IPointCloudTreeNode } from './types';
export declare class PointCloudOctreeNode extends EventDispatcher implements IPointCloudTreeNode {
    geometryNode: PointCloudOctreeGeometryNode;
    sceneNode: Points;
    pcIndex: number | undefined;
    boundingBoxNode: Object3D | null;
    readonly children: (IPointCloudTreeNode | null)[];
    readonly loaded = true;
    readonly isTreeNode: boolean;
    readonly isGeometryNode: boolean;
    constructor(geometryNode: PointCloudOctreeGeometryNode, sceneNode: Points);
    dispose(): void;
    traverse(cb: (node: IPointCloudTreeNode) => void, includeSelf?: boolean): void;
    readonly id: number;
    readonly name: string;
    readonly level: number;
    readonly isLeafNode: boolean;
    readonly numPoints: number;
    readonly index: number;
    readonly boundingSphere: Sphere;
    readonly boundingBox: Box3;
    readonly spacing: number;
}
