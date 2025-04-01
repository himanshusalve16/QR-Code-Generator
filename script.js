document.addEventListener('DOMContentLoaded', function() {
    // DOM elements - Main UI
    const qrText = document.getElementById('qr-text');
    const generateBtn = document.getElementById('generate-btn');
    const qrCodeContainer = document.getElementById('qr-code');
    const qrContainer = document.getElementById('qr-container');
    const downloadBtn = document.getElementById('download-btn');
    const formatOptions = document.getElementById('format-options');
    const themeBtn = document.getElementById('theme-btn');
    
    // DOM elements - Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // DOM elements - QR customization
    const foregroundColor = document.getElementById('foreground-color');
    const backgroundColor = document.getElementById('background-color');
    const dotStyle = document.getElementById('dot-style');
    const cornerStyle = document.getElementById('corner-style');
    const qrSize = document.getElementById('qr-size');
    const sizeValue = document.getElementById('size-value');
    const logoUpload = document.getElementById('logo-upload');
    
    // DOM elements - QR scanner
    const startCameraBtn = document.getElementById('start-camera');
    const qrVideo = document.getElementById('qr-video');
    const scanResult = document.getElementById('scan-result');
    
    // DOM elements - History
    const historyContainer = document.getElementById('history-container');
    
    // Variables
    let currentLogo = null;
    let qrHistory = JSON.parse(localStorage.getItem('qrHistory')) || [];
    let html5QrScanner = null;
    let isScanning = false;
    let qrCodeTimer = null;
    
    // QR code styling configuration
    const qrCode = new QRCodeStyling({
        width: parseInt(qrSize.value),
        height: parseInt(qrSize.value),
        type: "svg",
        data: "",
        dotsOptions: {
            color: foregroundColor.value,
            type: dotStyle.value
        },
        backgroundOptions: {
            color: backgroundColor.value,
        },
        cornersSquareOptions: {
            type: cornerStyle.value
        },
        cornersDotOptions: {
            type: "dot"
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 10
        }
    });
    
    // Initialize QR code with placeholder
    qrCode.append(qrCodeContainer);
    
    // Initialize UI based on stored settings
    initializeUI();
    
    // Theme toggle
    themeBtn.addEventListener('click', toggleTheme);
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current button and content
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Handle specific tab actions
            if (tabId === 'history') {
                renderQRHistory();
            } else if (tabId === 'scan') {
                // Camera is initialized when start button is clicked
            }
        });
    });
    
    // Live preview - update QR code as user types with debounce
    qrText.addEventListener('input', debounce(function() {
        if (qrText.value.trim()) {
            updateQRCode();
        }
    }, 500));
    
    // Generate QR code when button is clicked
    generateBtn.addEventListener('click', generateQRCode);
    
    // Also generate when user presses Enter in the input field
    qrText.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            generateQRCode();
        }
    });
    
    // Customization options listeners
    foregroundColor.addEventListener('input', updateQRCode);
    backgroundColor.addEventListener('input', updateQRCode);
    dotStyle.addEventListener('change', updateQRCode);
    cornerStyle.addEventListener('change', updateQRCode);
    qrSize.addEventListener('input', function() {
        sizeValue.textContent = `${qrSize.value} x ${qrSize.value}`;
        updateQRCode();
    });
    
    // Logo upload
    logoUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentLogo = e.target.result;
                updateQRCode();
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Handle download button click - show format options
    downloadBtn.addEventListener('click', function() {
        formatOptions.classList.toggle('hidden');
    });
    
    // Download in different formats
    formatOptions.addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            const format = event.target.getAttribute('data-format');
            downloadQRCode(format);
            formatOptions.classList.add('hidden');
        }
    });
    
    // Start camera for scanning
    startCameraBtn.addEventListener('click', toggleScanner);
    
    // Functions
    function initializeUI() {
        // Check for saved theme
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Update size display
        sizeValue.textContent = `${qrSize.value} x ${qrSize.value}`;
        
        // Render QR history
        renderQRHistory();
    }
    
    function toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        themeBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', isDarkMode);
    }
    
    function updateQRCode() {
        const text = qrText.value.trim();
        
        if (!text) return;
        
        // Update QR code options
        qrCode.update({
            data: text,
            width: parseInt(qrSize.value),
            height: parseInt(qrSize.value),
            dotsOptions: {
                color: foregroundColor.value,
                type: dotStyle.value
            },
            backgroundOptions: {
                color: backgroundColor.value
            },
            cornersSquareOptions: {
                type: cornerStyle.value
            },
            image: currentLogo || undefined
        });
        
        // Show QR code with animation
        qrContainer.classList.remove('hidden');
        setTimeout(() => {
            qrContainer.classList.add('show');
        }, 10);
        
        downloadBtn.classList.remove('hidden');
    }
    
    function generateQRCode() {
        const text = qrText.value.trim();
        
        if (!text) {
            alert("Please enter URL or text");
            return;
        }
        
        updateQRCode();
        
        // Save to history
        saveToHistory(text);
        
        // Add animation effect
        if (qrContainer.classList.contains('show')) {
            qrContainer.classList.remove('show');
            setTimeout(() => {
                qrContainer.classList.add('show');
            }, 100);
        }
    }
    
    function downloadQRCode(format = 'png') {
        qrCode.download({
            name: "qr-code",
            extension: format
        });
    }
    
    function saveToHistory(text) {
        // Create QR code image data URL
        qrCode.getRawData(format = 'png').then(data => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const historyItem = {
                    id: Date.now(),
                    text: text,
                    image: e.target.result,
                    options: {
                        foreground: foregroundColor.value,
                        background: backgroundColor.value,
                        dotStyle: dotStyle.value,
                        cornerStyle: cornerStyle.value,
                        size: qrSize.value,
                        logo: currentLogo
                    },
                    date: new Date().toLocaleString()
                };
                
                // Add to history and limit to 20 items
                qrHistory.unshift(historyItem);
                if (qrHistory.length > 20) {
                    qrHistory.pop();
                }
                
                // Save to localStorage
                localStorage.setItem('qrHistory', JSON.stringify(qrHistory));
                
                // Update history tab if active
                if (document.getElementById('history-tab').classList.contains('active')) {
                    renderQRHistory();
                }
            };
            reader.readAsDataURL(data);
        });
    }
    
    function renderQRHistory() {
        // Clear existing content
        historyContainer.innerHTML = '';
        
        if (qrHistory.length === 0) {
            historyContainer.innerHTML = '<p class="empty-history">Your generated QR codes will appear here</p>';
            return;
        }
        
        // Create history items
        qrHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <img src="${item.image}" alt="QR Code">
                <div class="history-text">${item.text}</div>
            `;
            
            // Load QR code when clicked
            historyItem.addEventListener('click', () => {
                loadHistoryItem(item);
                // Switch to generate tab
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                document.querySelector('.tab-btn[data-tab="generate"]').classList.add('active');
                document.getElementById('generate-tab').classList.add('active');
            });
            
            historyContainer.appendChild(historyItem);
        });
    }
    
    function loadHistoryItem(item) {
        // Set form values
        qrText.value = item.text;
        foregroundColor.value = item.options.foreground;
        backgroundColor.value = item.options.background;
        dotStyle.value = item.options.dotStyle;
        cornerStyle.value = item.options.cornerStyle;
        qrSize.value = item.options.size;
        sizeValue.textContent = `${item.options.size} x ${item.options.size}`;
        currentLogo = item.options.logo;
        
        // Generate QR code
        updateQRCode();
    }
    
    function toggleScanner() {
        if (isScanning) {
            stopScanner();
            startCameraBtn.textContent = 'Start Camera';
        } else {
            startScanner();
            startCameraBtn.textContent = 'Stop Camera';
        }
        isScanning = !isScanning;
    }
    
    function startScanner() {
        html5QrScanner = new Html5Qrcode("camera-container");
        
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                html5QrScanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: 250
                    },
                    onScanSuccess,
                    onScanFailure
                ).catch(err => {
                    scanResult.innerHTML = `Camera error: ${err}`;
                });
            } else {
                scanResult.innerHTML = 'No cameras found on your device';
            }
        }).catch(err => {
            scanResult.innerHTML = `Error getting cameras: ${err}`;
        });
    }
    
    function stopScanner() {
        if (html5QrScanner) {
            html5QrScanner.stop().then(() => {
                console.log('QR Scanner stopped');
            }).catch(err => {
                console.error('Error stopping scanner:', err);
            });
        }
    }
    
    function onScanSuccess(decodedText) {
        scanResult.innerHTML = `
            <p><strong>Scanned QR Code:</strong></p>
            <p>${decodedText}</p>
            <button id="use-scanned-result">Use This Text</button>
        `;
        
        document.getElementById('use-scanned-result').addEventListener('click', function() {
            qrText.value = decodedText;
            
            // Switch to generate tab and load the text
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            document.querySelector('.tab-btn[data-tab="generate"]').classList.add('active');
            document.getElementById('generate-tab').classList.add('active');
            
            updateQRCode();
        });
    }
    
    function onScanFailure(error) {
        // Do nothing on failure - camera is still scanning
    }
    
    // Utility function for debouncing
    function debounce(func, wait) {
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(qrCodeTimer);
            qrCodeTimer = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
}); 