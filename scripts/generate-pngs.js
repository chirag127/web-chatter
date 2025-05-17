const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define icon sizes
const sizes = [16, 48, 128];

// Input SVG file
const svgPath = path.join(__dirname, '../assets-src/icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Output directory
const outputDir = path.join(__dirname, '../extension/icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate PNG files for each size
async function generatePNGs() {
  console.log('Generating PNG icons from SVG...');
  
  try {
    await Promise.all(sizes.map(async (size) => {
      const outputPath = path.join(outputDir, `icon-${size}.png`);
      await sharp(Buffer.from(svgContent))
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`Generated ${size}x${size} icon at ${outputPath}`);
    }));
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

// Run the generation
generatePNGs();
