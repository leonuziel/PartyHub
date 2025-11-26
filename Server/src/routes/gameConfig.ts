import express, { Request, Response, NextFunction } from 'express';
import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configsDir = path.join(__dirname, '../game/configurations');

// Error handling middleware for async routes
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

// GET /api/game-configs - List all available game configurations
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const files = await fs.readdir(configsDir);
    const gameConfigs = await Promise.all(
        files
            .filter(file => file.endsWith('.json'))
            .map(async file => {
                try {
                    const filePath = path.join(configsDir, file);
                    const fileContent = await fs.readFile(filePath, 'utf-8');
                    const config = JSON.parse(fileContent);
                    return config.metadata;
                } catch (err) {
                    console.error(`Could not process file ${file}.`, err);
                    return null; // Ignore corrupted files
                }
            })
    );
    res.json(gameConfigs.filter(config => config !== null));
}));

// GET /api/game-configs/:gameId - Get a specific game configuration
router.get('/:gameId', asyncHandler(async (req: Request, res: Response) => {
    const { gameId } = req.params;
    const filePath = path.join(configsDir, `${gameId}.json`);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const config = JSON.parse(data);
        res.json(config);
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            return res.status(404).send('Game configuration not found.');
        }
        console.error(`Could not read file for gameId ${gameId}.`, err);
        res.status(500).send('Server error');
    }
}));

// POST /api/game-configs - Create a new game configuration
router.post('/', asyncHandler(async (req, res) => {
    const newConfig = req.body;

    if (!newConfig.metadata || !newConfig.metadata.gameId) {
        return res.status(400).send('Invalid configuration: metadata.gameId is required.');
    }

    const { gameId } = newConfig.metadata;
    const filePath = path.join(configsDir, `${gameId}.json`);

    try {
        await fs.access(filePath);
        return res.status(409).send('A game with this gameId already exists.');
    } catch {
        // File doesn't exist, which is what we want.
    }
    
    await fs.mkdir(configsDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(newConfig, null, 2));
    console.log(`[GameConfig] New game saved: ${gameId}.json`);
    res.status(201).json(newConfig);
}));

// PUT /api/game-configs/:gameId - Update an existing game configuration
router.put('/:gameId', asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    const updatedConfig = req.body;
    const filePath = path.join(configsDir, `${gameId}.json`);

    try {
        await fs.access(filePath);
    } catch {
        return res.status(404).send('Game configuration not found.');
    }
    
    if (updatedConfig.metadata?.gameId !== gameId) {
        return res.status(400).send('The gameId in the request body must match the URL parameter.');
    }

    await fs.mkdir(configsDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(updatedConfig, null, 2));
    console.log(`[GameConfig] Game updated: ${gameId}.json`);
    res.json(updatedConfig);
}));

// DELETE /api/game-configs/:gameId - Delete a game configuration
router.delete('/:gameId', asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    const filePath = path.join(configsDir, `${gameId}.json`);
    
    try {
        await fs.unlink(filePath);
        res.status(204).send();
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            return res.status(404).send('Game configuration not found.');
        }
        console.error(`Error deleting file for gameId ${gameId}.`, err);
        res.status(500).send('Server error');
    }
}));

export default router;
