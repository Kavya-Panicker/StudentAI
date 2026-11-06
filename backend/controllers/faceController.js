const getFaceServiceHealth = async (req, res) => {
  try {
    const response = await fetch("http://127.0.0.1:5001/health", {
      signal: AbortSignal.timeout(5000),
    });

    const data = await response.json();

    return res.status(response.ok ? 200 : 502).json({
      success: response.ok,
      message: "Python face service health check",
      faceService: data,
    });
  } catch (error) {
    console.error("Face service connection error:", error.message);

    return res.status(503).json({
      success: false,
      message: "Python face-recognition service is unavailable",
    });
  }
};

module.exports = { getFaceServiceHealth };
