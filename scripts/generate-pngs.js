const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define icon sizes
const sizes = [16, 48, 128];

// Input SVG file
const svgPath = path.join(__dirname, '../extension/icons/icon.svg');
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
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon${size}.png`);
    
    try {
      await sharp(Buffer.from(svgContent))
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Created: ${outputPath}`);
    } catch (error) {
      console.error(`Error generating ${size}x${size} icon:`, error);
    }
  }
  
  console.log('Icon generation complete!');
}

// Run the generation
generatePNGs();
