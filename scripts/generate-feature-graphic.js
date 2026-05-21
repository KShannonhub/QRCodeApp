const fs = require('fs');
const path = require('path');

async function generateFeatureGraphic() {
  // Create canvas at exact Google Play dimensions
  const width = 1024;
  const height = 500;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add subtle background circles
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(200, 400, 150, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(800, 100, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Load and draw the cube icon
  try {
    const iconPath = path.join(__dirname, '..', 'public', 'header-icon.png');
    const icon = await loadImage(iconPath);
    
    const iconSize = 180;
    const iconX = (width - iconSize) / 2;
    const iconY = 60;
    
    // Add shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;
    
    ctx.drawImage(icon, iconX, iconY, iconSize, iconSize);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  } catch (err) {
    console.log('Could not load icon, drawing placeholder cube instead');
    // Draw a placeholder cube if icon not found
    const cubeSize = 180;
    const cubeX = (width - cubeSize) / 2;
    const cubeY = 60;
    
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.9;
    ctx.fillRect(cubeX + 30, cubeY, cubeSize - 60, cubeSize - 60);
    ctx.globalAlpha = 1.0;
  }

  // Draw "Cubey Scans" text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Add text shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  
  ctx.fillText('Cubey Scans', width / 2, 300);
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Draw subtitle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('QR Code Scanner & Generator', width / 2, 370);

  // Add decorative cube corners
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 3;
  
  // Corner cubes (rotated squares)
  const corners = [
    { x: 80, y: 60, size: 60 },
    { x: width - 120, y: 100, size: 40 },
    { x: 140, y: height - 80, size: 50 },
    { x: width - 80, y: height - 60, size: 45 }
  ];
  
  corners.forEach(corner => {
    ctx.save();
    ctx.translate(corner.x, corner.y);
    ctx.rotate(Math.PI / 4);
    ctx.strokeRect(-corner.size / 2, -corner.size / 2, corner.size, corner.size);
    ctx.restore();
  });

  // Save the image
  const outputPath = path.join(__dirname, '..', 'public', 'feature-graphic.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);

  console.log(`Feature graphic generated successfully!`);
  console.log(`Saved to: ${outputPath}`);
  console.log(`Dimensions: ${width}x${height} pixels`);
  console.log(`File size: ${(buffer.length / 1024).toFixed(2)} KB`);
}


