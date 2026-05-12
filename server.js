const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

// ✅ Serve config.json
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

// ✅ FIXED UI — properly communicates with Journey Builder
app.get('/ui', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: Arial; 
          padding: 20px; 
          background: #f4f4f4;
        }
        .card {
          background: white;
          padding: 20px;
          border-radius: 8px;
        }
        h3 { color: #0070d2; }
        .status {
          padding: 10px;
          background: #e8f5e9;
          border-left: 4px solid #4caf50;
          margin-top: 15px;
        }
        button {
          margin-top: 20px;
          padding: 10px 20px;
          background: #0070d2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h3>Test Custom Activity</h3>
        <p>This activity runs script for every contact.</p>
        <p>No email required.</p>
        <div class="status">
          ✅ Activity is configured and ready
        </div>
        <button onclick="done()">Done</button>
      </div>

      <script>
        // ✅ Tell Journey Builder UI is ready
        window.onload = function() {
          parent.postMessage(
            JSON.stringify({ method: 'ready' }), 
            '*'
          );
        };

        // ✅ Tell Journey Builder activity is saved
        function done() {
          parent.postMessage(
            JSON.stringify({ 
              method: 'save',
              payload: {
                name: 'Test Script Activity'
              }
            }), 
            '*'
          );
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Test Custom Activity running on port 3000');
});
