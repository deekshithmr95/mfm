import { render, screen } from '@testing-library/react';
import ToastContainer from '@/components/Toast';
import { useToastStore } from '@/store/useToastStore';

// Mock the Zustand store
jest.mock('@/store/useToastStore', () => ({
  useToastStore: jest.fn(),
}));

describe('ToastContainer', () => {
  it('renders nothing when there are no toasts', () => {
    (useToastStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = { toasts: [], removeToast: jest.fn() };
      return selector(state);
    });

    const { container } = render(<ToastContainer />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a success toast message correctly', () => {
    (useToastStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        toasts: [{ id: '1', type: 'success', message: 'Item saved successfully' }],
        removeToast: jest.fn(),
      };
      return selector(state);
    });

    render(<ToastContainer />);
    expect(screen.getByText('Item saved successfully')).toBeInTheDocument();
  });
});
