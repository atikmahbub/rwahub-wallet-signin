import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';
import { getTargetNetwork, useAuthStore } from '@/store/authStore';
import { AnimatedLogo } from './AnimatedLogo';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    connectWallet,
    switchToPharos,
    disconnectWallet,
    error,
    clearError,
    walletStatus,
    user,
  } = useAuthStore();
  const hasWallet = typeof window !== 'undefined' && Boolean((window as any).ethereum);
  const status = !hasWallet && walletStatus === 'disconnected' ? 'no-wallet' : walletStatus;
  const address = user?.wallet?.address;
  const navigate = useNavigate();

  const goToDashboard = useCallback(() => {
    onClose();
    useAuthStore.getState().closeAuthModal();
    navigate('/dashboard', { replace: true });
  }, [navigate, onClose]);

  useEffect(() => {
    // only leave the modal once we're on the right chain, otherwise the user never sees the warning
    if (isOpen && walletStatus === 'connected') {
      goToDashboard();
    }
  }, [isOpen, walletStatus, goToDashboard]);

  // Handle escape key press
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Add/remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

  // Handle Web3 wallet connection
  const handleWeb3Connect = async () => {
    clearError();
    await connectWallet();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative w-full max-w-[456px] transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 transition-colors rounded-full hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>

                  {/* Header */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-[180px]" aria-hidden="true">
                      <AnimatedLogo />
                    </div>
                    <h2
                      id="modal-title"
                      className="text-[28px] font-bold text-blue-700"
                    >
                      Connect Wallet
                    </h2>
                    <p className="text-base text-neutral-600">
                      Connect your wallet to access the platform
                    </p>
                  </div>

                  <div className="mt-8 space-y-4" aria-live="polite">
                    {status === 'no-wallet' && (
                      <>
                        <p className="text-sm text-neutral-600 text-center">
                          You need the MetaMask extension to sign in. Install it, then refresh this page.
                        </p>
                        <a
                          href="https://metamask.io/download/"
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary w-full flex items-center justify-center gap-2"
                        >
                          Install MetaMask <ExternalLink size={14} />
                        </a>
                      </>
                    )}

                    {status === 'connecting' && (
                      <div className="flex flex-col items-center gap-2 py-2 text-sm text-neutral-600">
                        <Loader2 size={20} className="animate-spin text-blue-600" />
                        Confirm the request in MetaMask...
                      </div>
                    )}

                    {status === 'wrong-network' && (
                      <>
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                          <p className="flex items-center gap-2 font-medium">
                            <AlertTriangle size={16} /> Wrong network
                          </p>
                          <p className="mt-1">{error}</p>
                          {address && (
                            <p className="mt-2 font-mono text-xs text-amber-700">
                              {address.slice(0, 6)}...{address.slice(-4)}
                            </p>
                          )}
                        </div>
                        <Button fullWidth onClick={() => switchToPharos()}>
                          Switch to {getTargetNetwork().config.chainName}
                        </Button>
                        <button
                          type="button"
                          onClick={() => disconnectWallet()}
                          className="w-full text-sm text-neutral-500 hover:text-neutral-700"
                        >
                          Disconnect
                        </button>
                      </>
                    )}

                    {(status === 'disconnected' || status === 'rejected' || status === 'error') && (
                      <>
                        {status !== 'disconnected' && error && (
                          <div
                            role="alert"
                            className={`rounded-lg border p-3 text-sm ${
                              status === 'rejected'
                                ? 'border-amber-200 bg-amber-50 text-amber-800'
                                : 'border-red-200 bg-red-50 text-red-600'
                            }`}
                          >
                            {error}
                          </div>
                        )}
                        <Button
                          fullWidth
                          icon={<Wallet size={16} />}
                          iconPosition="left"
                          onClick={handleWeb3Connect}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                        >
                          {status === 'disconnected' ? 'Continue with Wallet' : 'Try again'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};