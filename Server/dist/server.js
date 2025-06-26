import { httpServer } from './app.js';
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`🎉 PartyHub server listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map