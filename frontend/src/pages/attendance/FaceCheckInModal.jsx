import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Server,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { checkFaceServiceHealth } from '../../api/attendanceApi';

export const FaceCheckInModal = ({ isOpen, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraState, setCameraState] = useState('idle'); // 'idle' | 'starting' | 'active' | 'denied' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraState('idle');
  }, []);

  // Start webcam
  const startCamera = useCallback(async () => {
    setCameraState('starting');
    setErrorMessage('');
    setCapturedImage(null);
    setVerificationResult(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraState('active');
    } catch (err) {
      console.warn('Webcam access error:', err.name, err.message);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setErrorMessage('Camera permission was denied. Please allow camera access in your browser settings.');
      } else {
        setCameraState('error');
        setErrorMessage(err.message || 'Unable to open camera stream. Ensure no other application is using it.');
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => {
        startCamera();
      }, 0);
    } else {
      timer = setTimeout(() => {
        stopCamera();
      }, 0);
    }

    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  // Capture image frame from video feed
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    startCamera();
  };

  // Submit to backend verification flow
  const handleVerifyBiometrics = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // 1. Probe the Node.js -> Python Face Recognition service health
      const faceHealth = await checkFaceServiceHealth();

      // 2. Report server status accurately according to security guidelines:
      // We must NEVER fabricate a verified: true or mark attendance from client side!
      setVerificationResult({
        faceServiceHealthy: faceHealth.success === true,
        faceServiceDetails: faceHealth.faceService || null,
        status: 'BACKEND_MIDDLEWARE_REQUIRED',
        message:
          'Biometric image captured. The backend Python FaceNet512 microservice is online, but server-side face enrollment comparison middleware is currently in development (Phase 4B).',
        securityNotice:
          'Security enforcement: Client-side attendance validation is blocked by design. Once the server-side enrollment pipeline is connected, your captured frame will be matched against your stored student biometric embedding.',
      });
    } catch {
      setVerificationResult({
        faceServiceHealthy: false,
        status: 'SERVICE_UNAVAILABLE',
        message:
          'The Python Face Recognition microservice (http://127.0.0.1:5001) is currently unreachable through the Node.js API.',
        securityNotice:
          'Ensure `python backend/face_service.py` is running in your Python virtual environment on port 5001.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Biometric Face Attendance"
      subtitle="Computer Vision Check-In • DeepFace FaceNet512"
      maxWidth="580px"
    >
      <div className="face-modal-body">
        {/* Viewfinder area */}
        <div className="biometric-viewfinder-container">
          {!capturedImage ? (
            <>
              {cameraState === 'active' && (
                <div className="viewfinder-feed-wrap">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="biometric-video"
                  />
                  {/* Face positioning reticle overlay */}
                  <div className="face-reticle-overlay">
                    <div className="face-oval-guide">
                      <span className="reticle-corner top-left" />
                      <span className="reticle-corner top-right" />
                      <span className="reticle-corner bottom-left" />
                      <span className="reticle-corner bottom-right" />
                      <div className="reticle-scan-line" />
                    </div>
                    <p className="reticle-guidance-text">
                      Position your face within the frame in good lighting
                    </p>
                  </div>
                </div>
              )}

              {cameraState === 'starting' && (
                <div className="camera-state-box">
                  <RefreshCw size={28} className="animate-spin text-blue-600 mb-2" />
                  <p>Accessing camera feed...</p>
                </div>
              )}

              {cameraState === 'denied' && (
                <div className="camera-state-box error">
                  <CameraOff size={36} className="text-red-500 mb-2" />
                  <strong>Camera Permission Blocked</strong>
                  <p>{errorMessage}</p>
                  <Button variant="outline" size="sm" onClick={startCamera} className="mt-3">
                    Retry Permission
                  </Button>
                </div>
              )}

              {cameraState === 'error' && (
                <div className="camera-state-box error">
                  <AlertTriangle size={36} className="text-amber-500 mb-2" />
                  <strong>Camera Stream Error</strong>
                  <p>{errorMessage}</p>
                  <Button variant="outline" size="sm" onClick={startCamera} className="mt-3">
                    Retry Connection
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="captured-preview-wrap">
              <img
                src={capturedImage}
                alt="Captured Biometric Frame"
                className="captured-frame-img"
              />
              <div className="captured-frame-badge">
                <Badge variant="blue" size="sm">Biometric Frame Captured</Badge>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Verification Result Feedback */}
        {verificationResult && (
          <div
            className={`verification-audit-box ${
              verificationResult.faceServiceHealthy ? 'status-connected' : 'status-offline'
            }`}
          >
            <div className="audit-header">
              <Server size={18} />
              <strong>DeepFace Microservice Status:</strong>
              <Badge
                variant={verificationResult.faceServiceHealthy ? 'success' : 'danger'}
                size="sm"
              >
                {verificationResult.faceServiceHealthy ? 'Online (Port 5001)' : 'Offline'}
              </Badge>
            </div>
            <p className="audit-message">{verificationResult.message}</p>
            <div className="audit-security-rule">
              <ShieldAlert size={16} />
              <span>{verificationResult.securityNotice}</span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="modal-actions-row">
          {!capturedImage ? (
            <>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={Camera}
                disabled={cameraState !== 'active'}
                onClick={captureFrame}
              >
                Capture Face Frame
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleRetake} disabled={isVerifying}>
                Retake Photo
              </Button>
              <Button
                variant="primary"
                icon={ShieldCheck}
                isLoading={isVerifying}
                onClick={handleVerifyBiometrics}
              >
                Test Face Service Connection
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FaceCheckInModal;
