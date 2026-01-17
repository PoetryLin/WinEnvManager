const { exec } = require('child_process');

function runPowerShell(command) {
    return new Promise((resolve, reject) => {
        const psCommand = `powershell -Command "${command.replace(/"/g, '\\"')}"`;
        exec(psCommand, { maxBuffer: 1024 * 1024 * 5 }, (error, stdout, stderr) => {
            if (error) {
                console.error('PowerShell Error:', stderr);
                return reject(stderr || error.message);
            }
            resolve(stdout.trim());
        });
    });
}

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
    
    $result | ConvertTo-Json -Depth 2
`;

console.log("Running logic...");
runPowerShell(script).then(output => {
    console.log("Output received by Node:");
    console.log(output.substring(0, 200) + "...");
}).catch(err => console.error(err));
