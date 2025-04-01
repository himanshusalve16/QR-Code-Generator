document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const qrText = document.getElementById('qr-text');
    const generateBtn = document.getElementById('generate-btn');
    const qrCodeContainer = document.getElementById('qr-code');
    const qrContainer = document.getElementById('qr-container');
    const downloadBtn = document.getElementById('download-btn');
    
    // QR code styling configuration
    const qrCode = new QRCodeStyling({
        width: 250,
        height: 250,
        type: "svg",
        data: "https://example.com",
        dotsOptions: {
            color: "#000000",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        cornersSquareOptions: {
            type: "extra-rounded"
        },
        cornersDotOptions: {
            type: "dot"
        },
        imageOptions: {
            crossOrigin: "anonymous",
        }
    });
    
    // Initialize QR code with placeholder
    qrCode.append(qrCodeContainer);
    
    // Generate QR code when button is clicked
    generateBtn.addEventListener('click', generateQRCode);
    
    // Also generate when user presses Enter in the input field
    qrText.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            generateQRCode();
        }
    });
    
    // Handle download button click
    downloadBtn.addEventListener('click', function() {
        qrCode.download({
            name: "qr-code",
            extension: "png"
        });
    });
    
    // Function to generate QR code
    function generateQRCode() {
        const text = qrText.value.trim();
        
        if (!text) {
            alert("Please enter URL or text");
            return;
        }
        
        // Update QR code data
        qrCode.update({
            data: text
        });
        
        // Show QR code and download button
        qrContainer.classList.remove('hidden');
        downloadBtn.classList.remove('hidden');
    }
}); 