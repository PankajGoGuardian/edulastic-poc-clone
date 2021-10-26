import {
  detectCircles,
  getBoundingRegionsWithCircles,
  getTrueCirclesInRow,
  getTrueCirclesInRowDuplicate,
  resizeImage,
} from './process-image'
import { getAngleOfQR, getWidthOfQR } from './parse-qrcode'
import { forwardRef } from 'react'

export const getAnswers = (cv, srcMat, isSingle) => {
  let resizedImage = resizeImage(cv, srcMat, isSingle) // resize image
  const circleArray = detectCircles(cv, resizedImage)

  const scaleX = srcMat.size().height / resizedImage.size().height
  const scaleY = srcMat.size().height / resizedImage.size().height

  // circleArray.forEach(item => {
  //     cv.circle(resizedImage, item.center, item.radius, [0, 0, 0, 255], -1);
  // });

  let arrAnswers = []

  if (circleArray.length === 0) {
    return arrAnswers
  }

  const arrAnswerCircles = groupCirclesByAnswer(circleArray)

  // arrAnswerCircles.forEach(rowArray => {
  //     rowArray.forEach(item => {
  //         cv.circle(resizedImage, item.center, item.radius, [255, 255, 255, 255], -1);
  //     })
  // });

  cv.imshow('workingCanvas', resizedImage)

  const [
    arrBoundingRegions,
    arrBoundingRegionsPoints,
  ] = getBoundingRegionsWithCircles(
    cv,
    resizedImage,
    circleArray,
    arrAnswerCircles
  )

  const arrAnswersPoints = []

  arrBoundingRegions.forEach((region, index) => {
    cv.imshow('rowCanvas', region)
    const [answer, items] = getTrueCirclesInRow(cv, region)
    items.forEach((item) => {
      arrAnswersPoints.push({
        x: (item.center.x + arrBoundingRegionsPoints[index].x) * scaleX,
        y: (item.center.y + arrBoundingRegionsPoints[index].y) * scaleY,
        radius: item.radius * scaleX,
      })
    })
    arrAnswers.push(answer)
  })
  // arrAnswersPoints.forEach(points => {
  //   let center = new cv.Point(points.x, points.y)
  //   cv.circle(resizedImage, center, points.radius, [0, 0, 0, 255], 3);
  // })
  cv.imshow('workingCanvas', resizedImage)
  resizedImage.delete()
  return [arrAnswers, arrAnswersPoints]
}

export const getAnswersFromVideo = (
  cv,
  matSrc,
  parentRectangle,
  qrCodePosition
) => {
  let angleOfQR = 0
  let center = new cv.Point(matSrc.cols / 2, matSrc.rows / 2)
  let resultOfAnswers = {}
  let resultOfAnswersPoints = []
  let rectStartPointX = 0
  let rectStartPointY = 0
  if (parentRectangle && qrCodePosition) {
    angleOfQR = getAngleOfQR(
      qrCodePosition.bottomRightCorner,
      qrCodePosition.bottomLeftCorner,
      {
        x: qrCodePosition.bottomLeftCorner.x,
        y: qrCodePosition.bottomRightCorner.y,
      }
    )
  } else {
    resultOfAnswers = { answers: [], qrCode: '', isQRCodeDetected: false }
  }

  // rotate the image to detect parent rectangle of bubbles.
  let dSize = new cv.Size(matSrc.cols, matSrc.rows)
  let M = cv.getRotationMatrix2D(center, angleOfQR * -1, 1)

  cv.warpAffine(
    matSrc,
    matSrc,
    M,
    dSize,
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar()
  )

  if (parentRectangle) {
    let startRectanglePt = new cv.Point(
      parentRectangle.topLeftCorner.x,
      parentRectangle.topLeftCorner.y
    )

    const angleOfTopLeftPt = getAngleOfQR(startRectanglePt, center, {
      x: center.x,
      y: startRectanglePt.y,
    })
    const lengthToPt = Math.sqrt(
      (startRectanglePt.x - center.x) * (startRectanglePt.x - center.x) +
        (startRectanglePt.y - center.y) * (startRectanglePt.y - center.y)
    )
    const realAngle = angleOfTopLeftPt + angleOfQR

    startRectanglePt = new cv.Point(
      center.x - parseInt(Math.cos((realAngle * Math.PI) / 180) * lengthToPt),
      center.y - parseInt(Math.sin((realAngle * Math.PI) / 180) * lengthToPt)
    )

    const width = getWidthOfQR(
      parentRectangle.bottomRightCorner,
      parentRectangle.bottomLeftCorner
    )
    const height = getWidthOfQR(
      parentRectangle.topLeftCorner,
      parentRectangle.bottomLeftCorner
    )

    let arrCroppedParentRect = []

    if (width > height) {
      // multi
      const leftRect = new cv.Rect(
        startRectanglePt.x,
        startRectanglePt.y,
        parseInt(width / 2),
        parseInt(height)
      )
      const rightRect = new cv.Rect(
        startRectanglePt.x + parseInt(width / 2),
        startRectanglePt.y,
        parseInt(width / 2),
        parseInt(height)
      )

      const croppedLeftRect = matSrc.roi(leftRect)
      const croppedRightRect = matSrc.roi(rightRect)

      croppedLeftRect.convertTo(croppedLeftRect, -1, 1, 30)
      croppedRightRect.convertTo(croppedRightRect, -1, 1, 30)

      arrCroppedParentRect.push(croppedLeftRect)
      arrCroppedParentRect.push(croppedRightRect)
    } else {
      // single
      const leftRect = new cv.Rect(
        startRectanglePt.x,
        startRectanglePt.y,
        parseInt(width),
        parseInt(height)
      )
      const croppedLeftRect = matSrc.roi(leftRect)
      croppedLeftRect.convertTo(croppedLeftRect, -1, 1, 30)
      arrCroppedParentRect.push(croppedLeftRect)
      rectStartPointX = leftRect.x
      rectStartPointY = leftRect.y
    }
    // const arrCroppedParentRect =  getTrulyRectangles(cv, matSrc, rectArray, true);
    if (arrCroppedParentRect) {
      ;[resultOfAnswers, resultOfAnswersPoints] = getAnswersFromRect(
        cv,
        arrCroppedParentRect,
        matSrc,
        parentRectangle
      )
    }
  }

  // M = cv.getRotationMatrix2D(center, angleOfQR, 1);
  // cv.warpAffine(matSrc, matSrc, M, dSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

  // if(inchUnit > 0) {
  //
  //     // let lRectangleRect = new cv.Rect(parseInt(startPtQR.x) + parseInt(inchUnit * 14.5), parseInt(startPtQR.y) - parseInt(inchUnit * 1), parseInt(8 * inchUnit), parseInt(inchUnit * 12.5));
  //     // let rRectangleRect = new cv.Rect(parseInt(startPtQR.x) + parseInt(inchUnit * 8), parseInt(startPtQR.y) - parseInt(inchUnit * 1), parseInt(8 * inchUnit), parseInt(inchUnit * 12.5));
  //     //
  //     // if(lRectangleRect.x < 0) {
  //     //     lRectangleRect.x = 0;
  //     // }
  //     // if(lRectangleRect.y < 0) {
  //     //     lRectangleRect.y = 0;
  //     // }
  //     // if(lRectangleRect.y + lRectangleRect.height > matSrc.size().height) {
  //     //     lRectangleRect.height = matSrc.size().height - lRectangleRect.y;
  //     // }
  //     // if(rRectangleRect.y < 0) {
  //     //     rRectangleRect.y = 0;
  //     // }
  //     // if(rRectangleRect.y + rRectangleRect.height > matSrc.size().height) {
  //     //     rRectangleRect.height = matSrc.size().height - rRectangleRect.y;
  //     // }
  //     //
  //     // if(lRectangleRect.x >= 0 && lRectangleRect.y >= 0 && lRectangleRect.x + lRectangleRect.width <= matSrc.size().width && lRectangleRect.y + lRectangleRect.height <= matSrc.size().height) {
  //     //     const lRectCropped = matSrc.roi(lRectangleRect);
  //     //     const rRectCropped = matSrc.roi(rRectangleRect);
  //     //
  //     //     cv.imshow('workingCanvas', lRectCropped);
  //     //
  //     //     const leftRectArray = detectRectangles(cv, lRectCropped, inchUnit);
  //     //     const rightRectArray = detectRectangles(cv, rRectCropped, inchUnit);
  //     //     lRectCropped.delete();
  //     //     rRectCropped.delete();
  //     //     leftRectArray.forEach((item) => {
  //     //         item.x = item.x + lRectangleRect.x;
  //     //         item.y = item.y + lRectangleRect.y;
  //     //     });
  //     //     rightRectArray.forEach((item) => {
  //     //         item.x = item.x + rRectangleRect.x;
  //     //         item.y = item.y + rRectangleRect.y;
  //     //     });
  //     //     let isSingle = false;
  //     //     if(rightRectArray.length === 0) {
  //     //         isSingle = true;
  //     //     }
  //     //     const rectArray = [...leftRectArray, ...rightRectArray];
  //     //     const arrCroppedParentRect =  getTrulyRectangles(cv, matSrc, rectArray, isSingle, inchUnit);
  //     //     if(arrCroppedParentRect) {
  //     //         resultOfAnswers = getAnswersFromRect(cv, arrCroppedParentRect, matSrc, parentRectangle);
  //     //     }
  //     // }
  // }
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

  resultOfAnswersPoints.forEach((points) => {
    let center = new cv.Point(
      points.x + rectStartPointX,
      points.y + rectStartPointY
    )
    cv.circle(matSrc, center, points.radius + 2, [255, 255, 0, 128], 2)
  })
  // matSrc = cv.addWeighted(matSrc, 1.0, overlayImg, 0.25, 1, addWeightedMat)

  cv.imshow('canvasOutput', matSrc)

  M.delete()
  return resultOfAnswers
}

export const groupCirclesByAnswer = (circleArray) => {
  let arrAnswerCircles = []
  let currentPosY = 0
  circleArray.sort(
    (firstItem, secondItem) => firstItem.center.y - secondItem.center.y
  )
  if (circleArray.length > 0) {
    currentPosY = circleArray[0].center.y
  } else {
    return arrAnswerCircles
  }

  let rowCircles = []
  circleArray.forEach((circle) => {
    if (Math.abs(circle.center.y - currentPosY) < 10) {
      rowCircles.push(circle)
    } else {
      if (circleArray.length > 0) {
        arrAnswerCircles.push(rowCircles)
        rowCircles = []
        currentPosY = circle.center.y
        rowCircles.push(circle)
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

      croppedRectangle.convertTo(croppedRectangle, -1, 1, 40)
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

          croppedLeft.convertTo(croppedLeft, -1, 1, 40)
          croppedRight.convertTo(croppedRight, -1, 1, 40)

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
  let answerPoints = []
  if (arrCroppedParentRect.length === 1) {
    // single
    const arrAnswers = getAnswers(cv, arrCroppedParentRect[0], true)
    const answers = arrAnswers[0]
    answerPoints = arrAnswers[1]
    if (!answers) {
      return
    }
    resultOfAnswers = {
      answers: answers,
      qrCode: qrCodeData.data,
      isQRCodeDetected: true,
    }
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
      isQRCodeDetected: true,
    }
  }
  return [resultOfAnswers, answerPoints]
}
