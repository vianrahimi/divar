'use client';
import React, { useState } from 'react';
import { IoIosClose, IoIosArrowForward } from 'react-icons/io';
import { requestOtp, verifyOtp } from '../services/api';

export default function AuthModal({ isOpen, onClose, onLogin }) {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!phone.match(/^09\d{9}$/)) {
            setError('شماره موبایل نامعتبر است (مثال: 09123456789)');
            return;
        }

        setLoading(true);
        try {
            await requestOtp(phone);
            setStep(2);
        } catch (err) {
            setError(err.message || 'خطا در ارسال کد تأیید');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (otp.length !== 6) {
            setError('کد تأیید باید ۶ رقم باشد');
            return;
        }
        
        setLoading(true);
        try {
            const res = await verifyOtp(phone, otp);
            onLogin(res.user);
            handleClose();
        } catch (err) {
            setError(err.message || 'کد تأیید اشتباه است');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setPhone('');
        setOtp('');
        setError('');
        onClose();
    };

    return (
        <div className="auth-modal-overlay" onClick={handleClose}>
            <div className="auth-modal-container" onClick={e => e.stopPropagation()}>
                <div className="auth-modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {step === 2 && (
                            <button className="auth-modal-back-btn" onClick={() => setStep(1)}>
                                <IoIosArrowForward size={24} />
                            </button>
                        )}
                        <h2 className="auth-modal-title">ورود به حساب کاربری</h2>
                    </div>
                    <button className="auth-modal-close-btn" onClick={handleClose}>
                        <IoIosClose size={28} />
                    </button>
                </div>

                <div className="auth-modal-content">
                    {step === 1 ? (
                        <form onSubmit={handlePhoneSubmit}>
                            <div className="auth-modal-subtitle">شماره موبایل خود را وارد کنید</div>
                            <p className="auth-modal-text">
                                برای استفاده از امکانات دیوار، لطفاً شماره موبایل خود را وارد کنید. کد تأیید به این شماره پیامک خواهد شد.
                            </p>
                            
                            <div className="auth-input-group">
                                <input
                                    type="tel"
                                    className={`auth-input ${error ? 'auth-input-error' : ''}`}
                                    placeholder="شماره موبایل"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    autoFocus
                                    dir="ltr"
                                />
                                {error && <div className="auth-error-msg">{error}</div>}
                            </div>

                            <p className="auth-modal-terms">
                                شرایط استفاده از خدمات و حریم خصوصی دیوار را می‌پذیرم.
                            </p>

                            <div className="auth-modal-footer">
                                <button type="submit" className={`btn-primary auth-submit-btn ${phone.length >= 10 && !loading ? 'active' : ''}`} disabled={phone.length < 10 || loading}>
                                    {loading ? 'صبر کنید...' : 'تأیید'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit}>
                            <div className="auth-modal-subtitle">کد تأیید را وارد کنید</div>
                            <p className="auth-modal-text">
                                کد پیامک‌شده به شمارۀ {phone} را وارد کنید.
                            </p>
                            
                            <div className="auth-input-group">
                                <input
                                    type="text"
                                    className={`auth-input ${error ? 'auth-input-error' : ''}`}
                                    placeholder="کد ۶ رقمی"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    autoFocus
                                    dir="ltr"
                                    style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '18px' }}
                                />
                                {error && <div className="auth-error-msg">{error}</div>}
                            </div>

                            <div className="auth-modal-footer">
                                <button type="submit" className={`btn-primary auth-submit-btn ${otp.length === 6 && !loading ? 'active' : ''}`} disabled={otp.length !== 6 || loading}>
                                    {loading ? 'صبر کنید...' : 'ورود'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
