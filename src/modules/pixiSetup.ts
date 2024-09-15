// pixiSetup.ts
import * as PIXI from "pixi.js";

export const setTransform = (
  obj: PIXI.Container | PIXI.Sprite,
  x?: number,
  y?: number,
  scaleX?: number,
  scaleY?: number,
  rotation?: number,
  anchorX?: number,
  anchorY?: number
) => {
  if (x !== undefined) {
    obj.position.x = x;
  }
  if (y !== undefined) {
    obj.position.y = y;
  }
  if (scaleX !== undefined && scaleY === undefined) {
    scaleX *= (obj as any).defaultScaleX || 1;
    obj.scale.set(scaleX);
  } else if (scaleX !== undefined && scaleY !== undefined) {
    scaleX *= (obj as any).defaultScaleX || 1;
    scaleY *= (obj as any).defaultScaleY || 1;
    obj.scale.set(scaleX, scaleY);
  }
  if (rotation !== undefined) {
    obj.rotation = rotation;
  }
  if (
    !(obj instanceof PIXI.Container) &&
    !(obj as any).isSpine &&
    !(obj as any).isButton
  ) {
    if (anchorX === undefined && anchorY === undefined) {
      (obj as any).anchor?.set(0.5);
    } else if (anchorX !== undefined && anchorY === undefined) {
      (obj as any).anchor?.set(anchorX);
    } else if (anchorX !== undefined && anchorY !== undefined) {
      (obj as any).anchor?.set(anchorX, anchorY);
    }
  }
};

export const getGlobalTransform = (
  obj: PIXI.Container | PIXI.Sprite
): {
  position: PIXI.Point;
  scale: { x: number; y: number };
  rotation: number;
} => {
  const transform: any = {};
  let parent = obj.parent as PIXI.Container;
  transform.position = parent.toGlobal(obj.position);
  transform.scale = {
    x: obj.scale.x / ((obj as any).defaultScaleX || 1),
    y: obj.scale.y / ((obj as any).defaultScaleY || 1),
  };
  transform.rotation = obj.rotation;
  while (parent != null) {
    transform.scale.x *= parent.scale.x;
    transform.scale.y *= parent.scale.y;
    transform.rotation += parent.rotation;
    parent = parent.parent;
  }
  return transform;
};

export const createContainer = (
  parent: PIXI.Container,
  transformOptions: {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
    anchorX?: number;
    anchorY?: number;
  } = {}
): PIXI.Container => {
  const container = new PIXI.Container();
  // container.type = "Container";
  (container as any).type = "Container";

  // Apply the setTransform function to the container before adding it to the parent
  setTransform(
    container,
    transformOptions.x,
    transformOptions.y,
    transformOptions.scaleX,
    transformOptions.scaleY,
    transformOptions.rotation,
    transformOptions.anchorX,
    transformOptions.anchorY
  );

  // Add container to the parent after applying the transformation
  parent.addChild(container);

  // Custom delete function
  const deleteContainer = (
    container: PIXI.Container,
    deleteChildren: boolean = true
  ) => {
    if (deleteChildren && container.children.length > 0) {
      for (let i = container.children.length - 1; i >= 0; i--) {
        const child = container.children[i];
        if (child instanceof PIXI.Container) {
          deleteContainer(child, true);
        } else {
          (child as PIXI.Container | PIXI.Sprite).destroy();
        }
      }
    }
    parent.removeChild(container);
    container.destroy();
  };

  // Assign the delete function to the container (optional)
  (container as any).delete = (deleteChildren: boolean = true) =>
    deleteContainer(container, deleteChildren);

  // Optionally, if you want to retrieve global transform right after creation
  const globalTransform = getGlobalTransform(container);
  console.log(globalTransform); // You can use this as needed

  return container;
};

export const createSprite = (
  parent: PIXI.Container,
  textureId: string,
  transformOptions: {
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
    anchorX?: number;
    anchorY?: number;
  } = {}
): PIXI.Sprite => {
  const texture = PIXI.Texture.from(textureId);

  const sprite = new PIXI.Sprite(texture);
  (sprite as any).type = "Sprite";
  sprite.anchor.set(0.5);

  // Apply transformations
  setTransform(
    sprite,
    transformOptions.x,
    transformOptions.y,
    transformOptions.scaleX,
    transformOptions.scaleY,
    transformOptions.rotation,
    transformOptions.anchorX,
    transformOptions.anchorY
  );

  parent.addChild(sprite);

  // Define a delete function for the sprite
  (sprite as any).delete = () => {
    parent.removeChild(sprite);
    sprite.destroy(true);
  };

  const globalTransform = getGlobalTransform(sprite);
  console.log(globalTransform); // You can use this as needed

  return sprite;
};

export const whiteRectangle = (
  parent: PIXI.Container,
  size: [number, number],
  color: number = 0xffffff
): PIXI.Sprite => {
  let sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
  sprite.label = "white rectangle";
  sprite.width = size[0];
  sprite.height = size[1];

  // Extract the default scales
  const defaultScaleX = sprite.scale.x;
  const defaultScaleY = sprite.scale.y;

  sprite.tint = color;
  (sprite as any).type = "Sprite";

  // Assuming addCommonProps is a global function or method of the current context
  (this as any).addCommonProps(sprite);

  sprite.anchor.set(0.5);
  parent.addChild(sprite);

  // Apply transformations using setTransform (pass defaultScaleX and defaultScaleY)
  setTransform(sprite, defaultScaleX, defaultScaleY);

  // Methods
  (sprite as any).delete = () => {
    parent.removeChild(sprite);
    sprite.destroy(true);
  };

  return sprite;
};

export const WhiteCircle = (
  parent: PIXI.Container,
  radius: number,
  color: number = 0xffffff
): PIXI.Graphics => {
  let circle = new PIXI.Graphics();

  // Begin fill with the given color and draw the circle
  circle.beginFill(color);
  circle.drawCircle(0, 0, radius);
  circle.endFill();

  circle.label = "white circle";
  circle.width = radius * 2;
  circle.height = radius * 2;

  const defaultScaleX = circle.scale.x;
  const defaultScaleY = circle.scale.y;

  (circle as any).type = "White Circle Graphics";
  (this as any).addCommonProps(circle);

  circle.pivot.set(0.5);
  parent.addChild(circle);

  setTransform(circle, defaultScaleX, defaultScaleY);

  // Methods
  (circle as any).delete = () => {
    parent.removeChild(circle);
    circle.destroy();
  };

  return circle;
};

export const primaryTextStyle = new PIXI.TextStyle({
  fontFamily: "Durango Western Eroded, sans-serif",
  fontSize: 45,
  fontWeight: "normal",
  fill: "#FFFFFF",
  stroke: "#000000",
  // strokeThickness: 2 as any,
  // dropShadow: true,
  // dropShadowColor: "#000000",
  // dropShadowBlur: 2,
  // dropShadowAngle: Math.PI / 6,
  // dropShadowDistance: 2,
  // lineJoin: "bevel",
});

export const secondaryTextStyle = new PIXI.TextStyle({
  fontFamily: "Durango Western Eroded, sans-serif",
  fontSize: 30,
  fontWeight: "normal",
  fill: "#FFFFFF",
  stroke: "#000000",
  // strokeThickness: 2 as any,
  // lineJoin: "round",
});

export const createText = (
  parent: PIXI.Container,
  text: string,
  textStyle: PIXI.TextStyle
): PIXI.Text => {
  let t = new PIXI.Text(text, textStyle);

  (t as any).type = "Text";
  t.anchor.set(0.5);
  parent.addChild(t);

  (t as any).delete = () => {
    parent.removeChild(t);
    t.destroy(true);
  };

  return t;
};

