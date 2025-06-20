import { httpServer } from './app';

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🎉 PartyHub server listening on http://localhost:${PORT}`);
});