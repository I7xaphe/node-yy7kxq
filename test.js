const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {
    // Function to be executed in the worker thread
    const workerScript = `
    const { parentPort, isMainThread } = require('worker_threads');

    if (!isMainThread) {
        setInterval(() => {
        parentPort.postMessage('Hello from the worker thread!');
        }, 1000);
    }
  `;

    // Create a new worker thread
    const worker = new Worker(workerScript, { eval: true });

    // Handle messages from the worker thread
    worker.on('message', (message) => {
        console.log(`Received message from worker: ${message}`);
    });
}
