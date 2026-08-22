const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');

(async () => {
  const publicDir = path.join(__dirname, 'public');
  const files = fs.readdirSync(publicDir).filter(f => f.toLowerCase().endsWith('.heic'));
  
  if (files.length === 0) {
    console.log("No HEIC files found.");
    return;
  }
  
  for (const file of files) {
    const inputPath = path.join(publicDir, file);
    const outputPath = path.join(publicDir, file.replace(/\.HEIC$/i, '.jpeg'));
    
    console.log(`Converting ${file}...`);
    try {
      const inputBuffer = fs.readFileSync(inputPath);
      const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.8
      });
      fs.writeFileSync(outputPath, outputBuffer);
      console.log(`Successfully converted to ${outputPath}`);
      // delete the original
      fs.unlinkSync(inputPath);
      console.log(`Deleted ${file}`);
    } catch (err) {
      console.error(`Failed to convert ${file}:`, err);
    }
  }
})();
