import log from './log'

export const resizeImage = (cv, matSrc, isSingle) => {
  let resizedImg = new cv.Mat()
  // log('matSrc.size().height: ', matSrc.size().height)
  // log('matSrc.size().width: ', matSrc.size().width)
  // log('isSingle: ', isSingle)
  let sz
  if (isSingle) {
    sz = new cv.Size(345, (matSrc.size().height * 345) / matSrc.size().width)
  } else {
    sz = new cv.Size(280, (matSrc.size().height * 280) / matSrc.size().width)
  }
  cv.resize(matSrc, resizedImg, sz)
  // log('matSrc.size().height: ', resizedImg.size().height)
  // log('matSrc.size().width: ', resizedImg.size().width)

  cv.cvtColor(resizedImg, resizedImg, cv.COLOR_RGBA2GRAY)
  return resizedImg
}

export const detectCircles = (cv, matSrc, minDist = 18) => {
  const imgMat = matSrc.clone()
  cv.medianBlur(matSrc, imgMat, 1)
  // log('imgMat before applying threshold', imgMat)

  let kernel = cv.Mat.ones(1, 1, cv.CV_8U)
  cv.erode(imgMat, imgMat, kernel)
  cv.threshold(imgMat, imgMat, 130, 255, cv.THRESH_OTSU)

  // cv.imshow('workingCanvas', imgMat);
  log('imgMat before detecting circles', imgMat)
  log('minDist ************************************ minDist', minDist)

  let circles = new cv.Mat()
  cv.HoughCircles(
    imgMat,
    circles,
    cv.HOUGH_GRADIENT,
    1,
    minDist,
    15,
    11,
    7.5,
    15
  )
  let circleArray = []

  let totalX = 0
  for (let i = 0; i < circles.cols; i++) {
    let x = circles.data32F[i * 3]
    totalX += x
  }

  const averageX = totalX / circles.cols

  const pink = new cv.Scalar(255, 153, 255)

  cv.cvtColor(imgMat, imgMat, cv.COLOR_GRAY2RGB)

  for (let i = 0; i < circles.cols; i++) {
    let x = circles.data32F[i * 3]
    let y = circles.data32F[i * 3 + 1]
    let radius = circles.data32F[i * 3 + 2]
    let center = new cv.Point(x, y)

    if (x > averageX - 68) {
      circleArray.push({ center: center, radius: radius })
      cv.circle(imgMat, center, radius, pink, 3)
    }
  }
  log('imgMat after detecting circles', imgMat)
  circleArray.sort(
    (firstItem, secondItem) => firstItem.center.y - secondItem.center.y
  )

  // the following logic assumes there would be always at-least 2 circles in a row
  const validCircles = []
  let row = []
  for (let i = 0; i < circleArray.length; ++i) {
    if (i === 0) {
      row.push(circleArray[i])
      continue
    }
    const delta = circleArray[i].center.y - circleArray[i - 1].center.y
    if (delta < 2.5) {
      row.push(circleArray[i])
    } else {
      if (row.length > 1) {
        validCircles.push(...row)
      }
      row = [circleArray[i]]
    }
  }
  if (row.length > 1) {
    validCircles.push(...row)
  }

  // const validCircles = circleArray

  circles.delete()
  imgMat.delete()
  return validCircles
}

export const detectRectangles = (cv, matSrc, inchUnit) => {
  let contours = new cv.MatVector()
  let hierarchy = new cv.Mat()
  cv.findContours(
    matSrc,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_NONE
  )

  let poly = new cv.MatVector()
  let rectArray = []

  for (let i = 0; i < contours.size(); ++i) {
    let tmp = new cv.Mat()
    let cnt = contours.get(i)
    cv.approxPolyDP(cnt, tmp, 3, true)

    let rect = cv.boundingRect(tmp)
    if (
      rect.width > inchUnit * 5 &&
      rect.width < inchUnit * 8 &&
      rect.height > inchUnit * 4 &&
      rect.x > 0 &&
      rect.y > 0 &&
      rect.y < 50
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
  const arrRectangularBoundingRegionsPoints = []

  let sumOfRadius = 0
  let circleCount = 0
  arrAnswerCircles.forEach((circlesOfAnswer) => {
    circlesOfAnswer.forEach((circle) => {
      circleCount = circleCount + 1
      sumOfRadius = sumOfRadius + circle.radius
    })
  })
  const radius = parseInt(sumOfRadius / circleCount)
  arrAnswerCircles.forEach((circlesOfAnswer) => {
    if (circlesOfAnswer.length === 0) {
      return
    }
    if (circlesOfAnswer[0].center.y - 10 < 0 || leftPointX - 10 < 0) {
      return
    }
    let temp = circlesOfAnswer
    temp.sort(
      (firstItem, secondItem) => firstItem.center.y - secondItem.center.y
    )

    const topCircle = temp[temp.length - 1]
    // const leftCircle = circlesOfAnswer[0];
    // const rightCircle = circlesOfAnswer[circlesOfAnswer.length - 1];

    let width = rightPointX + radius - (leftPointX - radius)
    let height = radius * 2
    let rect = new cv.Rect(
      leftPointX - radius,
      topCircle.center.y - radius,
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
    arrRectangularBoundingRegionsPoints.push(rect)
    // arrRectangularBoundingRegions.push(rect);
  })

  return [arrRectangularBoundingRegions, arrRectangularBoundingRegionsPoints]
}

export const getTrueCirclesInRow = (cv, croppedImg) => {
  //log("hulahula", croppedImg)
  const width = croppedImg.size().width
  const height = croppedImg.size().height
  const radius = parseInt(height / 2) - 3
  let result = ''
  let copyForMark = new cv.Mat()
  croppedImg.copyTo(copyForMark)
  let circlesInCropped = new cv.Mat()

  // cv.medianBlur(croppedImg, croppedImg, 3);
  // let kernel = cv.Mat.ones(1 , 1, cv.CV_8U);
  // cv.erode(copyForMark, copyForMark, kernel);
  // cv.threshold(copyForMark, copyForMark, 140, 255, cv.THRESH_OTSU);

  let kernel = cv.Mat.ones(1, 1, cv.CV_8U)
  cv.erode(croppedImg, croppedImg, kernel)

  cv.HoughCircles(
    croppedImg,
    circlesInCropped,
    cv.HOUGH_GRADIENT,
    1,
    20,
    13,
    14,
    7.5,
    15
  )

  let circleArray = []

  for (let i = 0; i < circlesInCropped.cols; i++) {
    const x = circlesInCropped.data32F[i * 3]
    const y = circlesInCropped.data32F[i * 3 + 1]
    // const y = height / 2;
    const center = new cv.Point(x, y)
    // cv.circle(croppedImg, {x: x, y: y}, radius, [0 ,0 ,0, 255], -1);
    circleArray.push({ center: center, radius })
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
      widthOfCropped = width - x + radius - 1
    } else {
      widthOfCropped = radius * 2 - 1
    }
    if (y + radius > height) {
      heightOfCropped = height - y + radius - 1
    } else {
      heightOfCropped = radius * 2 - 1
    }

    const rect = new cv.Rect(starPtX, starPtY, widthOfCropped, heightOfCropped)
    let cropped = new cv.Mat()
    cv.threshold(croppedImg, croppedImg, 130, 255, cv.THRESH_OTSU)
    cropped = croppedImg.roi(rect).clone()
    let whiteCount = 1
    let blackCount = 1
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
      blackCount,
      whiteCount,
      maxConfidence,
    })
    cropped.delete()
  })
  const items = []

  const items = []

  arrCirclesInfo.forEach((item, index) => {
    // log("arrCirclesInfo, item, maxConfidence - item.confidence,item.confidence, maxConfidenc, image ", arrCirclesInfo, item, maxConfidence - item.confidence,item.confidence, maxConfidence, croppedImg )
    if (maxConfidence > 0.37) {
      // if (maxConfidence - item.confidence < 0.08 || item.confidence > 0.5) {
      if (item.confidence > 0.5) {
        result = result + ' ' + item.letter
        items.push(circleArray[index])
      }
    }
  })

  copyForMark.delete()
  circlesInCropped.delete()
  return [result.trim(), items]
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
