import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import { sendSuccess } from './utils/response';
import { logger } from './utils/logger';
import estimatesRoutes from './routes/estimates.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Configuração de Timeout para 60 segundos (conforme PRD)
app.use((req, res, next) => {
  res.setTimeout(60000, () => {
    logger.warn('Request timeout: O processamento de IA excedeu 60s');
    res.status(408).send({
      success: false,
      error: {
        code: 'TIMEOUT',
        message: 'O processamento da IA demorou mais que o esperado (60s).',
      },
    });
  });
  next();
});

// Rotas
app.use('/api/estimates', estimatesRoutes);

app.get('/health', (req, res) => {
  sendSuccess(res, { status: 'ok' });
});

// Middleware de Erro Global (sempre ao final)
app.use(errorHandler);

export const viteNodeApp = app;
