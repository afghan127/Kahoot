let isFlooding = false;
let activeBots = 0;

function addLog(message, type = 'info') {
    const log = document.getElementById('log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function updateStatus(status) {
    document.getElementById('status').textContent = status;
}

function updateJoinedCount() {
    document.getElementById('joinedCount').textContent = activeBots;
}

async function joinBot(gamePin, botName) {
    try {
        // Simulate joining delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
        
        // Simulate successful join (you'll need to implement actual Kahoot API connection)
        const success = Math.random() > 0.2; // 80% success rate for simulation
        
        if (success) {
            activeBots++;
            updateJoinedCount();
            addLog(`✅ ${botName} joined successfully`, 'success');
            return true;
        } else {
            addLog(`❌ ${botName} failed to join`, 'error');
            return false;
        }
    } catch (error) {
        addLog(`⚠️ Error with ${botName}: ${error.message}`, 'error');
        return false;
    }
}

async function startFlood() {
    const gamePin = document.getElementById('gamePin').value.trim();
    const botNamePrefix = document.getElementById('botName').value.trim() || 'Bot';
    const botCount = parseInt(document.getElementById('botCount').value) || 10;
    const delay = parseInt(document.getElementById('delay').value) || 500;

    if (!gamePin) {
        alert('Please enter a game PIN');
        return;
    }

    // Validate game PIN (Kahoot pins are usually 7 digits)
    if (!/^\d{6,7}$/.test(gamePin)) {
        alert('Please enter a valid game PIN (6-7 digits)');
        return;
    }

    isFlooding = true;
    activeBots = 0;
    updateJoinedCount();
    
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
    document.getElementById('log').innerHTML = ''; // Clear log
    
    updateStatus('Flooding in progress...');
    addLog(`🚀 Starting flood for game PIN: ${gamePin}`);
    addLog(`📊 Creating ${botCount} bots with prefix: ${botNamePrefix}`);
    addLog(`⏱️ Delay between joins: ${delay}ms`);

    // Create bots
    for (let i = 1; i <= botCount && isFlooding; i++) {
        const botName = `${botNamePrefix}${i}`;
        addLog(`Attempting to join: ${botName}`);
        
        const joined = await joinBot(gamePin, botName);
        
        if (!joined && isFlooding) {
            addLog(`Retrying ${botName}...`, 'error');
            // Retry once
            await new Promise(resolve => setTimeout(resolve, 1000));
            await joinBot(gamePin, botName);
        }
        
        // Wait before next bot
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    if (isFlooding) {
        updateStatus('Flood completed!');
        addLog('🎉 Flood completed!', 'success');
    } else {
        updateStatus('Stopped');
        addLog('⏹️ Flood stopped by user', 'error');
    }
    
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    isFlooding = false;
}

function stopFlood() {
    isFlooding = false;
    updateStatus('Stopping...');
}

// Simulate joining animation
setInterval(() => {
    if (isFlooding) {
        // This just adds some visual interest while flooding
        const status = document.getElementById('status');
        status.style.opacity = status.style.opacity === '0.5' ? '1' : '0.5';
    }
}, 500);
