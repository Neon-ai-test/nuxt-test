import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'notification.wav');

// Simple WAV header + PCM data for a "ding" sound
// Sine wave at 880Hz (A5) for 0.1s, decaying to 0
const sampleRate = 44100;
const duration = 0.3; // seconds
const frequency = 1200; // Hz (Higher pitch for notification)
const volume = 0.3;

const numSamples = Math.floor(sampleRate * duration);
const buffer = Buffer.alloc(44 + numSamples * 2);

// WAV Header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + numSamples * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20); // PCM
buffer.writeUInt16LE(1, 22); // Mono
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(numSamples * 2, 40);

// Data
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  // Apply a simple decay envelope
  const envelope = 1 - (i / numSamples); 
  const sample = Math.sin(2 * Math.PI * frequency * t) * volume * envelope * 32767;
  buffer.writeInt16LE(Math.floor(sample), 44 + i * 2);
}

fs.writeFileSync(filePath, buffer);
console.log('Sound file created at', filePath);
