import { OrderManager } from '../../../src/core/engine/execution/orderManager';
import { mockSolana } from '../../fixtures';

describe('Order Execution', () => {
  const manager = new OrderManager(mockSolana);

  it('should create and execute orders', async () => {
    const orderId = await manager.createOrder('buy', 'SOL', 1, 100);
    const result = await manager.executeOrder(orderId);
    expect(result).toMatch(/^[A-Za-z0-9]{64}$/);
  });

  it('should reject expired orders', async () => {
    const orderId = await manager.createOrder('buy', 'SOL', 1, 100);
    jest.advanceTimersByTime(60000);
    await expect(manager.executeOrder(orderId))
      .rejects
      .toThrow('Order expired');
  });
});