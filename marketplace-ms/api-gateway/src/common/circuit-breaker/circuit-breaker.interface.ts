export enum CircuitBreakerStateEnum {
  CLOSE = 'CLOSED', // O circuito está fechado, permitindo chamadas normais
  OPEN = 'OPEN', // O circuito está aberto, bloqueando chamadas
  HALF_OPEN = 'HALF_OPEN', // O circuito está meio aberto, permitindo algumas chamadas para testar a recuperação
}

export interface CircuitBreakerOptions {
  failureThreshold: number; // Número de falhas consecutivas antes de abrir o circuito
  timeout: number; // Tempo em milissegundos para manter o circuito aberto antes de tentar novamente
  resetTimeout: number; // Tempo em milissegundos para redefinir o contador de falhas após uma tentativa bem-sucedida
}

export interface CircuitBreakerState {
  state: CircuitBreakerStateEnum; // Estado atual do circuito
  failureCount: number; // Contador de falhas consecutivas
  lastFailureTime: number; // Timestamp da última falha
  nextAttemptTime: number; // Timestamp da próxima tentativa de chamada quando o circuito estiver aberto
}

export interface CircuitBreakerResult<T> {
  sucesss: boolean;
  data?: T;
  error?: Error;
  fromCache?: boolean;
}
