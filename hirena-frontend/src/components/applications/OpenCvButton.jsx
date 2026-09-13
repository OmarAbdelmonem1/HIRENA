import { useState } from "react";

export default function OpenCvButton({ loadCv, onError }) {
  const [loading, setLoading] = useState(false);

  const openCv = async () => {
    setLoading(true);
    const previewWindow = window.open("", "_blank");

    try {
      const response = await loadCv();
      const url = URL.createObjectURL(response.data);

      if (previewWindow) {
        previewWindow.location.href = url;
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }

      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      previewWindow?.close();
      onError?.(
        error.response?.data?.message || "Could not open candidate CV.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="primary-button full-button"
      onClick={openCv}
      disabled={loading}
    >
      {loading ? "Opening CV…" : "Open CV"}
    </button>
  );
}
