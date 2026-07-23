const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');
// const { v4: uuidv4 } = require('uuid'); // Removed as not used

const processMedia = async (file, customSubfolder = null) => {
  const isImage = file.mimetype.startsWith('image');
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;

  let folder = customSubfolder ? `uploads/${customSubfolder}` : 'uploads/docs';
  let fileName = `${uniqueName}${path.extname(file.originalname)}`;
  let extension = path.extname(file.originalname).replace('.', '');
  let mimetype = file.mimetype;
  let category = customSubfolder || 'document';

  if (isImage) {
    folder = customSubfolder ? `uploads/${customSubfolder}` : 'uploads/images';
    fileName = `${uniqueName}.webp`;
    extension = 'webp';
    mimetype = 'image/webp';
    category = customSubfolder || 'image';

    // Ensure folder exists
    await fs.ensureDir(folder);

    // Process image with Sharp
    await sharp(file.buffer)
      .webp({ quality: 80 })
      .toFile(path.join(folder, fileName));
  } else {
    // Ensure folder exists
    await fs.ensureDir(folder);

    // Save raw buffer for docs
    await fs.writeFile(path.join(folder, fileName), file.buffer);
  }

  return {
    originalName: file.originalname,
    storageName: fileName,
    mimetype,
    extension,
    size: file.size,
    url: `/${folder}/${fileName}`,
    fileCategory: category
  };
};

const deleteMedia = async (fileUrl) => {
  if (!fileUrl) return;
  try {
    const filePath = path.join(__dirname, '..', fileUrl);
    if (await fs.pathExists(filePath)) {
      await fs.unlink(filePath);
    }
  } catch (err) {
    console.error('Error deleting media file:', err.message);
  }
};

module.exports = { processMedia, deleteMedia };
