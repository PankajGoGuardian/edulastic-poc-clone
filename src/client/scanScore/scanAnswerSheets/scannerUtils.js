import jsQR from "jsqr";

export const getAnswersFromVideo = (cv, matSrc) => {
	let matImg = new cv.Mat();
	cv.cvtColor(matSrc, matImg, cv.COLOR_RGBA2GRAY, 0);
	cv.blur(matImg, matImg, new cv.Size(2, 2));
	cv.threshold(matImg, matImg, 115, 255, cv.THRESH_TOZERO);
	cv.threshold(matImg, matImg, 115, 255, cv.THRESH_OTSU);
	let kernel = cv.Mat.ones(5, 5, cv.CV_8U);
	cv.erode(matImg, matImg, kernel);

	let angleOfQR = 0;
	let widthOfQR = 0;

	let qrRectWidth = 180;
	let padding = 0;
	let qrRect = new cv.Rect(matSrc.size().width - qrRectWidth - padding, padding, qrRectWidth, qrRectWidth);
	let croppedQR = matSrc.roi(qrRect);
	let qrCode = detectQRCode(cv, croppedQR);

	if (qrCode) {
		let leftBottomPoint = {x: qrCode.location.bottomLeftCorner.x * qrRectWidth / 200 + qrRect.x, y: qrCode.location.bottomLeftCorner.y * qrRectWidth / 200};
		let rightBottomPoint = {x: qrCode.location.bottomRightCorner.x * qrRectWidth / 200 + qrRect.x, y: qrCode.location.bottomRightCorner.y * qrRectWidth / 200};
		let leftTopPoint = {x: qrCode.location.topLeftCorner.x * qrRectWidth / 200 + qrRect.x, y: qrCode.location.topLeftCorner.y * qrRectWidth / 200};
		let rightTopPoint = {x: qrCode.location.topRightCorner.x * qrRectWidth / 200 + qrRect.x, y: qrCode.location.topRightCorner.y * qrRectWidth / 200};

		cv.line(matSrc, leftBottomPoint, rightBottomPoint, [0, 255, 0, 255], 1);
		cv.line(matSrc, rightBottomPoint, rightTopPoint, [0, 255, 0, 255], 1);
		cv.line(matSrc, rightTopPoint, leftTopPoint, [0, 255, 0, 255], 1);
		cv.line(matSrc, leftTopPoint, leftBottomPoint, [0, 255, 0, 255], 1);

		angleOfQR = getAngleOfQR(qrCode.location.bottomRightCorner, qrCode.location.bottomLeftCorner,
			{x: qrCode.location.bottomLeftCorner.x, y: qrCode.location.bottomRightCorner.y});
		widthOfQR = getWidthOfQR(qrCode.location.bottomRightCorner, qrCode.location.bottomLeftCorner);
	}

	let dSize = new cv.Size(matImg.cols, matImg.rows);
	let center = new cv.Point(matImg.cols / 2, matImg.rows / 2);
	let M = cv.getRotationMatrix2D(center, angleOfQR * (-1), 1);
	cv.warpAffine(matImg, matImg, M, dSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
	cv.warpAffine(matSrc, matSrc, M, dSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

	let contours = new cv.MatVector();
	let hierarchy = new cv.Mat();
	cv.findContours(matImg, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
	hierarchy.delete();
	let poly = new cv.MatVector();
	let rectArray = [];

	for (let i = 0; i < contours.size(); ++i) {
		let tmp = new cv.Mat();
		let cnt = contours.get(i);
		cv.approxPolyDP(cnt, tmp, 3, true);

		let rect = cv.boundingRect(tmp);
		if(rect.width > widthOfQR * 2 && rect.width < widthOfQR * 4 && rect.height > widthOfQR / 2) {
			rectArray.push(rect);
		}

		poly.push_back(tmp);
		cnt.delete();
		tmp.delete();
	}

	let parentRectangleArray = [];
	let result = [];
	if(rectArray.length > 0) {
		let isSingle = false;
		rectArray.sort((firstItem, secondItem) => firstItem.x - secondItem.x);
		if(rectArray[0].width > widthOfQR * 2.5 && rectArray.length < 3) {
			isSingle = true;
		}
		if(isSingle) {
			parentRectangleArray.push(rectArray[0]);
			parentRectangleArray.forEach(item => {
				cv.rectangle(matSrc, { x: item.x, y:item.y }, { x: item.x + item.width, y:item.y + item.height }, [0, 255, 0, 255], 1);
			});
			let cropped = matSrc.roi(rectArray[0]);
			const answers = getAnswers(cv, cropped, true);
			if(!answers) {
				return;
			}
			result = { answers: answers, qrCode: qrCode.data };
			cropped.delete();
		} else {
			if(rectArray.length > 1) {
				parentRectangleArray.push(rectArray[0]);
				for(let i = 0 ; i < rectArray.length - 1; i++) {
					if(rectArray[i + 1].x - rectArray[i].x > 150) {
						parentRectangleArray.push(rectArray[i + 1]);
					}
				}
				if(parentRectangleArray.length > 1) {
					let croppedLeft = matSrc.roi(parentRectangleArray[0]);
					let croppedRight = matSrc.roi(rectArray[rectArray.length - 1]);
					const leftAnswers = getAnswers(cv, croppedLeft, false);
					const rightAnswers = getAnswers(cv, croppedRight, false);
					parentRectangleArray.forEach(item => {
						cv.rectangle(matSrc, { x: item.x, y:item.y }, { x: item.x + item.width, y:item.y + item.height }, [0, 255, 0, 255], 1);
					});
					croppedLeft.delete();
					croppedRight.delete();
					if(!leftAnswers || !rightAnswers) {
						return;
					}
					result = {answers: [...leftAnswers, ...rightAnswers], qrCode: qrCode.data};
				} else {
					parentRectangleArray.forEach(item => {
						cv.rectangle(matSrc, { x: item.x, y:item.y }, { x: item.x + item.width, y:item.y + item.height }, [255, 0, 0, 255], 1);
					});
				}
			} else {
				rectArray.forEach(item => {
					cv.rectangle(matSrc, { x: item.x, y:item.y }, { x: item.x + item.width, y:item.y + item.height }, [255, 0, 0, 255], 1);
				});
			}
		}
	}
	M = cv.getRotationMatrix2D(center, angleOfQR, 1);
	cv.warpAffine(matSrc, matSrc, M, dSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

	const rectPadding = 10;
	const rectStartPoint = {x: matSrc.size().width - qrRectWidth - rectPadding, y: rectPadding};
	const rectEndPoint = {x: matSrc.size().width - rectPadding, y: rectPadding + qrRectWidth};
	cv.rectangle(matSrc, rectStartPoint, rectEndPoint, [0, 0, 255, 255], 2);
	cv.putText(matSrc, 'Place QR code', {x: rectStartPoint.x + 20 , y: rectStartPoint.y + 25}, cv.FONT_HERSHEY_SIMPLEX, 0.6, [0, 0, 255, 255]);

	cv.imshow('canvas', matSrc);

	M.delete();
	matImg.delete();
	contours.delete();
	return result;
}

const getAngleOfQR = (point1, point2, point3) => {
	const dx21 = point2.x - point1.x;
	const dx31 = point3.x - point1.x;
	const dy21 = point2.y - point1.y;
	const dy31 = point3.y - point1.y;
	const m12 = Math.sqrt( dx21*dx21 + dy21*dy21 );
	const m13 = Math.sqrt( dx31*dx31 + dy31*dy31 );
	let result = 0;
	if(point2.y > point1.y) {
		result = Math.acos((dx21*dx31 + dy21*dy31) / (m12 * m13));
	} else {
		result = Math.acos((dx21*dx31 + dy21*dy31) / (m12 * m13)) * (-1);
	}
	return result * 180 / Math.PI;
}

const getWidthOfQR = (point1, point2) => {
	const x = Math.pow(point1.x - point2.x, 2);
	const y = Math.pow(point1.y - point2.y, 2);
	const result = Math.sqrt(x + y);
	return result;
}

export const detectQRCode = (cv, matSrc) => {
	let result = null;
	const sz = new cv.Size(200, 200);
	cv.resize( matSrc, matSrc, sz );
	const code = jsQR(matSrc.data, matSrc.size().width, matSrc.size().height);
	if (code) {
		result = code;
	}
	matSrc.delete();
	return result;
}

export const resizeImage = (cv, matSrc, isSingle) => {
	let resizedImg = new cv.Mat();
	let sz;
	if(isSingle) {
		sz = new cv.Size(345, matSrc.size().height * 280 / matSrc.size().width);
	} else {
		sz = new cv.Size(280, matSrc.size().height * 280 / matSrc.size().width);
	}
	cv.resize(matSrc, resizedImg, sz);

	cv.cvtColor(resizedImg, resizedImg, cv.COLOR_RGBA2GRAY);
	return resizedImg;
}

export const detectCircles = (cv, matSrc) => {
	const imgMat = new cv.Mat();

	cv.medianBlur(matSrc, imgMat, 3);
	cv.threshold(imgMat, imgMat, 250, 255, cv.THRESH_OTSU);
	let kernel = cv.Mat.ones(1 , 1, cv.CV_8U);
	cv.erode(imgMat, imgMat, kernel);

	let circles = new cv.Mat();
	cv.HoughCircles(imgMat, circles, cv.HOUGH_GRADIENT, 1, 17, 15, 11, 7, 15);
	let circleArray = [];

	let totalX = 0;
	for(let i = 0 ; i < circles.cols ; i++) {
		let x = circles.data32F[i * 3];
		totalX += x;
	}

	const average = totalX / circles.cols;

	for(let i = 0 ; i < circles.cols ; i++) {
		let x = circles.data32F[i * 3];
		let y = circles.data32F[i * 3 + 1];
		let radius = circles.data32F[i * 3 + 2];
		let center = new cv.Point(x, y);

		if (x > average - 62) {
			circleArray.push({ center: center, radius: radius });
		}
	}

	circleArray.sort((firstItem, secondItem) => firstItem.center.y - secondItem.center.y);

	circles.delete();
	imgMat.delete();
	return circleArray;
}

export const getAnswers = (cv, srcMat, isSingle) => {
	let resizedImage = resizeImage(cv, srcMat, isSingle);
	let imgForColoring = new cv.Mat(resizedImage.size(), cv.CV_8UC1);
	let imgForColoring1 = new cv.Mat(resizedImage.size(), cv.CV_8UC1);

	cv.cvtColor(resizedImage, imgForColoring, cv.COLOR_GRAY2RGB);
	cv.cvtColor(resizedImage, imgForColoring1, cv.COLOR_GRAY2RGB);

	const circleArray = detectCircles(cv, resizedImage);

	let arrAnswers = [];
	if(circleArray.length > 0) {
		circleArray.forEach(item => {
			cv.circle(imgForColoring, item.center, item.radius, [0, 255, 0, 255], -1);
		});

		circleArray.sort((firstItem, secondItem) => firstItem.center.x - secondItem.center.x);
		const leftPointX = circleArray[0].center.x;
		const rightPointX = circleArray[circleArray.length - 1].center.x;
		circleArray.sort((firstItem, secondItem) => firstItem.center.y - secondItem.center.y);

		let listForCurrentLine = [];
		let currentY = 0;
		let countOfElementsInTheSameLine = 0;
		circleArray.forEach((circleCoordinate, circleIndex) => {
			if (countOfElementsInTheSameLine === 0) {
				listForCurrentLine.push(circleCoordinate);
				currentY = circleCoordinate.center.y;
				countOfElementsInTheSameLine = countOfElementsInTheSameLine + 1;
			} else if (Math.abs(circleCoordinate.center.y - currentY) < 10) {
				countOfElementsInTheSameLine = countOfElementsInTheSameLine + 1;
				listForCurrentLine.push(circleCoordinate);
			} else {
				listForCurrentLine.sort((firstItem, secondItem) => firstItem.center.x - secondItem.center.x);
				if (listForCurrentLine.length > 1) {
					let leftCircle = listForCurrentLine[0];
					let rightCircle = listForCurrentLine[listForCurrentLine.length - 1];
					let width = rightPointX + rightCircle.radius - (leftPointX - leftCircle.radius);
					let height = rightCircle.radius + leftCircle.radius;
					let rect = new cv.Rect((leftPointX - leftCircle.radius), (leftCircle.center.y - leftCircle.radius), width, height);

					let croppedImg = null;
					try{
						croppedImg = imgForColoring1.roi(rect);
					} catch (e) {
						// TODO: need to fix later
						// console.log(e);
						// console.log(rect);
					}
					if(!croppedImg) {
						return;
					}

					cv.cvtColor(croppedImg, croppedImg, cv.COLOR_RGB2GRAY);

					cv.rectangle(imgForColoring1, {x: rect.x, y: rect.y}, {x: rect.x + rect.width, y: rect.y + rect.height}, [255, 0, 0, 255], 1);

					let copyForMark = new cv.Mat();
					croppedImg.copyTo(copyForMark);
					cv.blur(copyForMark, copyForMark, new cv.Size(11, 11));

					let circlesInCropped = new cv.Mat();
					cv.HoughCircles(croppedImg, circlesInCropped, cv.HOUGH_GRADIENT, 1, 17, 15, 11, 7, 15);

					let circlesCroppedArray = [];
					let totalColorValue = 0;
					for(let i = 0 ; i < circlesInCropped.cols ; i++) {
						let x = circlesInCropped.data32F[i * 3];
						let y = circlesInCropped.data32F[i * 3 + 1];
						let radius = circlesInCropped.data32F[i * 3 + 2];
						let center = new cv.Point(rect.x + x, rect.y + y);
						let color = copyForMark.data[parseInt(y) * croppedImg.cols * croppedImg.channels() + parseInt(x) * croppedImg.channels()];
						circlesCroppedArray.push({center: center, radius: radius, color: color});
						totalColorValue += color;
					}
					const colorAverage = totalColorValue / circlesCroppedArray.length
					circlesCroppedArray.sort((firstItem, secondItem) => firstItem.color - secondItem.color);
					let minColorValue = -1;
					circlesCroppedArray.forEach((item, index) => {
						if(index === 0 && colorAverage - item.color > 30) {
							cv.circle(imgForColoring1, item.center, item.radius, [255, 0, 0, 255], -1);
							minColorValue = item.color;
						} else {
							cv.circle(imgForColoring1, item.center, item.radius, [0, 255, 0, 255], -1);
						}
					});
					circlesCroppedArray.sort((firstItem, secondItem) => firstItem.center.x - secondItem.center.x);
					if(minColorValue > 0) {
						circlesCroppedArray.forEach((item, index) => {
							if (item.color === minColorValue) {
								arrAnswers.push(String.fromCharCode(index + 65));
							}
						});
					} else {
						arrAnswers.push(' ');
					}
					croppedImg.delete();
					circlesInCropped.delete();
					copyForMark.delete();
				}
				if(listForCurrentLine.length === 1) {
					listForCurrentLine = [];
					listForCurrentLine.push(circleCoordinate);
					currentY = circleCoordinate.center.y;
					countOfElementsInTheSameLine = 1;
				}

				listForCurrentLine = [];
				listForCurrentLine.push(circleCoordinate);
				currentY = circleCoordinate.center.y;
				countOfElementsInTheSameLine = 1;
			}
		})

		listForCurrentLine.sort((firstItem, secondItem) => firstItem.center.x - secondItem.center.x);

		if (listForCurrentLine.length > 1) {
			let leftCircle = listForCurrentLine[0];
			let rightCircle = listForCurrentLine[listForCurrentLine.length - 1];
			let width = rightPointX + rightCircle.radius - (leftPointX - leftCircle.radius);
			let height = rightCircle.radius + leftCircle.radius;
			let rect = new cv.Rect((leftPointX - leftCircle.radius), (leftCircle.center.y - leftCircle.radius), width, height);
			let croppedImg = null;
			try{
				croppedImg = imgForColoring1.roi(rect);
			} catch (e) {
				// TODO: need to fix later
				// console.log(e);
				// console.log(rect);
			}
			if(!croppedImg) {
				return;
			}
			cv.cvtColor(croppedImg, croppedImg, cv.COLOR_RGB2GRAY);
			cv.rectangle(imgForColoring1, {x: rect.x, y: rect.y}, {x: rect.x + rect.width, y: rect.y + rect.height}, [255, 0, 0, 255], 1);

			let copyForMark = new cv.Mat();
			croppedImg.copyTo(copyForMark);
			cv.blur(copyForMark, copyForMark, new cv.Size(11, 11));

			let circlesInCropped = new cv.Mat();
			cv.HoughCircles(croppedImg, circlesInCropped, cv.HOUGH_GRADIENT, 1, 17, 15, 11, 7, 15);

			let circlesCroppedArray = [];
			let totalColorValue = 0;
			for(let i = 0 ; i < circlesInCropped.cols ; i++) {
				let x = circlesInCropped.data32F[i * 3];
				let y = circlesInCropped.data32F[i * 3 + 1];
				let radius = circlesInCropped.data32F[i * 3 + 2];
				let center = new cv.Point(rect.x + x, rect.y + y);
				let color = copyForMark.data[parseInt(y) * croppedImg.cols * croppedImg.channels() + parseInt(x) * croppedImg.channels()];
				circlesCroppedArray.push({center: center, radius: radius, color: color});
				totalColorValue += color;
			}
			const colorAverage = totalColorValue / circlesCroppedArray.length
			circlesCroppedArray.sort((firstItem, secondItem) => firstItem.color - secondItem.color);
			let maxColorValue = 0;
			circlesCroppedArray.forEach((item, index) => {
				if(index === 0 && colorAverage - item.color > 20) {
					cv.circle(imgForColoring1, item.center, item.radius, [255, 0, 0, 255], -1);
					maxColorValue = item.color;
				} else {
					cv.circle(imgForColoring1, item.center, item.radius, [0, 255, 0, 255], -1);
				}
			});
			circlesCroppedArray.sort((firstItem, secondItem) => firstItem.center.x - secondItem.center.x);
			circlesCroppedArray.forEach((item, index) => {
				if(item.color === maxColorValue) {
					arrAnswers.push(String.fromCharCode(index + 65));
				}
			});
			croppedImg.delete();
			circlesInCropped.delete();
			copyForMark.delete();
		}
		cv.imshow('cropped', imgForColoring1);

		imgForColoring.delete();
		imgForColoring1.delete();
		resizedImage.delete();
	}

	return arrAnswers;
}
