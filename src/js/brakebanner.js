class BrakeBanner {
  // private app
  constructor(selector) {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
    })
    document.querySelector(selector).appendChild(this.app.view)

    // j加载器
    this.loader = new PIXI.Loader()

    this.loader.add('btn.png', 'images/btn.png')
    this.loader.add('brake_bike.png', 'images/brake_bike.png')
    this.loader.add('brake_handlerbar.png', 'images/brake_handlerbar.png')
    this.loader.add('brake_lever.png', 'images/brake_lever.png')
    this.loader.add('btn_circle.png', 'images/btn_circle.png')

    this.loader.load()

    this.loader.onComplete.add(() => {
      this.show()
    })
  }

  show() {
    const actionButton = this.createActionButton()
    actionButton.x = actionButton.y = 400

    const bikeContainer = new PIXI.Container()
    this.app.stage.addChild(bikeContainer)
    bikeContainer.scale.x = bikeContainer.scale.y = 0.3

    const brakeHandlerbar = new PIXI.Sprite(this.loader.resources['brake_handlerbar.png'].texture)
    bikeContainer.addChild(brakeHandlerbar)

    const bikeBrakeImage = new PIXI.Sprite(this.loader.resources['brake_bike.png'].texture)
    bikeContainer.addChild(bikeBrakeImage)

    // 把手
    const bikeLeverImage = new PIXI.Sprite(this.loader.resources['brake_lever.png'].texture)
    bikeContainer.addChild(bikeLeverImage)

    bikeLeverImage.pivot.x = 455
    bikeLeverImage.pivot.y = 455
    bikeLeverImage.x = 722
    bikeLeverImage.y = 900

    // bikeLeverImage.rotation = (Math.PI / 180) * -30
    this.app.stage.addChild(actionButton)

    actionButton.interactive = true
    actionButton.buttonMode = true

    actionButton.on('mousedown', () => {
      // bikeLeverImage.rotation = (Math.PI / 180) * -30
      gsap.to(bikeLeverImage, { duration: 0.6, rotation: (Math.PI / 180) * -30 })
      pause()
    })

    actionButton.on('mouseup', () => {
      // bikeLeverImage.rotation = 0
      gsap.to(bikeLeverImage, { duration: 0.6, rotation: 0 })
      start()
    })

    const resize = () => {
      bikeContainer.x = window.innerWidth - bikeContainer.width
      bikeContainer.y = window.innerHeight - bikeContainer.height
    }
    window.addEventListener('resize', resize)
    resize()

    // 创建粒子
    const particleContainer = new PIXI.Container()
    particleContainer.rotation = (Math.PI / 180) * 35
    particleContainer.pivot.x = window.innerWidth / 2
    particleContainer.pivot.y = window.innerHeight / 2
    particleContainer.x = window.innerWidth / 2
    particleContainer.y = window.innerHeight / 2
    // particleContainer.fill = 0xff0000

    this.app.stage.addChild(particleContainer)
    const particles = []
    const colors = [0xf1cf54, 0xb5cea8, 0xf1cf54, 0xff0000]
    for (let i = 0; i < 10; i++) {
      let gr = new PIXI.Graphics()
      gr.beginFill(colors[Math.floor(Math.random() * colors.length)])
      gr.drawCircle(0, 0, 6)
      gr.endFill()
      const pItem = {
        sx: Math.random() * window.innerWidth,
        sy: Math.random() * window.innerHeight,
        gr: gr,
      }
      gr.x = pItem.sx
      gr.y = pItem.sy
      particleContainer.addChild(gr)
      particles.push(pItem)
    }
    let speed = 0
    function loop() {
      speed += 0.5
      speed = Math.min(speed, 30)
      for (let i = 0; i < particles.length; i++) {
        let pItem = particles[i]
        pItem.gr.y += speed
        if (speed >= 20) {
          pItem.gr.scale.y = 30
          pItem.gr.scale.x = 0.05
        }

        if (pItem.gr.y > window.innerHeight) {
          pItem.gr.y = 0
        }
      }
    }

    function start() {
      speed = 0
      gsap.ticker.add(loop)
    }

    function pause() {
      gsap.ticker.remove(loop)
      for (let i = 0; i < particles.length; i++) {
        let pItem = particles[i]
        pItem.gr.scale.y = 1
        pItem.gr.scale.x = 1
        gsap.to(pItem.gr, { duration: 0.6, x: pItem.sx, y: pItem.sy, ease: 'elastic.out' })
      }
    }
    start()
    // gsap.ticker.add(loop)
  }

  createActionButton() {
    const actionButton = new PIXI.Container()

    const btnImage = new PIXI.Sprite(this.loader.resources['btn.png'].texture)
    const btnCircleImage = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture)
    const btnCircleImage2 = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture)
    // this.app.stage.addChild(btn)
    // this.app.stage.addChild(btnCircle)
    actionButton.addChild(btnImage)
    actionButton.addChild(btnCircleImage)
    actionButton.addChild(btnCircleImage2)

    btnImage.pivot.y = btnImage.pivot.x = btnImage.width / 2
    btnCircleImage.pivot.y = btnCircleImage.pivot.x = btnCircleImage.width / 2
    btnCircleImage2.pivot.y = btnCircleImage2.pivot.x = btnCircleImage.width / 2

    btnCircleImage.scale.x = btnCircleImage.scale.y = 0.8
    gsap.to(btnCircleImage.scale, { duration: 1, x: 1.3, y: 1.3, repeat: -1 })
    gsap.to(btnCircleImage, { duration: 1, alpha: 0, repeat: -1 })

    return actionButton
  }
}
