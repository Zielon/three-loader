import {
  AdditiveBlending,
  Color,
  LessEqualDepth,
  NearestFilter,
  NoBlending,
  RawShaderMaterial,
  Texture,
  VertexColors,
} from 'three';
import {
  DEFAULT_MAX_POINT_SIZE,
  DEFAULT_MIN_POINT_SIZE,
  DEFAULT_RGB_BRIGHTNESS,
  DEFAULT_RGB_CONTRAST,
  DEFAULT_RGB_GAMMA,
} from '../constants';
import { DEFAULT_CLASSIFICATION } from './classification';
import { ClipMode, IClipBox } from './clipping';
import { PointColorType, PointOpacityType, PointShape, PointSizeType, TreeType } from './enums';
import { SPECTRAL } from './gradients/spectral';
import {
  generateClassificationTexture,
  generateDataTexture,
  generateGradientTexture,
} from './texture-generation';
import { IClassification, IGradient, IUniform } from './types';

export interface IPointCloudMaterialParameters {
  size: number;
  minSize: number;
  maxSize: number;
  treeType: TreeType;
}

export interface IPointCloudMaterialUniforms {
  bbSize: IUniform<[number, number, number]>;
  blendDepthSupplement: IUniform<number>;
  blendHardness: IUniform<number>;
  classificationLUT: IUniform<Texture>;
  clipBoxCount: IUniform<number>;
  clipBoxes: IUniform<Float32Array>;
  depthMap: IUniform<Texture | null>;
  diffuse: IUniform<[number, number, number]>;
  far: IUniform<number>;
  fov: IUniform<number>;
  gradient: IUniform<Texture>;
  heightMax: IUniform<number>;
  heightMin: IUniform<number>;
  intensityBrightness: IUniform<number>;
  intensityContrast: IUniform<number>;
  intensityGamma: IUniform<number>;
  intensityRange: IUniform<[number, number]>;
  level: IUniform<number>;
  maxSize: IUniform<number>;
  minSize: IUniform<number>;
  near: IUniform<number>;
  octreeSize: IUniform<number>;
  opacity: IUniform<number>;
  pcIndex: IUniform<number>;
  rgbBrightness: IUniform<number>;
  rgbContrast: IUniform<number>;
  rgbGamma: IUniform<number>;
  screenHeight: IUniform<number>;
  screenWidth: IUniform<number>;
  size: IUniform<number>;
  spacing: IUniform<number>;
  toModel: IUniform<number[]>;
  transition: IUniform<number>;
  uColor: IUniform<Color>;
  visibleNodes: IUniform<Texture>;
  vnStart: IUniform<number>;
  wClassification: IUniform<number>;
  wElevation: IUniform<number>;
  wIntensity: IUniform<number>;
  wReturnNumber: IUniform<number>;
  wRGB: IUniform<number>;
  wSourceID: IUniform<number>;
  opacityAttenuation: IUniform<number>;
  filterByNormalThreshold: IUniform<number>;
}

const TREE_TYPE_DEFS = {
  [TreeType.OCTREE]: 'tree_type_octree',
  [TreeType.KDTREE]: 'tree_type_kdtree',
};

const SIZE_TYPE_DEFS = {
  [PointSizeType.FIXED]: 'fixed_point_size',
  [PointSizeType.ATTENUATED]: 'attenuated_point_size',
  [PointSizeType.ADAPTIVE]: 'adaptive_point_size',
};

const OPACITY_DEFS = {
  [PointOpacityType.ATTENUATED] : 'attenuated_opacity',
  [PointOpacityType.FIXED] : 'fixed_opacity'
};

const SHAPE_DEFS = {
  [PointShape.SQUARE]: 'square_point_shape',
  [PointShape.CIRCLE]: 'circle_point_shape',
  [PointShape.PARABOLOID]: 'paraboloid_point_shape',
};

const COLOR_DEFS = {
  [PointColorType.RGB]: 'color_type_rgb',
  [PointColorType.COLOR]: 'color_type_color',
  [PointColorType.DEPTH]: 'color_type_depth',
  [PointColorType.HEIGHT]: 'color_type_height',
  [PointColorType.INTENSITY]: 'color_type_intensity',
  [PointColorType.INTENSITY_GRADIENT]: 'color_type_intensity_gradient',
  [PointColorType.LOD]: 'color_type_lod',
  [PointColorType.POINT_INDEX]: 'color_type_point_index',
  [PointColorType.CLASSIFICATION]: 'color_type_classification',
  [PointColorType.RETURN_NUMBER]: 'color_type_return_number',
  [PointColorType.SOURCE]: 'color_type_source',
  [PointColorType.NORMAL]: 'color_type_normal',
  [PointColorType.PHONG]: 'color_type_phong',
  [PointColorType.RGB_HEIGHT]: 'color_type_rgb_height',
  [PointColorType.COMPOSITE]: 'color_type_composite',
};

const CLIP_MODE_DEFS = {
  [ClipMode.DISABLED]: 'clip_disabled',
  [ClipMode.CLIP_OUTSIDE]: 'clip_outside',
  [ClipMode.HIGHLIGHT_INSIDE]: 'clip_highlight_inside',
};

export class PointCloudMaterial extends RawShaderMaterial {
  lights = false;
  fog = false;
  numClipBoxes: number = 0;
  clipBoxes: IClipBox[] = [];
  readonly visibleNodesTexture: Texture;

  private _gradient = SPECTRAL;
  private gradientTexture = generateGradientTexture(this._gradient);

  private _classification: IClassification = DEFAULT_CLASSIFICATION;
  private classificationTexture: Texture = generateClassificationTexture(this._classification);

  uniforms: IPointCloudMaterialUniforms & Record<string, IUniform<any>> = {
    bbSize: makeUniform('fv', [0, 0, 0] as [number, number, number]),
    blendDepthSupplement: makeUniform('f', 0.0),
    blendHardness: makeUniform('f', 2.0),
    classificationLUT: makeUniform('t', this.classificationTexture),
    clipBoxCount: makeUniform('f', 0),
    clipBoxes: makeUniform('Matrix4fv', [] as any),
    depthMap: makeUniform('t', null),
    diffuse: makeUniform('fv', [1, 1, 1] as [number, number, number]),
    far: makeUniform('f', 1.0),
    fov: makeUniform('f', 1.0),
    gradient: makeUniform('t', this.gradientTexture),
    heightMax: makeUniform('f', 1.0),
    heightMin: makeUniform('f', 0.0),
    intensityBrightness: makeUniform('f', 0),
    intensityContrast: makeUniform('f', 0),
    intensityGamma: makeUniform('f', 1),
    intensityRange: makeUniform('fv', [0, 65000] as [number, number]),
    isLeafNode: makeUniform('b', 0),
    level: makeUniform('f', 0.0),
    maxSize: makeUniform('f', DEFAULT_MAX_POINT_SIZE),
    minSize: makeUniform('f', DEFAULT_MIN_POINT_SIZE),
    near: makeUniform('f', 0.1),
    octreeSize: makeUniform('f', 0),
    opacity: makeUniform('f', 1.0),
    pcIndex: makeUniform('f', 0),
    rgbBrightness: makeUniform('f', DEFAULT_RGB_BRIGHTNESS),
    rgbContrast: makeUniform('f', DEFAULT_RGB_CONTRAST),
    rgbGamma: makeUniform('f', DEFAULT_RGB_GAMMA),
    screenHeight: makeUniform('f', 1.0),
    screenWidth: makeUniform('f', 1.0),
    size: makeUniform('f', 1),
    spacing: makeUniform('f', 1.0),
    toModel: makeUniform('Matrix4f', []),
    transition: makeUniform('f', 0.5),
    uColor: makeUniform('c', new Color(0xffffff)),
    visibleNodes: makeUniform('t', this.visibleNodesTexture),
    vnStart: makeUniform('f', 0.0),
    wClassification: makeUniform('f', 0),
    wElevation: makeUniform('f', 0),
    wIntensity: makeUniform('f', 0),
    wReturnNumber: makeUniform('f', 0),
    wRGB: makeUniform('f', 1),
    wSourceID: makeUniform('f', 0),
    opacityAttenuation: makeUniform('f', 1),
    filterByNormalThreshold: makeUniform('f', 0)
  };

  @uniform('bbSize') bbSize!: [number, number, number]; // prettier-ignore
  @uniform('depthMap') depthMap!: Texture | null; // prettier-ignore
  @uniform('far') far!: number; // prettier-ignore
  @uniform('fov') fov!: number; // prettier-ignore
  @uniform('heightMax') heightMax!: number; // prettier-ignore
  @uniform('heightMin') heightMin!: number; // prettier-ignore
  @uniform('intensityBrightness') intensityBrightness!: number; // prettier-ignore
  @uniform('intensityContrast') intensityContrast!: number; // prettier-ignore
  @uniform('intensityGamma') intensityGamma!: number; // prettier-ignore
  @uniform('intensityRange') intensityRange!: [number, number]; // prettier-ignore
  @uniform('maxSize') maxSize!: number; // prettier-ignore
  @uniform('minSize') minSize!: number; // prettier-ignore
  @uniform('near') near!: number; // prettier-ignore
  @uniform('opacity', true) opacity!: number; // prettier-ignore
  @uniform('rgbBrightness', true) rgbBrightness!: number; // prettier-ignore
  @uniform('rgbContrast', true) rgbContrast!: number; // prettier-ignore
  @uniform('rgbGamma', true) rgbGamma!: number; // prettier-ignore
  @uniform('screenHeight') screenHeight!: number; // prettier-ignore
  @uniform('screenWidth') screenWidth!: number; // prettier-ignore
  @uniform('size') size!: number; // prettier-ignore
  @uniform('spacing') spacing!: number; // prettier-ignore
  @uniform('transition') transition!: number; // prettier-ignore
  @uniform('uColor') color!: Color; // prettier-ignore
  @uniform('wClassification') weightClassification!: number; // prettier-ignore
  @uniform('wElevation') weightElevation!: number; // prettier-ignore
  @uniform('wIntensity') weightIntensity!: number; // prettier-ignore
  @uniform('wReturnNumber') weightReturnNumber!: number; // prettier-ignore
  @uniform('wRGB') weightRGB!: number; // prettier-ignore
  @uniform('wSourceID') weightSourceID!: number; // prettier-ignore
  @uniform('opacityAttenuation') opacityAttenuation!: number; // prettier-ignore
  @uniform('filterByNormalThreshold') filterByNormalThreshold!: number; // prettier-ignore

  @requiresShaderUpdate() useClipBox: boolean = false; // prettier-ignore
  @requiresShaderUpdate() weighted: boolean = false; // prettier-ignore
  @requiresShaderUpdate() pointColorType: PointColorType = PointColorType.RGB; // prettier-ignore
  @requiresShaderUpdate() pointSizeType: PointSizeType = PointSizeType.ADAPTIVE; // prettier-ignore
  @requiresShaderUpdate() clipMode: ClipMode = ClipMode.DISABLED; // prettier-ignore
  @requiresShaderUpdate() useEDL: boolean = false; // prettier-ignore
  @requiresShaderUpdate() shape: PointShape = PointShape.SQUARE; // prettier-ignore
  @requiresShaderUpdate() treeType: TreeType = TreeType.OCTREE; // prettier-ignore
  @requiresShaderUpdate() pointOpacityType: PointOpacityType = PointOpacityType.FIXED; // prettier-ignore
  @requiresShaderUpdate() useFilterByNormal: boolean = false; // prettier-ignore

  attributes = {
    position: { type: 'fv', value: [] },
    color: { type: 'fv', value: [] },
    normal: { type: 'fv', value: [] },
    intensity: { type: 'f', value: [] },
    classification: { type: 'f', value: [] },
    returnNumber: { type: 'f', value: [] },
    numberOfReturns: { type: 'f', value: [] },
    pointSourceID: { type: 'f', value: [] },
    indices: { type: 'fv', value: [] },
  };

  constructor(parameters: Partial<IPointCloudMaterialParameters> = {}) {
    super();

    const tex = (this.visibleNodesTexture = generateDataTexture(2048, 1, new Color(0xffffff)));
    tex.minFilter = NearestFilter;
    tex.magFilter = NearestFilter;
    this.setUniform('visibleNodes', tex);

    this.treeType = getValid(parameters.treeType, TreeType.OCTREE);
    this.size = getValid(parameters.size, 1.0);
    this.minSize = getValid(parameters.minSize, 2.0);
    this.maxSize = getValid(parameters.maxSize, 50.0);

    this.classification = DEFAULT_CLASSIFICATION;

    this.defaultAttributeValues.normal = [0, 0, 0];
    this.defaultAttributeValues.classification = [0, 0, 0];
    this.defaultAttributeValues.indices = [0, 0, 0, 0];

    this.vertexColors = VertexColors;

    this.updateShaderSource();
  }

  updateShaderSource() {
    this.vertexShader = this.applyDefines(require('./shaders/pointcloud.vert'));
    this.fragmentShader = this.applyDefines(require('./shaders/pointcloud.frag'));

    if (this.opacity === 1.0) {
      this.blending = NoBlending;
      this.transparent = false;
      this.depthTest = true;
      this.depthWrite = true;
      this.depthFunc = LessEqualDepth;
    } else if (this.opacity < 1.0 && !this.useEDL) {
      this.blending = AdditiveBlending;
      this.transparent = true;
      this.depthTest = false;
      this.depthWrite = true;
    }

    if (this.weighted) {
      this.blending = AdditiveBlending;
      this.transparent = true;
      this.depthTest = true;
      this.depthWrite = false;
      this.depthFunc = LessEqualDepth;
    }

    this.needsUpdate = true;
  }

  applyDefines(shaderSrc: string): string {
    const parts: string[] = [];

    function define(value: string) {
      parts.push(`#define ${value}`);
    }

    define(TREE_TYPE_DEFS[this.treeType]);
    define(SIZE_TYPE_DEFS[this.pointSizeType]);
    define(SHAPE_DEFS[this.shape]);
    define(COLOR_DEFS[this.pointColorType]);
    define(CLIP_MODE_DEFS[this.clipMode]);
    define(OPACITY_DEFS[this.pointOpacityType]);

    // We only perform gamma and brightness/contrast calculations per point if values are specified.
    if (
      this.rgbGamma !== DEFAULT_RGB_GAMMA ||
      this.rgbBrightness !== DEFAULT_RGB_BRIGHTNESS ||
      this.rgbContrast !== DEFAULT_RGB_CONTRAST
    ) {
      define('use_rgb_gamma_contrast_brightness');
    }

    if (this.useFilterByNormal) {
      define('use_filter_by_normal');
    }

    if (this.useEDL) {
      define('use_edl');
    }

    if (this.weighted) {
      define('weighted_splats');
    }

    if (this.numClipBoxes > 0) {
      define('use_clip_box');
    }

    parts.push(shaderSrc);

    return parts.join('\n');
  }

  setClipBoxes(clipBoxes: IClipBox[]): void {
    if (!clipBoxes) {
      return;
    }

    this.clipBoxes = clipBoxes;

    const doUpdate =
      this.numClipBoxes !== clipBoxes.length && (clipBoxes.length === 0 || this.numClipBoxes === 0);

    this.numClipBoxes = clipBoxes.length;
    this.setUniform('clipBoxCount', this.numClipBoxes);

    if (doUpdate) {
      this.updateShaderSource();
    }

    const clipBoxesLength = this.numClipBoxes * 16;
    const clipBoxesArray = new Float32Array(clipBoxesLength);

    for (let i = 0; i < this.numClipBoxes; i++) {
      clipBoxesArray.set(clipBoxes[i].inverse.elements, 16 * i);
    }

    for (let i = 0; i < clipBoxesLength; i++) {
      if (isNaN(clipBoxesArray[i])) {
        clipBoxesArray[i] = Infinity;
      }
    }

    this.setUniform('clipBoxes', clipBoxesArray);
  }

  get gradient(): IGradient {
    return this._gradient;
  }

  set gradient(value: IGradient) {
    if (this._gradient !== value) {
      this._gradient = value;
      this.gradientTexture = generateGradientTexture(this._gradient);
      this.setUniform('gradient', this.gradientTexture);
    }
  }

  get classification(): IClassification {
    return this._classification;
  }

  set classification(value: IClassification) {
    const copy: IClassification = {} as any;
    for (const key of Object.keys(value)) {
      copy[key] = value[key].clone();
    }

    let isEqual = false;
    if (this._classification === undefined) {
      isEqual = false;
    } else {
      isEqual = Object.keys(copy).length === Object.keys(this._classification).length;

      for (const key of Object.keys(copy)) {
        isEqual = isEqual && this._classification[key] !== undefined;
        isEqual = isEqual && copy[key].equals(this._classification[key]);
      }
    }

    if (!isEqual) {
      this._classification = copy;
      this.recomputeClassification();
    }
  }

  private recomputeClassification(): void {
    this.classificationTexture = generateClassificationTexture(this._classification);
    this.setUniform('classificationLUT', this.classificationTexture);
  }

  get elevationRange(): [number, number] {
    return [this.heightMin, this.heightMax];
  }

  set elevationRange(value: [number, number]) {
    this.heightMin = value[0];
    this.heightMax = value[1];
  }

  getUniform<K extends keyof IPointCloudMaterialUniforms>(
    name: K,
  ): IPointCloudMaterialUniforms[K]['value'] {
    return this.uniforms === undefined ? (undefined as any) : this.uniforms[name].value;
  }

  setUniform<K extends keyof IPointCloudMaterialUniforms>(
    name: K,
    value: IPointCloudMaterialUniforms[K]['value'],
  ): void {
    if (this.uniforms === undefined) {
      return;
    }

    const uObj = this.uniforms[name];

    if (uObj.type === 'c') {
      (uObj.value as Color).copy(value as Color);
    } else if (value !== uObj.value) {
      uObj.value = value;
    }
  }
}

function makeUniform<T>(type: string, value: T): IUniform<T> {
  return { type, value };
}

function getValid<T>(a: T | undefined, b: T): T {
  return a === undefined ? b : a;
}

// tslint:disable:no-invalid-this
function uniform<K extends keyof IPointCloudMaterialUniforms>(
  uniformName: K,
  requireSrcUpdate: boolean = false,
): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol): void => {
    Object.defineProperty(target, propertyKey, {
      get() {
        return this.getUniform(uniformName);
      },
      set(value: any) {
        if (value !== this.getUniform(uniformName)) {
          this.setUniform(uniformName, value);
          if (requireSrcUpdate) {
            this.updateShaderSource();
          }
        }
      },
    });
  };
}

function requiresShaderUpdate() {
  return (target: Object, propertyKey: string | symbol): void => {
    const fieldName = "_" + propertyKey.toString();

    Object.defineProperty(target, propertyKey, {
      get() {
        return this[fieldName];
      },
      set(value: any) {
        if (value !== this[fieldName]) {
          this[fieldName] = value;
          this.updateShaderSource();
        }
      },
    });
  };
}
