import { viteNodeApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

export { viteNodeApp };

if (process.env.NODE_ENV === 'production' || process.env.VITE === 'true') {
  const port = env.PORT;
  viteNodeApp.listen(port, () => {
    logger.info(`Servidor rodando na porta ${port}`);
  });
}

export { viteNodeApp };
