import type { MetaFunction } from "@remix-run/cloudflare";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Audio to Movie Converter" },
    { name: "description", content: "Convert audio files to videos for YouTube and X" },
  ];
};

export default function Index() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log('File selected:', selectedFile);
    
    if (selectedFile) {
      // ファイル形式の検証
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      const supportedFormats = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'opus', 'flac', 'wma', 'aiff', 'au', '3gp', 'amr', 'mp2', 'ac3'];
      
      if (!fileExtension || !supportedFormats.includes(fileExtension)) {
        setError(`Unsupported file format. Supported formats: ${supportedFormats.join(', ')}`);
        setFile(null);
        console.log('Unsupported file format:', fileExtension);
        return;
      }
      
      // ファイルサイズの検証
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size too large. Maximum size is 50MB.');
        setFile(null);
        console.log('File too large:', selectedFile.size);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      console.log('File state updated:', selectedFile.name, 'Size:', selectedFile.size);
    } else {
      setFile(null);
      console.log('No file selected');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace(/\.[^/.]+$/, '')}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Failed to process file');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Network error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
          Audio to Movie Converter
        </h1>
        
        <div style={{ 
          border: "2px dashed #ccc", 
          borderRadius: "8px", 
          padding: "2rem", 
          textAlign: "center",
          marginBottom: "2rem"
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="file"
                accept=".mp3,.wav,.m4a,.aac,.ogg,.opus,.flac,.wma,.aiff,.au,.3gp,.amr,.mp2,.ac3"
                onChange={handleFileChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px"
                }}
              />
            </div>
            
            {file && (
              <div style={{ marginBottom: "1rem", color: "#666" }}>
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
            
            {error && (
              <div style={{ marginBottom: "1rem", color: "#d32f2f", backgroundColor: "#ffebee", padding: "0.75rem", borderRadius: "4px" }}>
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={!file || isProcessing}
              onClick={() => console.log('Button clicked, file:', file, 'isProcessing:', isProcessing)}
              style={{
                backgroundColor: file && !isProcessing ? "#007bff" : "#ccc",
                color: "white",
                border: "none",
                padding: "0.75rem 2rem",
                borderRadius: "4px",
                cursor: file && !isProcessing ? "pointer" : "not-allowed",
                fontSize: "1rem"
              }}
            >
              {isProcessing ? "Processing..." : "Convert to Video"}
            </button>
            
            <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#999" }}>
              Debug: File selected: {file ? "Yes" : "No"}, Processing: {isProcessing ? "Yes" : "No"}
            </div>
          </form>
        </div>
        
        <div style={{ fontSize: "0.9rem", color: "#666", textAlign: "center" }}>
          <p><strong>対応フォーマット:</strong></p>
          <p>MP3, WAV, M4A, AAC, OGG, OPUS, FLAC, WMA, AIFF, AU, 3GP, AMR, MP2, AC3</p>
          <p>生成される動画は YouTube や X に最適化されます (1920x1080, MP4)</p>
        </div>
      </div>
    </div>
  );
}