import * as PIXI from "pixi.js"
import hello from "./hello.png"
import back from "./back.png"
import textureAlpha from "./texture-alpha.png"
import brush from "./brush.png"
import world from "./world.png"
import { curry, pipe } from "ramda"
import {
  scale,
  centerAnchor,
  setPosition,
  setSize,
  addMask,
  setAlpha,
  addToStage,
} from "./utils"

PIXI.Renderer.registerPlugin("interaction", PIXI.InteractionManager)

const width = window.innerWidth
const height = window.innerHeight

const app = new PIXI.Application({
  resizeTo: window,
  resolution: 1,
  backgroundColor: 0xfffffe,
})

const { stage } = app

const scaleHalf = curry(scale)(0.5)

const setSpriteFullScreen = curry(setSize)({ width, height })
const setPositionCenter = curry(setPosition)({ x: width / 2, y: height / 2 })

const centerAndScale = pipe(
  setSpriteFullScreen,
  centerAnchor,
  setPositionCenter
)

//_ prepare the cursor
let graphics = new PIXI.Graphics()
graphics.lineStyle({ width: 2, color: 0x99b2dd, alpha: 0.3 })
graphics.beginFill(0x99b2dd, 0)
graphics.drawCircle(0, 0, 35)
graphics.endFill()

graphics.lineStyle()
graphics.beginFill(0x99b2dd, 0.4)
graphics.drawCircle(0, 0, 25)

graphics = setPositionCenter(graphics)

const onLoad = (loader: any, resources: any) => {
  const brushSprite = new PIXI.Sprite(resources.brushTexture.texture)

  const container = new PIXI.Container()
  container.addChild(brushSprite)
  const texture = app.renderer.generateTexture(container)

  const brush = centerAnchor(new PIXI.Sprite(texture))

  //_ foreground
  const textHello = pipe(
    centerAndScale,
    scaleHalf
  )(new PIXI.Sprite(resources.text.texture))

  let canvas = new PIXI.Sprite(resources.textureAlpha.texture)
  canvas = setAlpha(0.4, canvas)

  // @ts-ignore
  canvas = centerAndScale(canvas)

  //@ts-ignore
  addToStage(app, textHello, canvas)

  //_ background to reveal
  const renderTexture = PIXI.RenderTexture.create({
    width,
    height,
  })

  const renderTextureSprite = new PIXI.Sprite(renderTexture)

  stage.addChild(renderTextureSprite)

  const addRenderTextureMask = curry(addMask)(renderTextureSprite)

  const background = pipe(
    centerAndScale,
    addRenderTextureMask
  )(new PIXI.Sprite(resources.back.texture))

  const world = pipe(
    centerAndScale,
    scaleHalf,
    addRenderTextureMask
  )(new PIXI.Sprite(resources.world.texture))

  let backgroundCanvas = new PIXI.Sprite(resources.textureAlpha.texture)
  backgroundCanvas = setAlpha(0.4, canvas)

  // @ts-ignore
  backgroundCanvas = centerAndScale(canvas)

  addToStage(app, background, world, backgroundCanvas)

  let dragging = false

  const handlePointerMove = (e: any) => {
    //@ts-ignore
    graphics = setPosition(e.data.global, graphics)

    if (dragging) {
      //@ts-ignore
      brush = setPosition(e.data.global, brush)

      //* see type def: https://github.com/pixijs/pixijs/blob/9b724f289118ebbf9b4500fa3faab1e7aaaabd02/packages/core/src/AbstractRenderer.ts
      app.renderer.render(brush, {
        renderTexture: renderTexture,
        clear: false,
        transform: null,
        skipUpdateTransform: false,
      })
    }
  }

  const pointerDown = (e: any) => {
    dragging = true
    handlePointerMove(e)
  }

  const pointerUp = (e: any) => (dragging = false)

  app.stage.interactive = true
  app.stage.on("pointerdown", pointerDown)
  app.stage.on("pointerup", pointerUp)
  app.stage.on("pointermove", handlePointerMove)
  app.stage.addChild(graphics)
}

let count = 0

app.ticker.add(() => {
  count += 0.01
  const scaleModifier = 1 + (Math.sin(count) * 0.5 + 0.5) * 0.3

  // @ts-ignore
  graphics = scale(scaleModifier, graphics)
})

app.loader
  .add("back", back)
  .add("text", hello)
  .add("brushTexture", brush)
  .add("textureAlpha", textureAlpha)
  .add("world", world)
  .load(onLoad)

export default app.view
