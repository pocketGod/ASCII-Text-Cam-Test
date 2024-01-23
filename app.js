document.addEventListener('DOMContentLoaded', () => {
    const asciiChars = ['@', '&', '#', '%', 'B', 'W', 'N', 'Q', 'O', 'L', 'D', 'X', 'Z', 'E', 'U', '?', '+', '~', ',', '^', '.', ' '];
    const asciiCharWidth = 0.5;
    const asciiCharHeight = 1;
    const scaleFactor = 0.2;


    const startButton = document.getElementById('startButton');
    const videoElem = document.getElementById('video');
    const asciiArt = document.getElementById('asciiArt');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');


    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElem.srcObject = stream;
            videoElem.onloadedmetadata = () => {
                processWebcam();
            };
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    };

    const processWebcam = () => {
        videoElem.addEventListener('playing', () => {
            const width = videoElem.videoWidth;
            const height = videoElem.videoHeight;
            canvas.width = width;
            canvas.height = height;

            const processFrame = () => {
                captureFrame(width, height);
                requestAnimationFrame(processFrame);
            };
            requestAnimationFrame(processFrame);
        });
    };

    const captureFrame = () => {
        const width = videoElem.videoWidth * scaleFactor;
        const height = videoElem.videoHeight * scaleFactor * asciiCharWidth / asciiCharHeight;
    
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(videoElem, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
    
        let asciiImage = '';
        for (let i = 0; i < imageData.data.length; i += 4) {
            const [r, g, b, alpha] = imageData.data.slice(i, i + 4);
            const intensity = (r + g + b) / 3;
            const charIndex = Math.ceil(intensity * (asciiChars.length - 1) / 255);
            asciiImage += asciiChars[charIndex];
            if ((i / 4 + 1) % width === 0) {
                asciiImage += '\n';
            }
        }
        asciiArt.textContent = asciiImage;
    };
    
    

    startButton.addEventListener('click', startWebcam);
});
