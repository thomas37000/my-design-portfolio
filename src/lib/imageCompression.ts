/**
 * Compresses an image file to WebP format using Canvas API.
 * @param file - The original image file
 * @param quality - WebP quality (0 to 1), default 0.82
 * @param maxWidth - Maximum width in pixels, default 1920
 * @returns A new File in WebP format
 */
export async function compressToWebP(
  file: File,
  quality = 0.82,
  maxWidth = 1920
): Promise<File> {
  // Skip if already a small file (< 50KB)
  if (file.size < 50 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;

      // Scale down if needed
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file); // fallback to original
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // Only use WebP if it's actually smaller
          if (blob.size >= file.size) {
            resolve(file);
            return;
          }

          const baseName = file.name.replace(/\.[^.]+$/, "");
          const webpFile = new File([blob], `${baseName}.webp`, {
            type: "image/webp",
          });
          resolve(webpFile);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}
