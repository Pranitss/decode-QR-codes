// Accessing video stream and scanning QR code
const video = document.getElementById('video');
const resultDiv = document.getElementById('result');

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then((stream) => {
        video.srcObject = stream;
        video.setAttribute('playsinline', true);
        video.play();
        scanQRCode();
    })
    .catch((error) => {
        console.error('Error accessing the camera: ', error);
    });

function scanQRCode() {
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    // Check if the canvas context is available
    if (!canvasContext) {
        alert('Error: Unable to get canvas context.');
        return;
    }

    // Set canvas dimensions according to video element
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    // Start scanning
    function tick() {
        canvasContext.drawImage(video, 0, 0, width, height);
        const imageData = canvasContext.getImageData(0, 0, width, height);
        const code = jsQR(imageData.data, width, height, { inversionAttempts: 'dontInvert' });

        if (code) {
            resultDiv.innerHTML = `QR Code Detected: ${code.data}`;
        } else {
            resultDiv.innerHTML = 'Scanning QR code...';
        }

        requestAnimationFrame(tick);
    }

    tick();
}
