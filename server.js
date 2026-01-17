const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3000;

// Request logging middleware (First to catch all)
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use(cors());
app.use(bodyParser.json());

// Helper function to execute PowerShell commands
function runPowerShell(command) {
    return new Promise((resolve, reject) => {
        // Create a temporary file path
        const tempFilePath = path.join(os.tmpdir(), `ps_script_${Date.now()}_${Math.random().toString(36).substring(7)}.ps1`);

        // Write the command to the temp file
        fs.writeFile(tempFilePath, command, { encoding: 'utf8' }, (writeErr) => {
            if (writeErr) {
                return reject('Failed to write temp file: ' + writeErr.message);
            }

            // Execute the temp file
            // -NoProfile: Faster load, skipping user profile
            // -ExecutionPolicy Bypass: Ensure we can run the script
            const psCommand = `powershell -NoProfile -ExecutionPolicy Bypass -File "${tempFilePath}"`;

            exec(psCommand, { maxBuffer: 1024 * 1024 * 5 }, (error, stdout, stderr) => {
                // Clean up the temp file
                fs.unlink(tempFilePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Failed to delete temp file:', unlinkErr);
                });

                if (error) {
                    console.error('PowerShell Error:', stderr);
                    return reject(stderr || error.message);
                }
                resolve(stdout.trim());
            });
        });
    });
}

// Get all environment variables (User + Machine)
app.get('/api/variables', async (req, res) => {
    try {
        const script = `
            $userVars = [Environment]::GetEnvironmentVariables('User')
            $machineVars = [Environment]::GetEnvironmentVariables('Machine')
            
            $result = @()
            
            foreach ($key in $userVars.Keys) {
                $result += @{
                    Name = $key
                    Value = $userVars[$key]
                    Target = 'User'
                }
            }
            
            foreach ($key in $machineVars.Keys) {
                # Merge logic: if exists in User, it's effectively overridden in process scope, 
                # but we want to show distinct entries for management.
                # However, usually we just list them. Let's just list them.
                $result += @{
                    Name = $key
                    Value = $machineVars[$key]
                    Target = 'Machine'
                }
            }
            
            $result | ConvertTo-Json -Depth 2
        `;

        const output = await runPowerShell(script);
        // PowerShell might return empty string if no vars (unlikely) or just plain JSON
        const data = output ? JSON.parse(output) : [];
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// Update or Create environment variable
app.post('/api/variables', async (req, res) => {
    const { name, value, target } = req.body; // target: 'User' or 'Machine'

    if (!name || !target) {
        return res.status(400).json({ error: 'Name and Target are required.' });
    }

    // PowerShell to set variable
    // [Environment]::SetEnvironmentVariable('Name', 'Value', 'Target')
    const script = `[Environment]::SetEnvironmentVariable('${name}', '${value}', '${target}')`;

    try {
        await runPowerShell(script);
        res.json({ success: true, message: `Variable ${name} set successfully in ${target} scope.` });
    } catch (error) {
        // Common error: SecurityException for Machine scope if not admin
        res.status(500).json({ error: 'Failed to set variable. Ensure you have admin rights for Machine scope. ' + error });
    }
});

// Delete environment variable
app.delete('/api/variables', async (req, res) => {
    const { name, target } = req.body;

    if (!name || !target) {
        return res.status(400).json({ error: 'Name and Target are required.' });
    }

    // To delete, set value to $null
    const script = `[Environment]::SetEnvironmentVariable('${name}', $null, '${target}')`;

    try {
        await runPowerShell(script);
        res.json({ success: true, message: `Variable ${name} deleted from ${target} scope.` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete variable. ' + error });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
