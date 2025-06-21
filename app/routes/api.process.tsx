import type { ActionFunctionArgs } from "@remix-run/cloudflare";

const SUPPORTED_FORMATS = [
  'mp3', 'wav', 'm4a', 'aac', 'ogg', 'opus', 'flac', 'wma', 
  'aiff', 'au', '3gp', 'amr', 'mp2', 'ac3'
];

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return new Response("No audio file provided", { status: 400 });
    }

    // ファイル形式の検証
    const fileExtension = audioFile.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !SUPPORTED_FORMATS.includes(fileExtension)) {
      return new Response(`Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`, { status: 400 });
    }

    // ファイルサイズの制限 (50MB)
    if (audioFile.size > 50 * 1024 * 1024) {
      return new Response("File size too large. Maximum size is 50MB.", { status: 400 });
    }

    const audioBuffer = await audioFile.arrayBuffer();
    const audioData = new Uint8Array(audioBuffer);

    const videoBuffer = await generateVideo(audioData, audioFile.name, fileExtension);

    return new Response(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${audioFile.name.replace(/\.[^/.]+$/, '')}.mp4"`,
      },
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

async function generateVideo(audioData: Uint8Array, filename: string, format: string): Promise<ArrayBuffer> {
  const canvas = new OffscreenCanvas(1920, 1080);
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, 1920, 1080);

  ctx.fillStyle = "#ffffff";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Audio Visualization", 960, 350);

  ctx.font = "32px Arial";
  ctx.fillStyle = "#888888";
  ctx.fillText(filename.replace(/\.[^/.]+$/, ''), 960, 420);

  ctx.font = "24px Arial";
  ctx.fillStyle = "#666666";
  ctx.fillText(`Format: ${format.toUpperCase()} | Size: ${(audioData.length / 1024 / 1024).toFixed(2)} MB`, 960, 460);

  const waveformHeight = 200;
  const waveformY = 600;
  const waveformWidth = 1600;
  const waveformX = (1920 - waveformWidth) / 2;

  ctx.strokeStyle = "#00ff88";
  ctx.lineWidth = 2;
  ctx.beginPath();

  const samples = 400;
  for (let i = 0; i < samples; i++) {
    const x = waveformX + (i / samples) * waveformWidth;
    const dataIndex = Math.floor((i / samples) * audioData.length);
    const sample = audioData[dataIndex] || 0;
    const normalizedSample = (sample - 128) / 128;
    const y = waveformY + normalizedSample * (waveformHeight / 2);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  const imageData = ctx.getImageData(0, 0, 1920, 1080);
  
  const videoData = createMP4WithStaticImage(imageData, 10);
  
  return videoData;
}

function createMP4WithStaticImage(imageData: ImageData, durationSeconds: number): ArrayBuffer {
  const width = imageData.width;
  const height = imageData.height;
  const fps = 30;
  const totalFrames = durationSeconds * fps;
  
  const mp4Header = new Uint8Array([
    0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70,
    0x69, 0x73, 0x6f, 0x6d, 0x00, 0x00, 0x02, 0x00,
    0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32,
    0x61, 0x76, 0x63, 0x31, 0x6d, 0x70, 0x34, 0x31
  ]);
  
  const frameSize = width * height * 3;
  const videoSize = mp4Header.length + frameSize * totalFrames;
  const buffer = new ArrayBuffer(videoSize);
  const view = new Uint8Array(buffer);
  
  view.set(mp4Header, 0);
  
  let offset = mp4Header.length;
  const rgbData = new Uint8Array(frameSize);
  
  for (let i = 0; i < imageData.data.length; i += 4) {
    const rgbIndex = (i / 4) * 3;
    rgbData[rgbIndex] = imageData.data[i];
    rgbData[rgbIndex + 1] = imageData.data[i + 1]; 
    rgbData[rgbIndex + 2] = imageData.data[i + 2];
  }
  
  for (let frame = 0; frame < totalFrames; frame++) {
    view.set(rgbData, offset);
    offset += frameSize;
  }
  
  return buffer;
}