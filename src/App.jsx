import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const fileInputRef = useRef(null);

  const analysisSteps = [
    { id: 1, text: 'Analyzing image patterns...' },
    { id: 2, text: 'Checking pixel consistency...' },
    { id: 3, text: 'Examining metadata...' },
    { id: 4, text: 'Running AI detection model...' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setResult(null);
        setCurrentStep(0);
        // Auto-start scanning after a brief delay
        setTimeout(() => startScanning(file.name), 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const startScanning = (filename) => {
    setIsScanning(true);
    setResult(null);
    setCurrentStep(0);

    // Simulate analysis steps
    const stepDuration = 1500;
    analysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
      }, stepDuration * index);
    });

    // Show result after all steps
    setTimeout(() => {
      setIsScanning(false);
      // Determine result based on upload count
      const resultType = determineResult(filename);
      setResult(resultType);

      // Increment upload count for next upload
      setUploadCount(prev => prev + 1);

      // Show caption after result
      setTimeout(() => {
        setShowCaption(true);
      }, 1000);
    }, stepDuration * analysisSteps.length);
  };

  const determineResult = (filename) => {
    const lower = filename.toLowerCase();

    // First, check filename for explicit indicators
    if (lower.includes('ai') || lower.includes('generated') || lower.includes('synthetic')) {
      return {
        type: 'ai-generated',
        label: 'AI Generated Detected',
        confidence: 94
      };
    }

    if (lower.includes('edited') || lower.includes('mixed') || lower.includes('possibly')) {
      return {
        type: 'possibly-ai',
        label: 'Possibly AI',
        confidence: 67
      };
    }

    if (lower.includes('real') || lower.includes('human') || lower.includes('authentic')) {
      return {
        type: 'not-ai',
        label: 'Not AI Generated',
        confidence: 91
      };
    }

    // If no keywords found, cycle through results based on upload count
    const resultIndex = uploadCount % 3;

    if (resultIndex === 0) {
      return {
        type: 'ai-generated',
        label: 'AI Generated Detected',
        confidence: 94
      };
    } else if (resultIndex === 1) {
      return {
        type: 'not-ai',
        label: 'Not AI Generated',
        confidence: 91
      };
    } else {
      return {
        type: 'possibly-ai',
        label: 'Possibly AI',
        confidence: 67
      };
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setIsScanning(false);
    setResult(null);
    setCurrentStep(0);
    setShowCaption(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="animated-bg"></div>
      <div className="container">
        <header className="header">
          <h1>AI Image Authenticity Checker</h1>
          <p>Advanced detection system for AI-generated images</p>
        </header>

        <div className="card">
          {!selectedImage ? (
            <div
              className="upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">📸</div>
              <div className="upload-text">
                <h3>Upload Image for Analysis</h3>
                <p>Click to select an image or drag and drop</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7 }}>
                  Supported formats: JPG, PNG, WebP
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          ) : (
            <>
              <div className="image-preview">
                <img src={selectedImage} alt="Selected" className="preview-image" />

                {isScanning && (
                  <div className="scanning-overlay">
                    <div className="scan-line"></div>
                    <div className="scan-grid"></div>
                    <div className="scan-corners">
                      <div className="corner top-left"></div>
                      <div className="corner top-right"></div>
                      <div className="corner bottom-left"></div>
                      <div className="corner bottom-right"></div>
                    </div>
                  </div>
                )}
              </div>

              {isScanning && (
                <div className="analysis-steps">
                  {analysisSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`step ${currentStep > index ? 'complete' :
                          currentStep === index ? 'active' : ''
                        }`}
                    >
                      <div className="step-icon">
                        {currentStep > index ? '✓' : '⟳'}
                      </div>
                      <div className="step-text">{step.text}</div>
                    </div>
                  ))}
                </div>
              )}

              {result && (
                <div className={`result-display ${result.type}`}>
                  <div className="result-label">{result.label}</div>
                  <div className="result-confidence">
                    Confidence: {result.confidence}%
                  </div>
                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {result && (
                <button className="btn" onClick={handleReset}>
                  Analyze Another Image
                </button>
              )}
            </>
          )}
        </div>

        {showCaption && (
          <div className="footer-caption">
            <span>AI Image Authenticity Checker – Prototype Demo</span>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
