import { describe, it, expect } from 'vitest';
import { gameConfigurationSchema } from './GameConfigValidator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('GameCartridgeSchema (GameConfigValidator)', () => {

    // 1. The Happy Path
    it('should validate a correct game configuration (kahoot-clone.json)', () => {
        const configPath = path.resolve(__dirname, '../../game/configurations/kahoot-clone.json');
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const json = JSON.parse(configContent);

        const result = gameConfigurationSchema.safeParse(json);

        if (!result.success) {
            console.error('Validation errors:', JSON.stringify(result.error.format(), null, 2));
        }

        expect(result.success).toBe(true);
    });

    // 2. Structural Integrity
    it('should fail validation when "states" property is missing', () => {
        const configPath = path.resolve(__dirname, '../../game/configurations/kahoot-clone.json');
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const json = JSON.parse(configContent);

        // Remove states property
        delete json.states;

        const result = gameConfigurationSchema.safeParse(json);
        expect(result.success).toBe(false);
        if (!result.success) {
            // Verify that the error is about the missing states property
            const formatted = result.error.format();
            expect(formatted.states).toBeDefined();
        }
    });

    // 3. Action Whitelisting
    it('should fail validation with an invalid action function', () => {
        const configPath = path.resolve(__dirname, '../../game/configurations/kahoot-clone.json');
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const json = JSON.parse(configContent);

        // Inject invalid action
        // We'll add it to the "actions" section
        json.actions['maliciousAction'] = [
            {
                function: 'deleteDatabase', // Invalid function name
                args: []
            }
        ];

        const result = gameConfigurationSchema.safeParse(json);
        expect(result.success).toBe(false);
    });

    // 4. Component Whitelisting
    it('should fail validation with an unknown UI component', () => {
        const configPath = path.resolve(__dirname, '../../game/configurations/kahoot-clone.json');
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const json = JSON.parse(configContent);

        // Inject invalid component into a state's UI
        if (json.ui && json.ui.GET_READY && json.ui.GET_READY.host) {
            json.ui.GET_READY.host.components.push({
                component: 'IFrame', // Invalid component
                props: { src: 'http://malicious.site' }
            });
        } else {
            // Fallback if structure is different, though we know kahoot-clone.json structure
            // Create a minimal structure to test if needed, but modifying the loaded json is better
            throw new Error('Test setup failed: expected UI structure not found in kahoot-clone.json');
        }

        const result = gameConfigurationSchema.safeParse(json);
        expect(result.success).toBe(false);
    });
});
