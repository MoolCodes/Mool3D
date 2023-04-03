import { RoamType } from "../types/types";
import {
  Vector3,
  Box3,
  Matrix4,
  Line3,
  Group,
  Mesh,
  Clock,
  MeshStandardMaterial,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { MeshBVH, MeshBVHVisualizer } from "../threelibex/three-mesh-bvh.js";
export class Roam implements RoamType {
  collider: THREE.Mesh;
  visualizer: any;
  player: THREE.Mesh;
  controls: any;
  camera: THREE.Camera;
  object: THREE.Object3D;
  environment: THREE.Group;
  scene: THREE.Scene;
  animate: Fn<any>[];
  playerIsOnGround: boolean;
  fwdPressed: boolean;
  bkdPressed: boolean;
  lftPressed: boolean;
  rgtPressed: boolean;
  playerVelocity: THREE.Vector3;
  upVector: THREE.Vector3;
  tempVector: THREE.Vector3;
  tempVector2: THREE.Vector3;
  tempBox: THREE.Box3;
  tempMat: THREE.Matrix4;
  tempSegment: THREE.Line3;
  clock: THREE.Clock;
  params: any;
  isRun: boolean;
  runCallback: Fn<any>;
  angle: number;
  constructor(options) {
    this.collider = null;
    this.visualizer = null;
    this.player = null; // 参照物圆柱体
    this.controls = options.controls; // 控制器
    this.object = null; //人物模型
    this.environment = null;
    this.scene = options.scene; //场景
    this.camera = options.camera; //相机
    this.animate = options.animate;
    this.object = options.object;
    this.runCallback = options.runCallback;
    this.playerIsOnGround = false;
    this.fwdPressed = false; // W
    this.bkdPressed = false; // S
    this.lftPressed = false; // A
    this.rgtPressed = false; // D
    this.playerVelocity = new Vector3();
    this.upVector = new Vector3(0, 1, 0);
    this.tempVector = new Vector3();
    this.tempVector2 = new Vector3();
    this.tempBox = new Box3();
    this.tempMat = new Matrix4();
    this.tempSegment = new Line3();
    this.clock = new Clock();
    this.isRun = false;
    this.angle = 0;
    this.params = {
      // gui配置对对象
      firstPerson: false,
      displayCollider: false,
      displayBVH: false,
      visualizeDepth: 10,
      gravity: -2,
      playerSpeed: 0.3, //移动速度
      physicsSteps: 12,
      playerVelocity: 5,
      reset: this.reset,
    };
  }

  init() {
    this.loadColliderEnvironment();
    this.windowEvent();
    this.animate.push(() => {
      this.render();
    });
  }

  /*
   *@description: 生存碰撞面
   *@author: yangj
   *@date: 2023-03-22 13:46:03
   *@return:
   */
  loadColliderEnvironment() {
    new Box3().setFromObject(this.scene);
    this.scene.updateMatrixWorld(true);
    const toMerge = {};
    this.scene.traverse((c) => {
      if ((c as THREE.Mesh).isMesh && (c as any).material.color !== undefined) {
        const hex = (c as any).material.color.getHex();
        toMerge[hex] = toMerge[hex] || [];
        toMerge[hex].push(c);
      }
    });
    this.environment = new Group();
    for (const hex in toMerge) {
      const arr = toMerge[hex];
      const visualGeometries = [];
      arr.forEach((mesh) => {
        if (mesh.material.emissive) {
          this.environment.attach(mesh);
        } else {
          const geom = mesh.geometry.clone();
          console.log(geom);
          geom.applyMatrix4(mesh.matrixWorld);
          if (!geom.attributes.uv2 && geom.index) {
            visualGeometries.push(geom);
          }
        }
      });

      if (visualGeometries.length > 0) {
        const newGeom =
          BufferGeometryUtils.mergeBufferGeometries(visualGeometries);
        const newMesh = new Mesh(
          newGeom,
          new MeshStandardMaterial({
            color: parseInt(hex),
          })
        );
        newMesh.material.transparent = true;
        newMesh.material.opacity = 0;
        newMesh.name = "mool";
        this.environment.add(newMesh);
      }
    }

    // collect all geometries to merge
    const geometries = [];
    this.environment.updateMatrixWorld(true);
    this.environment.traverse((c) => {
      if ((c as THREE.Mesh).geometry) {
        const cloned = (c as THREE.Mesh).geometry.clone();
        cloned.applyMatrix4(c.matrixWorld);
        for (const key in cloned.attributes) {
          if (key !== "position") {
            cloned.deleteAttribute(key);
          }
        }

        geometries.push(cloned);
      }
    });

    // create the merged geometry
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
      geometries,
      false
    );
    (mergedGeometry as any).boundsTree = new MeshBVH(mergedGeometry, {
      lazyGeneration: false,
    });

    this.collider = new Mesh(mergedGeometry);
    (this.collider.material as any).wireframe = true;
    (this.collider.material as any).opacity = 0.5;
    (this.collider.material as any).transparent = true;
    this.visualizer = new MeshBVHVisualizer(
      this.collider,
      this.params.visualizeDepth
    );
    this.scene.add(this.visualizer);
    this.scene.add(this.collider);
    this.scene.add(this.environment);
    this.loadplayer();
  }
  /*
   *@description: 加载移动模型
   *@author: yangj
   *@date: 2023-03-22 13:46:20
   *@return:
   */
  loadplayer() {
    this.player = new Mesh(
      new RoundedBoxGeometry(0.5, 5.5, 0.5, 17, 0.5),
      new MeshStandardMaterial()
    );
    this.player.geometry.translate(0, -0.5, 0);
    (this.player as any).capsuleInfo = {
      radius: 0.7,
      segment: new Line3(new Vector3(), new Vector3(0, -1, 0.0)),
    };
    this.player.name = "player";
    this.player.castShadow = true;
    this.player.receiveShadow = true;
    (this.player.material as any).shadowSide = 2;
    this.player.visible = false;
    console.log(this.object);

    this.scene.add(this.player, this.object);
    this.reset();
  }
  /**
   * @description
   * @author: yangj (yangjia@fjxhx.cc)
   * @createDate: 2022/3/1
   */
  windowEvent() {
    const that = this;
    // window.addEventListener(
    //   'resize',
    //   function() {
    //     that.camera.aspect = window.innerWidth / window.innerHeight
    //     camera.updateProjectionMatrix()

    //     renderer.setSize(window.innerWidth, window.innerHeight)
    //   },
    //   false
    // )

    document.addEventListener("keydown", function (e) {
      switch (e.code) {
        case "KeyW":
          that.fwdPressed = true;
          break;
        case "KeyS":
          that.bkdPressed = true;
          break;
        case "KeyD":
          that.rgtPressed = true;
          break;
        case "KeyA":
          that.lftPressed = true;
          break;
        case "KeyZ":
          if (that.playerIsOnGround) {
            that.playerVelocity.y = that.params.playerVelocity;
          }
          break;
        case "ShiftLeft":
          that.params.playerSpeed = 0.6;
          that.params.playerVelocity = 7;
          break;
        case "KeyV":
          that.params.firstPerson = !that.params.firstPerson;
          if (!that.params.firstPerson) {
            that.camera.position
              .sub(that.controls.target)
              .normalize()
              .multiplyScalar(5)
              .add(that.controls.target);
            that.camera.updateMatrixWorld();
            that.object.visible = true;
          } else {
            that.camera.updateMatrixWorld();
            that.object.visible = false;
            that.controls.reset();
          }
          break;
      }
      if (!that.isRun) {
        that.isRun = true;
        that.runCallback instanceof Function && that.runCallback(true);
      }
    });

    document.addEventListener("keyup", function (e) {
      switch (e.code) {
        case "KeyW":
          that.fwdPressed = false;
          break;
        case "KeyS":
          that.bkdPressed = false;
          break;
        case "KeyD":
          that.rgtPressed = false;
          break;
        case "KeyA":
          that.lftPressed = false;
          break;
        case "ShiftLeft":
          that.params.playerSpeed = 0.3;
          that.params.playerVelocity = 5;
          break;
      }
      if (
        that.isRun &&
        !that.fwdPressed &&
        !that.bkdPressed &&
        !that.rgtPressed &&
        !that.lftPressed
      ) {
        that.isRun = false;
        that.runCallback instanceof Function && that.runCallback(false);
      }
    });
  }
  /**
   * @description 重置
   * @author: yangj (yangjia@fjxhx.cc)
   * @createDate: 2022/3/1
   */
  reset() {
    this.playerVelocity.set(0, 0, 0);
    this.player.position.set(0, 80, 50);
    this.camera.position.sub(this.controls.target);
    this.controls.target.copy(this.player.position);
    this.camera.position.add(this.player.position);
    this.controls.update();
  }
  /*
   *@description:
   *@author: yangj
   *@date: 2023-03-22 13:58:01
   *@return:
   */
  render() {
    const delta = Math.min(this.clock.getDelta(), 0.1);
    if (
      (this.rgtPressed ||
        this.lftPressed ||
        this.bkdPressed ||
        this.fwdPressed) &&
      !this.params.firstPerson
    ) {
    }
    if (this.params.firstPerson) {
      this.controls.maxPolarAngle = Math.PI / 2;
      this.controls.minDistance = 1e-4;
      this.controls.maxDistance = 1e-3;
    } else {
      this.controls.maxPolarAngle = Math.PI / 2;
      this.controls.minDistance = 4;
      this.controls.maxDistance = 10;
    }

    if (this.collider && this.player) {
      this.collider.visible = this.params.displayCollider;
      this.visualizer.visible = this.params.displayBVH;

      const physicsSteps = this.params.physicsSteps;
      for (let i = 0; i < physicsSteps; i++) {
        this.updatePlayer(delta);
      }
    }
  }
  /*
   *@description: 更新检测碰撞
   *@author: yangj
   *@date: 2023-03-22 13:56:29
   *@return:
   */
  updatePlayer(delta) {
    this.playerVelocity.y += this.playerIsOnGround
      ? 0
      : delta * this.params.gravity;
    this.player.position.addScaledVector(this.playerVelocity, delta);
    // move the player
    const angle = this.controls.getAzimuthalAngle();
    if (this.fwdPressed) {
      this.tempVector
        .set(0, 0, -1)
        .applyAxisAngle(this.upVector, this.angle + angle);
      this.player.position.addScaledVector(
        this.tempVector,
        this.params.playerSpeed * delta
      );
    }

    if (this.bkdPressed) {
      this.tempVector.set(0, 0, 1).applyAxisAngle(this.upVector, angle);
      this.player.position.addScaledVector(
        this.tempVector,
        this.params.playerSpeed * delta
      );
    }

    if (this.lftPressed) {
      this.tempVector.set(-1, 0, 0).applyAxisAngle(this.upVector, angle);
      this.player.position.addScaledVector(
        this.tempVector,
        this.params.playerSpeed * delta
      );
    }

    if (this.rgtPressed) {
      this.tempVector.set(1, 0, 0).applyAxisAngle(this.upVector, angle);
      this.player.position.addScaledVector(
        this.tempVector,
        this.params.playerSpeed * delta
      );
    }
    this.player.updateMatrixWorld();

    // adjust player position based on collisions
    const capsuleInfo = (this.player as any).capsuleInfo;
    this.tempBox.makeEmpty();
    this.tempMat.copy(this.collider.matrixWorld).invert();
    this.tempSegment.copy(capsuleInfo.segment);

    // get the position of the capsule in the local space of the collider
    this.tempSegment.start
      .applyMatrix4(this.player.matrixWorld)
      .applyMatrix4(this.tempMat);
    this.tempSegment.end
      .applyMatrix4(this.player.matrixWorld)
      .applyMatrix4(this.tempMat);

    // get the axis aligned bounding box of the capsule
    this.tempBox.expandByPoint(this.tempSegment.start);
    this.tempBox.expandByPoint(this.tempSegment.end);

    this.tempBox.min.addScalar(-capsuleInfo.radius);
    this.tempBox.max.addScalar(capsuleInfo.radius);

    (this.collider.geometry as any).boundsTree.shapecast({
      intersectsBounds: (box) => box.intersectsBox(this.tempBox),

      intersectsTriangle: (tri) => {
        // check if the triangle is intersecting the capsule and adjust the
        // capsule position if it is.
        const triPoint = this.tempVector;
        const capsulePoint = this.tempVector2;

        const distance = tri.closestPointToSegment(
          this.tempSegment,
          triPoint,
          capsulePoint
        );
        if (distance < capsuleInfo.radius) {
          const depth = capsuleInfo.radius - distance;
          const direction = capsulePoint.sub(triPoint).normalize();

          this.tempSegment.start.addScaledVector(direction, depth);
          this.tempSegment.end.addScaledVector(direction, depth);
        }
      },
    });

    const newPosition = this.tempVector;
    newPosition
      .copy(this.tempSegment.start)
      .applyMatrix4(this.collider.matrixWorld);

    // check how much the collider was moved
    const deltaVector = this.tempVector2;
    deltaVector.subVectors(newPosition, this.player.position);
    // if the player was primarily adjusted vertically we assume it's on something we should consider ground
    this.playerIsOnGround =
      deltaVector.y > Math.abs(delta * this.playerVelocity.y * 0.25);

    const offset = Math.max(0.0, deltaVector.length() - 1e-5);
    deltaVector.normalize().multiplyScalar(offset);

    // adjust the player model
    this.player.position.add(deltaVector);
    if (!this.playerIsOnGround) {
      deltaVector.normalize();
      this.playerVelocity.addScaledVector(
        deltaVector,
        -deltaVector.dot(this.playerVelocity)
      );
    } else {
      this.playerVelocity.set(0, 0, 0);
    }

    // adjust the camera
    this.camera.position.sub(this.controls.target);
    this.controls.target.copy(this.player.position);
    this.camera.position.add(this.player.position);
    this.camera.updateMatrixWorld();
    let position0 = this.player.position.clone();
    this.controls.position0.copy(
      position0.addScaledVector(
        new Vector3(0, 0, 1).applyAxisAngle(this.upVector, angle),
        0.01
      )
    );
    this.controls.target0.copy(this.player.position);
    this.player.rotation.y = this.controls.getAzimuthalAngle() + 3 + this.angle;
    if (this.object) {
      this.object.rotation.y =
        this.controls.getAzimuthalAngle() + 3 + this.angle;
      this.object.position.set(
        this.player.position.clone().x,
        this.player.position.clone().y,
        this.player.position.clone().z
      );
      this.object.position.y -= 1.5;
    }
    // if the player has fallen too far below the level reset their position to the start
    if (this.player.position.y < -25) {
      this.reset();
    }
  }
}
