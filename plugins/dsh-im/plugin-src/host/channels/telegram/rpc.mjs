import {
  TOKEN_BOT_ENDPOINTS,
  createTokenBotRpcHandler,
  installTokenBotRpc,
} from '../shared/rpc.mjs';

export const TELEGRAM_RPC_CHANNEL = '/telegram';
export const TELEGRAM_ENDPOINTS = TOKEN_BOT_ENDPOINTS;
export const TELEGRAM_RPC_ENDPOINTS = Object.freeze(Object.values(TELEGRAM_ENDPOINTS));

export function createTelegramRpcHandler(controller) {
  return createTokenBotRpcHandler(controller, { channel: 'Telegram' });
}

export function installTelegramRpc(ctx, controller, authority) {
  return installTokenBotRpc(ctx, controller, {
    channel: 'Telegram',
    rpcChannel: TELEGRAM_RPC_CHANNEL,
    authority,
  });
}
