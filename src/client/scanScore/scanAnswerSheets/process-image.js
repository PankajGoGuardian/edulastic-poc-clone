export const resizeImage = (cv, matSrc, isSingle) => {
  let resizedImg = new cv.Mat()
  let sz
  if (isSingle) {
    sz = new cv.Size(345, (matSrc.size().height * 345) / matSrc.size().width)
  } else {
    sz = new cv.Size(280, (matSrc.size().height * 280) / matSrc.size().width)
  }
  cv.resize(matSrc, resizedImg, sz)

  cv.cvtColor(resizedImg, resizedImg, cv.COLOR_RGBA2GRAY)
  return resizedImg
}

export const detectCircles = (cv, matSrc) => {
  const imgMat = new cv.Mat()
  cv.medianBlur(matSrc, imgMat, 3)
  cv.threshold(imgMat, imgMat, 250, 255, cv.THRESH_OTSU)
  let kernel = cv.Mat.ones(1, 1, cv.CV_8U)
  cv.erode(imgMat, imgMat, kernel)

  let circles = new cv.Mat()
  cv.HoughCircles(imgMat, circles, cv.HOUGH_GRADIENT, 1, 17, 15, 11, 7, 15)
  let circleArray = []

  let totalX = 0
  for (let i = 0; i < circles.cols; i++) {
    let x = circles.data32F[i * 3]
    totalX += x
  }

  const average = totalX / circles.cols

  for (let i = 0; i < circles.cols; i++) {
    let x = circles.data32F[i * 3]
    let y = circles.data32F[i * 3 + 1]
    let radius = circles.data32F[i * 3 + 2]
    let center = new cv.Point(x, y)

    if (x > average - 62) {
      circleArray.push({ center: center, radius: radius })
    }
  }

  circleArray.sort(
    (firstItem, secondItem) => firstItem.center.y - secondItem.center.y
  )

  circles.delete()
  imgMat.delete()
  return circleArray
}

export const detectRectangles = (cv, matSrc, widthOfQR) => {
  let contours = new cv.MatVector()
  let hierarchy = new cv.Mat()
  cv.findContours(
    matSrc,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  )

  let poly = new cv.MatVector()
  let rectArray = []

  for (let i = 0; i < contours.size(); ++i) {
    let tmp = new cv.Mat()
    let cnt = contours.get(i)
    cv.approxPolyDP(cnt, tmp, 3, true)

    let rect = cv.boundingRect(tmp)
    if (
      rect.width > widthOfQR * 2 &&
      rect.width < widthOfQR * 3.3 &&
      rect.height > widthOfQR &&
      rect.x > 0 &&
      rect.y > 0
    ) {
      rectArray.push(rect)
    }

    poly.push_back(tmp)
    cnt.delete()
    tmp.delete()
  }
  hierarchy.delete()
  contours.delete()
  return rectArray
}

export const getBoundingRegionsWithCircles = (
  cv,
  matSrc,
  arrCircles,
  arrAnswerCircles
) => {
  arrCircles.sort(
    (firstItem, secondItem) => firstItem.center.x - secondItem.center.x
  )

  const leftPointX = arrCircles[0].center.x
  const rightPointX = arrCircles[arrCircles.length - 1].center.x
  arrCircles.sort(
    (firstItem, secondItem) => firstItem.center.y - secondItem.center.y
  )

  let arrRectangularBoundingRegions = []

  arrAnswerCircles.forEach((circlesOfAnswer) => {
    if (circlesOfAnswer.length === 0) {
      return
    }
    if (circlesOfAnswer[0].center.y - 10 < 0 || leftPointX - 10 < 0) {
      return
    }
    const leftCircle = circlesOfAnswer[0]
    const rightCircle = circlesOfAnswer[circlesOfAnswer.length - 1]
    let width =
      rightPointX + rightCircle.radius - (leftPointX - leftCircle.radius)
    let height = rightCircle.radius + leftCircle.radius
    let rect = new cv.Rect(
      leftPointX - leftCircle.radius,
      leftCircle.center.y - leftCircle.radius,
      width,
      height
    )

    let croppedImg = null
    try {
      croppedImg = matSrc.roi(rect)
    } catch (e) {
      // TODO: need to fix later
      // console.log(e);
      // console.log(rect);
    }
    if (!croppedImg) {
      return
    }
    arrRectangularBoundingRegions.push(croppedImg)
  })

  return arrRectangularBoundingRegions
}

export const getTrueCirclesInRow = (cv, croppedImg) => {
  const width = croppedImg.size().width
  const height = croppedImg.size().height
  const radius = parseInt(height / 2) - 3
  let result = ''
  let copyForMark = new cv.Mat()
  croppedImg.copyTo(copyForMark)
  cv.blur(copyForMark, copyForMark, new cv.Size(11, 11))
  let circlesInCropped = new cv.Mat()
  cv.HoughCircles(
    croppedImg,
    circlesInCropped,
    cv.HOUGH_GRADIENT,
    1,
    17,
    15,
    11,
    7,
    15
  )

  let circleArray = []
  for (let i = 0; i < circlesInCropped.cols; i++) {
    const x = circlesInCropped.data32F[i * 3]
    // const y = circlesInCropped.data32F[i * 3 + 1];
    const y = height / 2
    const center = new cv.Point(x, y)

    circleArray.push({ center: center })
  }

  circleArray.sort(
    (firstItem, secondItem) => firstItem.center.x - secondItem.center.x
  )
  let maxConfidence = 0
  let arrCirclesInfo = []
  circleArray.forEach((item, index) => {
    const x = item.center.x
    const y = item.center.y
    let starPtX = x - radius
    let starPtY = y - radius
    let widthOfCropped = 0
    let heightOfCropped = 0
    if (starPtX < 0) {
      starPtX = 0
    }
    if (starPtY < 0) {
      starPtY = 0
    }
    if (x + radius > width) {
      widthOfCropped = width - x + radius
    } else {
      widthOfCropped = radius * 2
    }
    if (y + radius > height) {
      heightOfCropped = height - y + radius
    } else {
      heightOfCropped = radius * 2
    }
    // cv.circle(croppedImg, item.center, radius, new cv.Scalar(255, 0, 0), -1);
    const rect = new cv.Rect(starPtX, starPtY, widthOfCropped, heightOfCropped)
    let cropped = new cv.Mat()
    cv.threshold(croppedImg, croppedImg, 130, 255, cv.THRESH_OTSU)
    cropped = croppedImg.roi(rect).clone()
    let whiteCount = 0
    let blackCount = 0
    for (let y1 = 0; y1 < cropped.size().height; y1++) {
      for (let x1 = 0; x1 < cropped.size().width; x1++) {
        if (isPointInCircle(x1, y1, radius)) {
          const color =
            cropped.data[
              y1 * cropped.cols * cropped.channels() + x1 * cropped.channels()
            ]
          if (color < 130) {
            // cropped.data[y1 * cropped.cols * cropped.channels() + x1 * cropped.channels()] = 0;
            blackCount++
          } else {
            // cropped.data[y1 * cropped.cols * cropped.channels() + x1 * cropped.channels()] = 255;
            whiteCount++
          }
        }
      }
    }
    if (maxConfidence < blackCount / (blackCount + whiteCount)) {
      maxConfidence = blackCount / (blackCount + whiteCount)
    }
    const letter = String.fromCharCode(index + 65)
    arrCirclesInfo.push({
      letter: letter,
      confidence: blackCount / (blackCount + whiteCount),
    })
    // cv.imshow('rowCanvas', croppedImg);
    cropped.delete()
  })

  // console.log(arrCirclesInfo);
  arrCirclesInfo.forEach((item, index) => {
    if (maxConfidence > 0.37) {
      if (maxConfidence - item.confidence < 0.08 || item.confidence > 0.5) {
        result = result + ' ' + item.letter
      }
    }
  })

  copyForMark.delete()
  circlesInCropped.delete()
  return result.trim()
}

const isPointInCircle = (x, y, radius) => {
  const x2 = (x - radius) * (x - radius)
  const y2 = (y - radius) * (y - radius)
  if (Math.sqrt(x2 + y2) < radius) {
    return true
  } else {
    return false
  }
}
