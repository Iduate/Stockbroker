import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Button, Input } from './ui';
import { 
  FaLock, FaBitcoin, FaPaypal, FaUniversity, FaCreditCard, 
  FaMoneyBillWave, FaMobile, FaQrcode, FaGoogle, FaApple,
  FaAlipay, FaWeixin 
} from 'react-icons/fa';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  maxAmount: number;
}

interface CryptoInfo {
  address: string;
  network: string;
}

interface BankInfo {
  accountNumber: string;
  routingNumber: string;
  accountName: string;
  bankName: string;
  swiftCode: string;
}

interface PayPalInfo {
  email: string;
}

interface CardInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

interface MobileMoneyInfo {
  phoneNumber: string;
  provider: string;
}

interface WeChatInfo {
  wechatId: string;
}

interface AlipayInfo {
  alipayId: string;
}

const LARGE_WITHDRAWAL_THRESHOLD = 10000; // $10,000
const HIGH_RISK_THRESHOLD = 50000; // $50,000

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  maxAmount,
}) => {
  const [amount, setAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    accountNumber: '',
    routingNumber: '',
    accountName: '',
    bankName: '',
    swiftCode: '',
  });
  const [cryptoInfo, setCryptoInfo] = useState<CryptoInfo>({
    address: '',
    network: 'ethereum',
  });
  const [paypalInfo, setPaypalInfo] = useState<PayPalInfo>({
    email: '',
  });
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
  });
  const [mobileMoneyInfo, setMobileMoneyInfo] = useState<MobileMoneyInfo>({
    phoneNumber: '',
    provider: 'mpesa',
  });
  const [wechatInfo, setWechatInfo] = useState<WeChatInfo>({
    wechatId: '',
  });
  const [alipayInfo, setAlipayInfo] = useState<AlipayInfo>({
    alipayId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [withdrawalStep, setWithdrawalStep] = useState<'initial' | 'verification' | '2fa' | 'security'>('initial');

  useEffect(() => {
    if (parseFloat(amount) >= LARGE_WITHDRAWAL_THRESHOLD) {
      setRequires2FA(true);
    }
  }, [amount]);

  const handleRequestWithdrawal = async () => {
    try {
      setError('');
      setIsLoading(true);

      if (parseFloat(amount) > maxAmount) {
        throw new Error('Insufficient funds');
      }

      // Additional security for large withdrawals
      if (parseFloat(amount) >= LARGE_WITHDRAWAL_THRESHOLD) {
        // Request 2FA verification
        const twoFactorResponse = await fetch('/api/auth/2fa/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        if (!twoFactorResponse.ok) {
          throw new Error('Failed to initiate 2FA verification');
        }

        setWithdrawalStep('2fa');
        return;
      }

      // For high-risk withdrawals, require security question
      if (parseFloat(amount) >= HIGH_RISK_THRESHOLD) {
        const securityResponse = await fetch('/api/auth/security-question', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (securityResponse.ok) {
          const { question } = await securityResponse.json();
          setSecurityQuestion(question);
          setWithdrawalStep('security');
          return;
        }
      }

      // Regular withdrawal flow
      const codeResponse = await fetch('/api/wallet/withdraw/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          amount,
          method: withdrawalMethod,
          isLargeAmount: parseFloat(amount) >= LARGE_WITHDRAWAL_THRESHOLD 
        }),
      });

      if (!codeResponse.ok) {
        throw new Error('Failed to request confirmation code');
      }

      setWithdrawalStep('verification');
      setShowConfirmation(true);
      
    } catch (err: any) {
      console.error('Error requesting withdrawal:', err);
      setError(err.message || 'Failed to initiate withdrawal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmWithdrawal = async () => {
    try {
      setError('');
      setIsLoading(true);

      const withdrawalData = {
        amount: parseFloat(amount),
        userId,
        withdrawalMethod,
        confirmationCode,
        ...(requires2FA && { twoFactorCode }),
        ...(securityQuestion && { securityQuestionAnswer }),
        ...(withdrawalMethod === 'bank' && { bankInfo }),
        ...(withdrawalMethod === 'crypto' && { cryptoInfo }),
        ...(withdrawalMethod === 'paypal' && { paypalInfo }),
        ...(withdrawalMethod === 'card' && { cardInfo }),
        ...(withdrawalMethod === 'mobileMoney' && { mobileMoneyInfo }),
        ...(withdrawalMethod === 'wechat' && { wechatInfo }),
        ...(withdrawalMethod === 'alipay' && { alipayInfo }),
      };

      const response = await fetch('/api/wallet/withdraw/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withdrawalData),
      });

      if (!response.ok) {
        throw new Error('Failed to process withdrawal');
      }

      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error('Error processing withdrawal:', err);
      setError(err.message || 'Failed to process withdrawal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderWithdrawalMethodFields = () => {
    switch (withdrawalMethod) {
      case 'bank':
        return (
          <div className="space-y-3">
            <Input
              label="Bank Name"
              value={bankInfo.bankName}
              onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
            <Input
              label="Account Number"
              value={bankInfo.accountNumber}
              onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
            <Input
              label="Routing Number"
              value={bankInfo.routingNumber}
              onChange={(e) => setBankInfo({ ...bankInfo, routingNumber: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
            <Input
              label="Account Holder Name"
              value={bankInfo.accountName}
              onChange={(e) => setBankInfo({ ...bankInfo, accountName: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
            <Input
              label="SWIFT Code (International)"
              value={bankInfo.swiftCode}
              onChange={(e) => setBankInfo({ ...bankInfo, swiftCode: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        );

      case 'crypto':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Network
              </label>
              <select
                value={cryptoInfo.network}
                onChange={(e) => setCryptoInfo({ ...cryptoInfo, network: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              >
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="bitcoin">Bitcoin (BTC)</option>
                <option value="usdt_trc20">USDT (TRC20)</option>
                <option value="usdt_erc20">USDT (ERC20)</option>
              </select>
            </div>
            <Input
              label="Wallet Address"
              value={cryptoInfo.address}
              onChange={(e) => setCryptoInfo({ ...cryptoInfo, address: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter your wallet address"
            />
          </div>
        );

      case 'paypal':
        return (
          <div className="space-y-3">
            <Input
              label="PayPal Email"
              type="email"
              value={paypalInfo.email}
              onChange={(e) => setPaypalInfo({ ...paypalInfo, email: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter your PayPal email"
            />
          </div>
        );

      case 'card':
        return (
          <div className="space-y-3">
            <Input
              label="Card Number"
              value={cardInfo.cardNumber}
              onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="XXXX XXXX XXXX XXXX"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Expiry Date"
                value={cardInfo.expiryDate}
                onChange={(e) => setCardInfo({ ...cardInfo, expiryDate: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="MM/YY"
              />
              <Input
                label="CVV"
                value={cardInfo.cvv}
                onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                type="password"
                maxLength={4}
                placeholder="***"
              />
            </div>
            <Input
              label="Cardholder Name"
              value={cardInfo.cardHolderName}
              onChange={(e) => setCardInfo({ ...cardInfo, cardHolderName: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        );

      case 'mobileMoney':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Provider
              </label>
              <select
                value={mobileMoneyInfo.provider}
                onChange={(e) => setMobileMoneyInfo({ ...mobileMoneyInfo, provider: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              >
                <option value="mpesa">M-Pesa</option>
                <option value="airtel">Airtel Money</option>
                <option value="mtn">MTN Mobile Money</option>
                <option value="orange">Orange Money</option>
              </select>
            </div>
            <Input
              label="Phone Number"
              value={mobileMoneyInfo.phoneNumber}
              onChange={(e) => setMobileMoneyInfo({ ...mobileMoneyInfo, phoneNumber: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="+1234567890"
            />
          </div>
        );

      case 'wechat':
        return (
          <div className="space-y-3">
            <Input
              label="WeChat ID"
              value={wechatInfo.wechatId}
              onChange={(e) => setWechatInfo({ ...wechatInfo, wechatId: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter your WeChat ID"
            />
          </div>
        );

      case 'alipay':
        return (
          <div className="space-y-3">
            <Input
              label="Alipay ID"
              value={alipayInfo.alipayId}
              onChange={(e) => setAlipayInfo({ ...alipayInfo, alipayId: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter your Alipay ID"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderVerificationStep = () => {
    switch (withdrawalStep) {
      case '2fa':
        return (
          <div className="space-y-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-sm">
              <FaGoogle className="inline-block mr-2" />
              Enter the code from your authenticator app
            </div>
            <Input
              label="2FA Code"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
          </div>
        );

      case 'security':
        return (
          <div className="space-y-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 text-sm">
              <FaLock className="inline-block mr-2" />
              {securityQuestion}
            </div>
            <Input
              label="Security Answer"
              value={securityQuestionAnswer}
              onChange={(e) => setSecurityQuestionAnswer(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              type="password"
              placeholder="Enter your answer"
            />
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-3">
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm">
              <FaLock className="inline-block mr-2" />
              A confirmation code has been sent to your email
            </div>
            <Input
              label="Confirmation Code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
              placeholder="Enter the 6-digit code"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black/50" />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#132F4C] shadow-xl rounded-2xl text-white">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-white mb-4 flex items-center"
          >
            <FaMoneyBillWave className="mr-2" />
            Withdraw Funds
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <Input
                type="number"
                label="Amount (USD)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                error={error}
                className="bg-white/10 border-white/20 text-white"
              />
              <p className="text-sm text-gray-400 mt-1">
                Available balance: ${maxAmount.toFixed(2)}
              </p>
              {parseFloat(amount) >= LARGE_WITHDRAWAL_THRESHOLD && (
                <p className="text-sm text-yellow-400 mt-1">
                  <FaLock className="inline-block mr-1" />
                  This amount requires additional verification
                </p>
              )}
            </div>

            {withdrawalStep === 'initial' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Withdrawal Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setWithdrawalMethod('bank')}
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      withdrawalMethod === 'bank'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <FaUniversity className="mr-2" />
                    Bank Transfer
                  </button>
                  <button
                    onClick={() => setWithdrawalMethod('crypto')}
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      withdrawalMethod === 'crypto'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <FaBitcoin className="mr-2" />
                    Crypto
                  </button>
                  <button
                    onClick={() => setWithdrawalMethod('paypal')}
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      withdrawalMethod === 'paypal'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <FaPaypal className="mr-2" />
                    PayPal
                  </button>
                  <button
                    onClick={() => setWithdrawalMethod('card')}
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      withdrawalMethod === 'card'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <FaCreditCard className="mr-2" />
                    Card
                  </button>
                  <button
                    onClick={() => setWithdrawalMethod('mobileMoney')}
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      withdrawalMethod === 'mobileMoney'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <FaMobile className="mr-2" />
                    Mobile Money
                  </button>
                  <button
                    onClick={() => setWithdrawalMethod('wechat')}
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      withdrawalMethod === 'wechat'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <FaWeixin className="mr-2" />
                    WeChat Pay
                  </button>
                  <button
                    onClick={() => setWithdrawalMethod('alipay')}
                    className={`p-3 rounded-lg flex items-center justify-center ${
                      withdrawalMethod === 'alipay'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <FaAlipay className="mr-2" />
                    Alipay
                  </button>
                </div>
              </div>
            )}

            {withdrawalStep === 'initial' && renderWithdrawalMethodFields()}
            {withdrawalStep !== 'initial' && renderVerificationStep()}
          </div>

          <div className="mt-6 flex space-x-3">
            {withdrawalStep === 'initial' ? (
              <Button
                onClick={handleRequestWithdrawal}
                disabled={!amount || isLoading || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoading ? 'Processing...' : 'Continue'}
              </Button>
            ) : (
              <Button
                onClick={handleConfirmWithdrawal}
                disabled={
                  isLoading || 
                  (withdrawalStep === '2fa' && !twoFactorCode) ||
                  (withdrawalStep === 'security' && !securityQuestionAnswer) ||
                  (withdrawalStep === 'verification' && !confirmationCode)
                }
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoading ? 'Processing...' : 'Confirm Withdrawal'}
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="secondary"
              disabled={isLoading}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default WithdrawModal; 