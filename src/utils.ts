import * as PIXI from "pixi.js"

const copySprite = (sprite: PIXI.Sprite) => {
  const spriteCopy = sprite

  return spriteCopy
}

const scale = (scale: number, sprite: PIXI.Sprite | PIXI.Graphics) => {
  const scaled = sprite
  scaled.scale.set(scale)
  return scaled
}

const centerAnchor = (sprite: PIXI.Sprite) => {
  const tempSprite = sprite
  tempSprite.anchor.set(0.5)
  return tempSprite
}

const setPosition = (
  position: { x: number; y: number },
  sprite: PIXI.Sprite | PIXI.Graphics
) => {
  const { x, y } = position
  const temp = sprite
  temp.position.set(x, y)
  return temp
}

const setSize = (
  size: { width: number; height: number },
  sprite: PIXI.Sprite
) => {
  const { width, height } = size

  const tempSprite = sprite
  tempSprite.width = width
  tempSprite.height = height
  return tempSprite
}

const addMask = (mask: PIXI.Sprite, sprite: PIXI.Sprite) => {
  const masked = copySprite(sprite)
  masked.mask = mask
  return masked
}

const addToStage = (app: PIXI.Application, ...sprites: PIXI.Sprite[]) =>
  sprites.map((sprite) => app.stage.addChild(sprite))

const setAlpha = (alpha: number, sprite: PIXI.Sprite) => {
  const alphaSprite = copySprite(sprite)
  alphaSprite.alpha = alpha

  return alphaSprite
}

export {
  scale,
  centerAnchor,
  setPosition,
  setSize,
  setAlpha,
  addMask,
  addToStage,
}
