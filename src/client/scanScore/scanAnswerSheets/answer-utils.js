import {
  detectCircles,
  detectRectangles,
  getBoundingRegionsWithCircles,
  getTrueCirclesInRow,
  resizeImage,
} from './process-image'
import {
  detectQRCode,
  drawRegionOfQR,
  getAngleOfQR,
  getWidthOfQR,
  qrRectWidth,
  rectPadding,
} from './parse-qrcode'

export const getAnswers = (cv, srcMat, isSingle) => {
  try {
    let resizedImage = resizeImage(cv, srcMat, isSingle) // resize image

    const circleArray = detectCircles(cv, resizedImage)
    const arrAnswerCircles = groupCirclesByAnswer(circleArray)
    const arrBoundingRegions = getBoundingRegionsWithCircles(
      cv,
      resizedImage,
      circleArray,
      arrAnswerCircles
    )

    let arrAnswers = []

    arrBoundingRegions.forEach((region, index) => {
      // if(index === 12) {
      //     const answer = getTrueCirclesInRow(cv, region);
      //     arrAnswers.push(answer);
      // }
      const answer = getTrueCirclesInRow(cv, region)
      arrAnswers.push(answer)
    })
    resizedImage.delete()
    return arrAnswers
  } catch (e) {
    return []
  }
}

export const getAnswersFromVideo = (cv, matSrc, isFronFacing) => {
  let matImg = new cv.Mat()
  cv.cvtColor(matSrc, matImg, cv.COLOR_RGBA2GRAY, 0)
  cv.blur(matImg, matImg, new cv.Size(1, 1))

  cv.threshold(matImg, matImg, 115, 255, cv.THRESH_TOZERO)
  cv.threshold(matImg, matImg, 115, 255, cv.THRESH_OTSU)

  let kernel = cv.Mat.ones(7, 7, cv.CV_8U)
  cv.erode(matImg, matImg, kernel)

  let angleOfQR = 0
  let widthOfQR = 0

  let qrCodeData = detectQRCode(cv, matSrc)
  let startPtQR = null
  let inchUnit = 0
  let center = new cv.Point(matImg.cols / 2, matImg.rows / 2)

  if (qrCodeData) {
    angleOfQR = getAngleOfQR(
      qrCodeData.location.bottomRightCorner,
      qrCodeData.location.bottomLeftCorner,
      {
        x: qrCodeData.location.bottomLeftCorner.x,
        y: qrCodeData.location.bottomRightCorner.y,
      }
    )

    widthOfQR = getWidthOfQR(
      qrCodeData.location.bottomRightCorner,
      qrCodeData.location.bottomLeftCorner
    )
    startPtQR = new cv.Point(
      qrCodeData.location.topLeftCorner.x + matSrc.size().width - qrRectWidth,
      qrCodeData.location.topLeftCorner.y
    )

    const angleOfTopLeftPt = getAngleOfQR(startPtQR, center, {
      x: center.x,
      y: startPtQR.y,
    })
    const lengthToPt = Math.sqrt(
      (startPtQR.x - center.x) * (startPtQR.x - center.x) +
        (startPtQR.y - center.y) * (startPtQR.y - center.y)
    )
    const realAngle = angleOfTopLeftPt - angleOfQR

    startPtQR = new cv.Point(
      parseInt(Math.cos((realAngle * Math.PI) / 180) * lengthToPt) + center.x,
      parseInt(Math.sin((realAngle * Math.PI) / 180) * lengthToPt)
    )

    inchUnit = widthOfQR / 2.75
  } else {
    // if(isShowNotification) {
    //     return;
    // }
    // isShowNotification = true;
    // store.addNotification({
    //     id: "notification",
    //     title: "Please QR code in blue rectangle region.",
    //     message: " ",
    //     type: "danger",
    //     insert: "top",
    //     container: "top-right",
    //     animationIn: ["animate__animated", "animate__fadeIn"],
    //     animationOut: ["animate__animated", "animate__fadeOut"],
    //     dismiss: {
    //         duration: 5000,
    //         onScreen: true
    //     },
    //     onRemoval: () => {
    //         isShowNotification = false;
    //     }
    // });
  }

  // rotate the image to detect parent rectangle of bubbles.
  let dSize = new cv.Size(matImg.cols, matImg.rows)
  let M = cv.getRotationMatrix2D(center, angleOfQR * -1, 1)

  cv.warpAffine(
    matImg,
    matImg,
    M,
    dSize,
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar()
  )
  cv.warpAffine(
    matSrc,
    matSrc,
    M,
    dSize,
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar()
  )

  let resultOfAnswers = []
  if (inchUnit > 0) {
    let lRectangleRect = new cv.Rect(
      parseInt(startPtQR.x - inchUnit * 16.75),
      parseInt(0),
      parseInt(9 * inchUnit),
      parseInt(matSrc.size().height)
    )
    let rRectangleRect = new cv.Rect(
      parseInt(startPtQR.x - inchUnit * 8.75),
      parseInt(0),
      parseInt(9 * inchUnit),
      parseInt(matSrc.size().height)
    )

    if (lRectangleRect.x < 0) {
      lRectangleRect.x = 0
    }
    if (lRectangleRect.y < 0) {
      lRectangleRect.y = 0
    }
    if (lRectangleRect.y + lRectangleRect.height > matSrc.size().height) {
      lRectangleRect.height = matSrc.size().height - lRectangleRect.y
    }
    if (rRectangleRect.y < 0) {
      rRectangleRect.y = 0
    }
    if (rRectangleRect.y + rRectangleRect.height > matSrc.size().height) {
      rRectangleRect.height = matSrc.size().height - rRectangleRect.y
    }

    if (
      lRectangleRect.x >= 0 &&
      lRectangleRect.y >= 0 &&
      lRectangleRect.x + lRectangleRect.width <= matSrc.size().width &&
      lRectangleRect.y + lRectangleRect.height <= matSrc.size().height
    ) {
      const lRectCropped = matImg.roi(lRectangleRect)
      const rRectCropped = matImg.roi(rRectangleRect)
      // cv.imshow('workingCanvas', rRectCropped);
      const leftRectArray = detectRectangles(cv, lRectCropped, widthOfQR)
      const rightRectArray = detectRectangles(cv, rRectCropped, widthOfQR)
      leftRectArray.forEach((item) => {
        item.x = item.x + lRectangleRect.x
        item.y = item.y + lRectangleRect.y
      })
      rightRectArray.forEach((item) => {
        item.x = item.x + rRectangleRect.x
        item.y = item.y + rRectangleRect.y
      })
      let isSingle = false
      if (rightRectArray.length === 0) {
        isSingle = true
      }
      const rectArray = [...leftRectArray, ...rightRectArray]
      const arrCroppedParentRect = getTrulyRectangles(
        cv,
        matSrc,
        rectArray,
        isSingle
      )
      resultOfAnswers = getAnswersFromRect(
        cv,
        arrCroppedParentRect,
        matSrc,
        qrCodeData
      )
    }
  }

  M = cv.getRotationMatrix2D(center, angleOfQR, 1)
  cv.warpAffine(
    matSrc,
    matSrc,
    M,
    dSize,
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar()
  )

  drawRegionOfQR(cv, matSrc, isFronFacing)
  try {
    cv.imshow('canvasOutput', matSrc)
  } catch (e) {
    if (
      !e?.message?.startsWith('Please input the valid canvas element or id')
    ) {
      throw e
    }
  }

  M.delete()
  matImg.delete()
  return resultOfAnswers
}

const groupCirclesByAnswer = (circleArray) => {
  let arrAnswerCircles = []
  let currentPosY = 0

  if (circleArray.length > 0) {
    currentPosY = circleArray[0].center.y
  } else {
    return arrAnswerCircles
  }

  let rowCircles = []
  circleArray.forEach((circle) => {
    if (Math.abs(circle.center.y - currentPosY) < 5) {
      rowCircles.push(circle)
    } else {
      if (circleArray.length > 0) {
        arrAnswerCircles.push(rowCircles)
        rowCircles = []
        currentPosY = circle.center.y
      }
    }
  })

  if (circleArray.length > 0) {
    arrAnswerCircles.push(rowCircles)
    rowCircles = []
  }

  return arrAnswerCircles
}

const getTrulyRectangles = (cv, matSrc, rectArray, isSingle) => {
  let resultOfCroppedParentRect = []
  if (rectArray.length > 0) {
    // parse: paper is single or multi rectangle
    rectArray.sort((firstItem, secondItem) => firstItem.x - secondItem.x)
    if (isSingle) {
      cv.rectangle(
        matSrc,
        { x: rectArray[0].x, y: rectArray[0].y },
        {
          x: rectArray[0].x + rectArray[0].width,
          y: rectArray[0].y + rectArray[0].height,
        },
        [0, 255, 0, 255],
        1
      )
      let croppedRectangle = matSrc.roi(rectArray[0])
      resultOfCroppedParentRect.push(croppedRectangle)
    } else {
      if (rectArray.length > 1) {
        let arrCroppedParentRect = []
        arrCroppedParentRect.push(rectArray[0])
        for (let i = 0; i < rectArray.length - 1; i++) {
          if (rectArray[i + 1].x - rectArray[i].x > 150) {
            arrCroppedParentRect.push(rectArray[i + 1])
          }
        }
        if (arrCroppedParentRect.length > 1) {
          let croppedLeft = matSrc.roi(arrCroppedParentRect[0])
          let croppedRight = matSrc.roi(rectArray[rectArray.length - 1])
          resultOfCroppedParentRect.push(croppedLeft)
          resultOfCroppedParentRect.push(croppedRight)
          arrCroppedParentRect.forEach((item) => {
            cv.rectangle(
              matSrc,
              { x: item.x, y: item.y },
              {
                x: item.x + item.width,
                y: item.y + item.height,
              },
              [0, 255, 0, 255],
              1
            )
          })
        } else {
          arrCroppedParentRect.forEach((item) => {
            cv.rectangle(
              matSrc,
              { x: item.x, y: item.y },
              {
                x: item.x + item.width,
                y: item.y + item.height,
              },
              [255, 0, 0, 255],
              1
            )
          })
        }
      } else {
        rectArray.forEach((item) => {
          cv.rectangle(
            matSrc,
            { x: item.x, y: item.y },
            {
              x: item.x + item.width,
              y: item.y + item.height,
            },
            [255, 0, 0, 255],
            1
          )
        })
      }
    }
  }
  return resultOfCroppedParentRect
}

const getAnswersFromRect = (cv, arrCroppedParentRect, matSrc, qrCodeData) => {
  let resultOfAnswers
  if (arrCroppedParentRect.length === 1) {
    // single
    const answers = getAnswers(cv, arrCroppedParentRect[0], true)
    if (!answers) {
      return
    }
    resultOfAnswers = { answers: answers, qrCode: qrCodeData.data }
    arrCroppedParentRect[0].delete()
  } else if (arrCroppedParentRect.length === 2) {
    // multi
    const leftRectangle = arrCroppedParentRect[0]
    const rightRectangle = arrCroppedParentRect[1]
    const leftAnswers = getAnswers(cv, leftRectangle, false)
    const rightAnswers = getAnswers(cv, rightRectangle, false)
    if (!leftAnswers || !rightAnswers) {
      return
    }
    leftRectangle.delete()
    rightRectangle.delete()
    if (!leftAnswers || !rightAnswers) {
      return
    }
    resultOfAnswers = {
      answers: [...leftAnswers, ...rightAnswers],
      qrCode: qrCodeData.data,
    }
  }
  return resultOfAnswers
}
