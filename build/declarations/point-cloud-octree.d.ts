import { Box3, Object3D, PerspectiveCamera, Ray, Scene, Sphere, Vector3, WebGLRenderer, WebGLRenderTarget } from 'three';
import { PointCloudMaterial, PointSizeType } from './materials';
import { PointCloudOctreeGeometry } from './point-cloud-octree-geometry';
import { PointCloudOctreeGeometryNode } from './point-cloud-octree-geometry-node';
import { PointCloudOctreeNode } from './point-cloud-octree-node';
import { PointCloudTree } from './point-cloud-tree';
import { IPointCloudTreeNode, IPotree, PickPoint } from './types';
export interface PickParams {
    pickWindowSize: number;
    pickOutsideClipRegion: boolean;
    /**
     * In the case of custom pixel position coordinates, this property
     * will be used for the pick window position.
     */
    pixelPos: Vector3;
    /**
     * For a custom configuration of render target and pick material
     * @param material The pick material
     * @param target The render target for picking
     */
    pickConfiguration: (material: PointCloudMaterial, target: WebGLRenderTarget) => void;
}
export interface IPickState {
    renderTarget: WebGLRenderTarget;
    material: PointCloudMaterial;
    scene: Scene;
}
export declare class PointCloudOctree extends PointCloudTree {
    potree: IPotree;
    disposed: boolean;
    pcoGeometry: PointCloudOctreeGeometry;
    boundingBox: Box3;
    boundingSphere: Sphere;
    material: PointCloudMaterial;
    level: number;
    maxLevel: number;
    /**
     * The minimum radius of a node's bounding sphere on the screen in order to be displayed.
     */
    minNodePixelSize: number;
    root: IPointCloudTreeNode | null;
    boundingBoxNodes: Object3D[];
    visibleNodes: PointCloudOctreeNode[];
    visibleGeometry: PointCloudOctreeGeometryNode[];
    numVisiblePoints: number;
    showBoundingBox: boolean;
    pickState: IPickState | undefined;
    private visibleBounds;
    private visibleNodeTextureOffsets;
    constructor(potree: IPotree, pcoGeometry: PointCloudOctreeGeometry, material?: PointCloudMaterial);
    private initMaterial;
    dispose(): void;
    pointSizeType: PointSizeType;
    toTreeNode(geometryNode: PointCloudOctreeGeometryNode, parent?: PointCloudOctreeNode | null): PointCloudOctreeNode;
    private makeOnBeforeRender;
    updateVisibleBounds(): void;
    updateBoundingBoxes(): void;
    updateMaterial(material: PointCloudMaterial, visibleNodes: PointCloudOctreeNode[], camera: PerspectiveCamera, renderer: WebGLRenderer): void;
    private updateVisibilityTextureData;
    private helperSphere;
    nodesOnRay(nodes: PointCloudOctreeNode[], ray: Ray): PointCloudOctreeNode[];
    updateMatrixWorld(force: boolean): void;
    hideDescendants(object: Object3D): void;
    moveToOrigin(): void;
    moveToGroundPlane(): void;
    getBoundingBoxWorld(): Box3;
    getVisibleExtent(): Box3;
    pick(renderer: WebGLRenderer, camera: PerspectiveCamera, ray: Ray, params?: Partial<PickParams>): PickPoint | null;
    private getPickPoint;
    private addPositionToPickPoint;
    private addNormalToPickPoint;
    private getPickState;
    private updatePickMaterial;
    private updatePickRenderTarget;
    private makePickRenderTarget;
    readonly progress: number;
}
