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

// ✅ EXECUTE — fires for every contact in journey
app.post('/execute', (req, res) => {
  try {
    const args = Object.assign({}, ...req.body.inArguments);

    console.log('=================================');
    console.log('Contact received from Journey:');
    console.log('Contact Key  :', args.contactKey);
    console.log('Mobile       :', args.mobileNumber);
    console.log('First Name   :', args.firstName);
    console.log('=================================');

    return res.status(200).json({ status: 'ok' });

  } catch (err) {
    console.error('Execute error:', err.message);
    return res.status(200).json({ status: 'error' });
  }
});

// ✅ SAVE — called when Done is clicked
app.post('/save', (req, res) => {
  console.log('Save called');
  res.status(200).json({
    status: 'ok',
    arguments: {
      execute: {
        inArguments: req.body.arguments?.execute?.inArguments || [],
        outArguments: []
      }
    }
  });
});

// ✅ PUBLISH — called when Journey activates
app.post('/publish', (req, res) => {
  console.log('Publish called');
  res.status(200).json({
    status: 'ok'
  });
});

// ✅ VALIDATE — called before activation
app.post('/validate', (req, res) => {
  console.log('Validate called');
  res.status(200).json({
    status: 'ok'
  });
});

// ✅ UI shown inside Journey Builder
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
        h3 { 
          color: #0070d2; 
        }
        .status {
          padding: 10px;
          background: #e8f5e9;
          border-left: 4px solid #4caf50;
          margin-top: 15px;
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
      </div>

      <script>
        // ✅ Listen for messages from Journey Builder
        window.addEventListener('message', function(event) {
          try {
            var data = JSON.parse(event.data);
            console.log('Message from JB:', data);

            // Journey Builder sends init — we respond ready
            if (data.method === 'init') {
              event.source.postMessage(
                JSON.stringify({ method: 'ready' }),
                event.origin
              );
            }

            // Journey Builder asks to save — we respond
            if (data.method === 'save') {
              event.source.postMessage(
                JSON.stringify({
                  method: 'save',
                  payload: {}
                }),
                event.origin
              );
            }

          } catch(e) {
            console.log('Message error:', e);
          }
        });

        // ✅ Notify Journey Builder on load
        window.onload = function() {
          parent.postMessage(
            JSON.stringify({ method: 'ready' }),
            '*'
          );
        };
      </script>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Test Custom Activity running on port 3000');
});
