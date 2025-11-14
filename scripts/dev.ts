import { spawn } from 'child_process';

const env = {
	...process.env,
	DEV_MODE: process.env.DEV_MODE ?? 'true',
};

const child = spawn('vite', {
	stdio: 'inherit',
	shell: true,
	env,
});

child.on('exit', (code) => {
	process.exit(code ?? 0);
});
