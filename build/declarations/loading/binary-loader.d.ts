import { Box3 } from 'three';
import { PointCloudOctreeGeometryNode } from '../point-cloud-octree-geometry-node';
import { Version } from '../version';
import { GetUrlFn, XhrRequest } from './types';
interface BinaryLoaderOptions {
    getUrl?: GetUrlFn;
    version: string;
    boundingBox: Box3;
    scale: number;
    xhrRequest: XhrRequest;
}
export declare class BinaryLoader {
    version: Version;
    boundingBox: Box3;
    scale: number;
    getUrl: GetUrlFn;
    disposed: boolean;
    xhrRequest: XhrRequest;
    callbacks: ((node: PointCloudOctreeGeometryNode) => void)[];
    private workers;
    constructor({ getUrl, version, boundingBox, scale, xhrRequest, }: BinaryLoaderOptions);
    dispose(): void;
    load(node: PointCloudOctreeGeometryNode): Promise<void>;
    private getNodeUrl;
    private parse;
    private _parse;
    private getWorker;
    private releaseWorker;
    private getTightBoundingBox;
    private addBufferAttributes;
    private addIndices;
    private addNormalAttribute;
    private isAttribute;
}
export {};
