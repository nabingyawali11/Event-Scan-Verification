const fs = require('fs');
const csv = require('csv-parser');

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        resolve(results);
      })
      .on('error', (err) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        reject(err);
      });
  });
};

module.exports = { parseCSV };
