const ImgEdit = (() => {
  return {
    init () {
      this.selectEle()
      this.bindEvent()
    },
    $ (ele) {
      return document.querySelector(ele)
    },
    $$ (ele) {
      return document.querySelectorAll(ele)
    },
    selectEle () {
      this.fileInput = this.$('.file-input')
      this.filterOptions = this.$$('.filter button')
      this.filterName = this.$('.filter-info .name')
      this.filterValue = this.$('.filter-info .value')
      this.filterSlider = this.$('.slider input')
      this.rotateOptions = this.$$('.rotate button')
      this.previewImg = this.$('.preview-img img')
      this.resetFilterBtn = this.$('.reset-filter')
      this.chooseImgBtn = this.$('.choose-img')
      this.saveImgBtn = this.$('.save-img')
    },
    bindEvent () {
      // 进度条
      this.filterSlider.addEventListener('input', this.updateFilter.bind(this))
      this.resetFilterBtn.addEventListener('click', this.resetFilter.bind(this))
      // 保存图片
      this.saveImgBtn.addEventListener('click', this.saveImage.bind(this))
      // 上传图像
      this.fileInput.addEventListener('change', this.loadImage.bind(this))
      // 选择图像
      this.chooseImgBtn.addEventListener('click', () => this.fileInput.click())

      // 亮度、饱和度、反相、灰度
      this.filterOptions.forEach(option => {
        option.addEventListener('click', () => {
          // 点击当前高亮
          document.querySelector('.active').classList.remove('active')
          option.classList.add('active')
          // 展示当前选项文案
          this.filterName.innerText = option.innerText

          if (option.id === 'brightness') {
            // 设置进度条最大值
            this.filterSlider.max = '200'
            // 设置进度条
            this.filterSlider.value = brightness
            // 设置数值展示
            this.filterValue.innerText = `${brightness}%`
          } else if (option.id === 'saturation') {
            this.filterSlider.max = '200'
            this.filterSlider.value = saturation
            this.filterValue.innerText = `${saturation}%`
          } else if (option.id === 'inversion') {
            this.filterSlider.max = '100'
            this.filterSlider.value = inversion
            this.filterValue.innerText = `${inversion}%`
          } else {
            this.filterSlider.max = '100'
            this.filterSlider.value = grayscale
            this.filterValue.innerText = `${grayscale}%`
          }
        })
      })

      this.rotateOptions.forEach(option => {
        option.addEventListener('click', () => {
          if (option.id === 'left') {
            rotate -= 90
          } else if (option.id === 'right') {
            rotate += 90
          } else if (option.id === 'horizontal') {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1
          } else {
            flipVertical = flipVertical === 1 ? -1 : 1
          }
          this.applyFilter()
        })
      })
    },
    updateFilter () {
      // 数值展示
      this.filterValue.innerText = `${this.filterSlider.value}%`
      const selectedFilter = document.querySelector('.filter .active')
      if (selectedFilter.id === 'brightness') {
        // 亮度
        brightness = this.filterSlider.value
      } else if (selectedFilter.id === 'saturation') {
        // 饱和度
        saturation = this.filterSlider.value
      } else if (selectedFilter.id === 'inversion') {
        // 反相
        inversion = this.filterSlider.value
      } else {
        // 灰度
        grayscale = this.filterSlider.value
      }
      this.applyFilter()
    },
    applyFilter () {
      // 处理选项
      this.previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
      // 处理旋转 & 翻转
      this.previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`
    },
    resetFilter () {
      brightness = '100'
      saturation = '100'
      inversion = '0'
      grayscale = '0'
      rotate = 0
      flipHorizontal = 1
      flipVertical = 1
      this.filterOptions[0].click()
      this.applyFilter()
    },
    saveImage () {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = this.previewImg.naturalWidth
      canvas.height = this.previewImg.naturalHeight

      ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
      ctx.translate(canvas.width / 2, canvas.height / 2)
      if (rotate !== 0) {
        ctx.rotate((rotate * Math.PI) / 180)
      }
      ctx.scale(flipHorizontal, flipVertical)
      ctx.drawImage(
        this.previewImg,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      )

      const link = document.createElement('a')
      link.download = 'image.jpg'
      link.href = canvas.toDataURL()
      link.click()
    },
    loadImage () {
      let file = this.fileInput.files[0]
      if (!file) return
      this.previewImg.src = URL.createObjectURL(file)
      this.previewImg.addEventListener('load', () => {
        // 点击重置选项
        this.resetFilterBtn.click()
        // 去掉禁用样式
        document.querySelector('.container').classList.remove('disable')
      })
    }
  }
})()

ImgEdit.init()
