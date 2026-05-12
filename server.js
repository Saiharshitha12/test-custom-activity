const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

// ✅ THIS serves config.json when SFMC asks for it
app.get('/config.json', (req, res) => {
  const configPath = path.join(__dirname, 'config.json');
  const config = fs.readFileSync(configPath, 'utf8');
  res.setHeader('Content-Type', 'application/json');
  res.send(config);
});

// ✅ EXECUTE — fires for every contact
app.post('/execute', (req, res) => {
  const args = Object.assign({}, ...req.body.inArguments);

  console.log('=================================');
  console.log('Contact received from Journey:');
  console.log('Contact Key  :', args.contactKey);
  console.log('Mobile       :', args.mobileNumber);
  console.log('First Name   :', args.firstName);
  console.log('=================================');

  return res.status(200).json({ status: 'ok' });
});

// Required lifecycle endpoints
app.post('/save',     (req, res) => res.status(200).json({ status: 'ok' }));
app.post('/publish',  (req, res) => res.status(200).json({ status: 'ok' }));
app.post('/validate', (req, res) => res.status(200).json({ status: 'ok' }));

// UI shown inside Journey Builder
app.get('/ui', (req, res) => {
  res.send(`
    <html>
    <body style="font-family:Arial; padding:20px;">
      <h3>Test Custom Activity</h3>
      <p>✅ Activity is configured</p>
      <p>Script will run for every contact</p>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Test Custom Activity running on port 3000');
});
