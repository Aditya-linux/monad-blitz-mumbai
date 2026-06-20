import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repPath = path.join(__dirname, '../artifacts/contracts/ERC8004ReputationRegistry.sol/ERC8004ReputationRegistry.json');
const repJson = JSON.parse(fs.readFileSync(repPath, 'utf8'));

const outPath = path.join(__dirname, '../../frontend_next/src/lib/contracts.ts');

const content = `// Auto-generated contract ABIs and addresses
export const REPUTATION_REGISTRY_ADDRESS = "0x52D3a43152297aa8fC0d5404BC1bF87794E90566" as const;

export const REPUTATION_REGISTRY_ABI = ${JSON.stringify(repJson.abi, null, 2)} as const;
`;

fs.writeFileSync(outPath, content);
console.log("contracts.ts generated!");
