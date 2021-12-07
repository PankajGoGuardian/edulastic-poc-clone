import {
  detectCircles,
  getBoundingRegionsWithCircles,
  getTrueCirclesInRow,
  resizeImage,
} from './process-image'
import { getAngleOfQR, getWidthOfQR } from './parse-qrcode'
import { imShow } from './isomorphic'
import log from './log'

export const getAnswers = (cv, srcMat, isSingle) => {
  let resizedImage = resizeImage(cv, srcMat, isSingle) // resize image
  const circleArray = detectCircles(cv, resizedImage)

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
  //
  // cv.imshow('workingCanvas', resizedImage);
  log('resized image', resizedImage)
  const arrBoundingRegions = getBoundingRegionsWithCircles(
    cv,
    resizedImage,
    circleArray,
    arrAnswerCircles
  )

  arrBoundingRegions.forEach((region, index) => {
    // if(index === 0) {
    //     cv.imshow('rowCanvas', region);
    // }
    const answer = getTrueCirclesInRow(cv, region)
    arrAnswers.push(answer)
  })
  resizedImage.delete()
  return arrAnswers
}

export const getAnswersFromVideo = (
  cv,
  matSrc,
  parentRectangle,
  qrCodeData
) => {
  let angleOfQR = 0
  let center = new cv.Point(matSrc.cols / 2, matSrc.rows / 2)
  let resultOfAnswers = {}
  if (parentRectangle && qrCodeData) {
    angleOfQR = getAngleOfQR(
      qrCodeData.bottomRightCorner,
      qrCodeData.bottomLeftCorner,
      {
        x: qrCodeData.bottomLeftCorner.x,
        y: qrCodeData.bottomRightCorner.y,
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
    }
    // const arrCroppedParentRect =  getTrulyRectangles(cv, matSrc, rectArray, true);
    if (arrCroppedParentRect) {
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

  imShow('canvasOutput', matSrc, cv)
  log('matsrc 1', matSrc)
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

// const getTrulyRectangles = (cv, matSrc, rectArray, isSingle) => {
//
//     let resultOfCroppedParentRect = [];
//     if (rectArray.length > 0) {
//         // parse: paper is single or multi rectangle
//         rectArray.sort((firstItem, secondItem) => firstItem.x - secondItem.x);
//         if (isSingle) {
//             cv.rectangle(matSrc, {x: rectArray[0].x, y: rectArray[0].y}, {
//                 x: rectArray[0].x + rectArray[0].width,
//                 y: rectArray[0].y + rectArray[0].height
//             }, [0, 255, 0, 255], 1);
//             let croppedRectangle = matSrc.roi(rectArray[0]);
//
//             croppedRectangle.convertTo(croppedRectangle, -1, 1, 40);
//             resultOfCroppedParentRect.push(croppedRectangle);
//         } else {
//             if (rectArray.length > 1) {
//                 let arrCroppedParentRect = []
//                 arrCroppedParentRect.push(rectArray[0]);
//                 for (let i = 0; i < rectArray.length - 1; i++) {
//                     if (rectArray[i + 1].x - rectArray[i].x > 150) {
//                         arrCroppedParentRect.push(rectArray[i + 1]);
//                     }
//                 }
//                 if (arrCroppedParentRect.length > 1) {
//                     let croppedLeft = matSrc.roi(arrCroppedParentRect[0]);
//                     let croppedRight = matSrc.roi(rectArray[rectArray.length - 1]);
//
//                     croppedLeft.convertTo(croppedLeft, -1, 1, 40);
//                     croppedRight.convertTo(croppedRight, -1, 1, 40);
//
//                     resultOfCroppedParentRect.push(croppedLeft);
//                     resultOfCroppedParentRect.push(croppedRight);
//
//                     arrCroppedParentRect.forEach(item => {
//                         cv.rectangle(matSrc, {x: item.x, y: item.y}, {
//                             x: item.x + item.width,
//                             y: item.y + item.height
//                         }, [0, 255, 0, 255], 1);
//                     });
//                 } else {
//                     arrCroppedParentRect.forEach(item => {
//                         cv.rectangle(matSrc, {x: item.x, y: item.y}, {
//                             x: item.x + item.width,
//                             y: item.y + item.height
//                         }, [255, 0, 0, 255], 1);
//                     });
//                 }
//             } else {
//                 rectArray.forEach(item => {
//                     cv.rectangle(matSrc, {x: item.x, y: item.y}, {
//                         x: item.x + item.width,
//                         y: item.y + item.height
//                     }, [255, 0, 0, 255], 1);
//                 });
//             }
//         }
//     }
//     return resultOfCroppedParentRect;
// }

const getAnswersFromRect = (cv, arrCroppedParentRect, matSrc, qrCodeData) => {
  let resultOfAnswers
  if (arrCroppedParentRect.length === 1) {
    // single
    const answers = getAnswers(cv, arrCroppedParentRect[0], true)
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
  return resultOfAnswers
}
