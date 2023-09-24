const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

const jsonFilePath = path.resolve('../frontend/js/pipelines.json');

// Allow preflight (OPTIONS) requests
app.options('/save-pipeline', cors());

app.post('/save-pipeline', (req, res) => {
  const data = req.body;

  // Load the existing JSON file
  fs.readFile(jsonFilePath, (err, fileData) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const existingData = JSON.parse(fileData);

    // Add the new entry to the JSON data
    existingData.push(data);

    // Write the updated JSON data back to the file
    fs.writeFile(jsonFilePath, JSON.stringify(existingData, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.status(201).json({ message: 'Entry added successfully' });
    });
  });
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
