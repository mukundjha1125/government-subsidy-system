import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES, DEMO_ACCOUNTS } from '../../constants/roles';
import {
    Shield,
    Lock,
    User,
    LogIn,
    Sparkles,
    ArrowRight,
    Building2,
    Crown,
    UsersRound,
    Landmark,
    IndianRupee,
    UserRound,
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const { login, quickSwitchRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handlePostLoginRedirect = (roles = []) => {
        const from = location.state?.from?.pathname;

        if (from && from !== '/login') {
            navigate(from, { replace: true });
            return;
        }

        if (roles.includes(ROLES.ADMIN)) {
            navigate('/admin/dashboard', { replace: true });
        } else if (
            roles.includes(ROLES.FIELD_OFFICER) ||
            roles.includes(ROLES.DISTRICT_OFFICER) ||
            roles.includes(ROLES.FINANCE_OFFICER)
        ) {
            navigate('/officer/dashboard', { replace: true });
        } else {
            navigate('/beneficiary/dashboard', { replace: true });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!username.trim() || !password.trim()) {
            setFormError('Please enter both username and password.');
            return;
        }

        setSubmitting(true);

        try {
            const data = await login(username.trim(), password);
            handlePostLoginRedirect(data.roles);
        } catch (err) {
            setFormError(
                err.message || 'Authentication failed. Please verify credentials.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleQuickLogin = async (account) => {
        setUsername(account.username);
        setPassword(account.password);
        setSubmitting(true);
        setFormError('');

        try {
            const data = await quickSwitchRole(account);
            handlePostLoginRedirect(data.roles);
        } catch (err) {
            setFormError(err.message || 'Quick login failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <div className="portal-header">
                <div className="portal-brand">
                    <div className="portal-emblem">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                            alt="State Emblem of India"
                        />
                    </div>

                    <div>
                        <div className="portal-gov">GOVERNMENT OF INDIA</div>
                        <div className="portal-title">Government Subsidy Portal</div>
                        <div className="portal-tagline">
                            Empowering Citizens • Transparent Governance • Brighter Tomorrow
                        </div>
                    </div>
                </div>

                <div className="portal-values">
                    <span>Sabka Saath</span>
                    <span>Sabka Vikas</span>
                    <span>Sabka Vishwas</span>
                    <span>Sabka Prayas</span>
                </div>

                <div className="tricolor-ribbon" aria-hidden="true">
                    <span className="ribbon saffron" />
                    <span className="ribbon white" />
                    <span className="ribbon green" />
                </div>
            </div>

            <div className="portal-subtitle">
                <Shield size={17} />
                <span>Secure Government Digital Services</span>
            </div>

            {formError && (
                <div className="global-error">
                    <span className="error-icon">!</span>
                    <span>{formError}</span>
                </div>
            )}

            <div className="login-content">
                {/* LOGIN - LEFT */}
                <section className="login-card">
                    <div className="card-heading">
                        <div className="card-heading-icon">
                            <Lock size={23} />
                        </div>
                        <div>
                            <h2>Login</h2>
                            <p>Enter your credentials to access the portal.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="login-field">
                            <label>
                                Username or Identity ID <span>*</span>
                            </label>

                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input
                                    type="text"
                                    className="login-input"
                                    placeholder="Enter username or identity ID"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={submitting}
                                    autoComplete="username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="login-field">
                            <label>
                                Password <span>*</span>
                            </label>

                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type="password"
                                    className="login-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={submitting}
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={submitting}
                            icon={LogIn}
                            style={{
                                width: '100%',
                                height: '52px',
                                marginTop: '7px',
                                borderRadius: '10px',
                            }}
                        >
                            Authenticate & Access Portal
                        </Button>
                    </form>

                    <div className="login-security">
                        <Shield size={14} />
                        <span>Your credentials are securely processed</span>
                    </div>

                    <div className="register-text">
                        New Beneficiary?{' '}
                        <Link to="/register">Register for Grant Subsidies</Link>
                    </div>
                </section>

                {/* QUICK TEST LOGIN - RIGHT */}
                <section className="quick-card">
                    <div className="card-heading">
                        <div className="card-heading-icon quick-icon">
                            <Sparkles size={23} />
                        </div>
                        <div>
                            <h2>Quick Test Login</h2>
                            <p>Use test accounts to explore different portal roles.</p>
                        </div>
                    </div>

                    <div className="quick-info">
                        <Shield size={15} />
                        <span>Select an account below for quick access.</span>
                    </div>

                    <div className="demo-grid">
                        {DEMO_ACCOUNTS.map((acc) => (
                            <button
                                key={acc.username}
                                type="button"
                                className="demo-account"
                                onClick={() => handleQuickLogin(acc)}
                                disabled={submitting}
                            >
                                <div className="demo-account-left">
                                    <div className="demo-account-icon">
                                        {acc.label?.toLowerCase().includes('admin') ? (
                                            <Crown size={18} />
                                        ) : acc.label?.toLowerCase().includes('field officer') ? (
                                            <UsersRound size={18} />
                                        ) : acc.label?.toLowerCase().includes('district') ? (
                                            <Landmark size={18} />
                                        ) : acc.label?.toLowerCase().includes('finance') ? (
                                            <IndianRupee size={18} />
                                        ) : (
                                            <UserRound size={18} />
                                        )}
                                    </div>

                                    <div className="demo-account-content">
                                        <div className="demo-account-label">{acc.label}</div>
                                        <div className="demo-account-username">
                                            {acc.username}
                                        </div>
                                    </div>
                                </div>

                                <ArrowRight size={17} className="demo-arrow" />
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            <div className="portal-footer">
                <div>
                    <Shield size={16} />
                    <span>Secure Digital Platform</span>
                </div>
                <div>
                    <Building2 size={16} />
                    <span>Government of India</span>
                </div>
                <div>
                    <span>Digital India • For a Better Tomorrow</span>
                </div>
            </div>

            <style>{`
        * {
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          width: 100%;
          padding: 28px 32px 24px;
          background:
            radial-gradient(circle at 10% 20%, rgba(38, 91, 153, 0.08), transparent 28%),
            radial-gradient(circle at 90% 80%, rgba(38, 91, 153, 0.06), transparent 30%),
            linear-gradient(135deg, #edf4fb 0%, #f8fafc 52%, #eaf1f8 100%);
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #142b46;
        }

        .portal-header {
          width: 100%;
          max-width: 1240px;
          min-height: 116px;
          margin: 0 auto 20px;
          padding: 22px 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border: 1px solid #c9d9e9;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 8px 30px rgba(20, 52, 84, 0.08);
          position: relative;
          overflow: hidden;
        }



        .tricolor-ribbon {
          position: absolute;
          right: 88px;
          top: -23px;
          width: 290px;
          height: 145px;
          transform: rotate(-5deg);
          z-index: 1;
          pointer-events: none;
          opacity: 0.92;
        }

        .tricolor-ribbon .ribbon {
          position: absolute;
          right: -35px;
          width: 310px;
          height: 70px;
          border-radius: 50%;
          transform: rotate(-2deg);
        }

        .tricolor-ribbon .saffron {
          top: 0;
          border-top: 8px solid #f28c28;
        }

        .tricolor-ribbon .white {
          top: 15px;
          border-top: 8px solid #ffffff;
        }

        .tricolor-ribbon .green {
          top: 30px;
          border-top: 8px solid #159447;
        }

        .portal-brand {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 18px;
          position: relative;
          z-index: 2;
        }

        .portal-icon {
          width: 66px;
          height: 66px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: #edf4fb;
          color: #174b83;
          border: 1px solid #d5e2ef;
        }
        .portal-emblem {
          width: 82px;
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .portal-emblem img {
          width: 72px;
          height: 78px;
          object-fit: contain;
          display: block;
        }

        .portal-gov {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: #52708f;
          margin-bottom: 4px;
        }

        .portal-title {
          font-size: 29px;
          line-height: 1.15;
          font-weight: 850;
          color: #102c4c;
          letter-spacing: -0.025em;
        }

        .portal-tagline {
          margin-top: 5px;
          font-size: 13px;
          color: #66809a;
        }

        .portal-values {
          position: relative;
          z-index: 4;
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin-right: 20px;
          padding-left: 155px;
          color: #42627f;
          font-size: 13px;
          font-weight: 700;
        }

        .portal-values::before {
          content: "✺";
          position: absolute;
          left: 80px;
          top: 14px;
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid #173f78;
          border-radius: 50%;
          color: #173f78;
          font-size: 37px;
          line-height: 1;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.9);
        }

        .portal-subtitle {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #456681;
          font-size: 12px;
          font-weight: 700;
        }

        .global-error {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto 14px;
          padding: 11px 14px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #fecaca;
          border-radius: 9px;
          background: #fff5f5;
          color: #b91c1c;
          font-size: 12px;
        }

        .error-icon {
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: #dc2626;
          color: white;
          font-size: 11px;
          font-weight: 800;
        }

        .login-content {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 22px;
        }

        .login-card,
        .quick-card {
          min-width: 0;
          padding: 30px;
          border: 1px solid #d8e2ec;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 14px 40px rgba(20, 52, 84, 0.09);
        }

        .quick-card {
          background: linear-gradient(145deg, #ffffff 0%, #f5f9fd 100%);
        }

        .card-heading {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5ebf1;
        }

        .card-heading-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 13px;
          background: #eaf2fb;
          color: #16528c;
        }

        .quick-icon {
          background: #eef3ff;
          color: #315fb0;
        }

        .card-heading h2 {
          margin: 0;
          font-size: 26px;
          line-height: 1.2;
          font-weight: 800;
          color: #102c4c;
        }

        .card-heading p {
          margin: 6px 0 0;
          font-size: 12px;
          line-height: 1.5;
          color: #71849a;
        }

        .login-field {
          margin-bottom: 18px;
        }

        .login-field label {
          display: block;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 750;
          color: #334b64;
        }

        .login-field label span {
          margin-left: 3px;
          color: #dc2626;
        }

        .input-wrapper {
          position: relative;
          width: 100%;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #8aa0b5;
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          height: 49px;
          padding: 0 14px 0 43px;
          border: 1px solid #d6e0ea;
          border-radius: 10px;
          outline: none;
          background: #f8fafc;
          color: #1e293b;
          font-size: 13px;
          transition: 0.2s ease;
        }

        .login-input::placeholder {
          color: #9aabba;
        }

        .login-input:focus {
          border-color: #2d69a5;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(45, 105, 165, 0.11);
        }

        .login-input:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .login-security {
          margin-top: 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #91a2b3;
          font-size: 10px;
        }

        .register-text {
          margin-top: 19px;
          text-align: center;
          font-size: 12px;
          color: #71849a;
        }

        .register-text a {
          color: #16528c;
          font-weight: 750;
          text-decoration: none;
        }

        .register-text a:hover {
          text-decoration: underline;
        }

        .quick-info {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: -10px 0 15px;
          padding: 9px 11px;
          border-radius: 8px;
          background: #eef5fb;
          color: #58728c;
          font-size: 11px;
        }

        .demo-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .demo-account {
          width: 100%;
          min-width: 0;
          min-height: 67px;
          padding: 10px 11px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 9px;
          border: 1px solid #dbe5ee;
          border-radius: 11px;
          background: #fff;
          text-align: left;
          cursor: pointer;
          transition: 0.16s ease;
        }

        .demo-account:nth-child(1) .demo-account-icon {
          background: #f0eaff;
          color: #5b31c4;
        }

        .demo-account:nth-child(2) .demo-account-icon {
          background: #e7f8e9;
          color: #159447;
        }

        .demo-account:nth-child(3) .demo-account-icon {
          background: #fff0df;
          color: #ee741c;
        }

        .demo-account:nth-child(4) .demo-account-icon {
          background: #fde8f1;
          color: #df2468;
        }

        .demo-account:nth-child(5) .demo-account-icon {
          background: #e7f2ff;
          color: #1769c2;
        }

        .demo-account:nth-child(6) .demo-account-icon {
          background: #e7f8f1;
          color: #159b69;
        }

        .demo-account:hover:not(:disabled) {
          border-color: #9fb8cf;
          background: #f5f9fc;
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(28, 71, 110, 0.08);
        }

        .demo-account:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .demo-account-left {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .demo-account-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: #edf4fb;
          color: #2c659d;
        }

        .demo-account-content {
          min-width: 0;
        }

        .demo-account-label {
          margin-bottom: 3px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 11px;
          font-weight: 750;
          color: #193b5d;
        }

        .demo-account-username {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 10px;
          color: #73879a;
        }

        .demo-arrow {
          flex-shrink: 0;
          color: #8196aa;
        }

        .portal-footer {
          width: 100%;
          max-width: 1240px;
          margin: 22px auto 0;
          padding: 15px 10px 0;
          border-top: 1px solid #cbd8e4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          color: #678098;
          font-size: 10px;
        }

        .portal-footer > div {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        @media (max-width: 900px) {
          .login-page {
            padding: 20px;
          }

          .portal-header {
            padding: 20px;
          }

          .portal-values {
            display: none;
          }

          .portal-gov {
            font-size: 9px;
          }

          .portal-title {
            font-size: 19px;
          }

          .portal-tagline {
            font-size: 10px;
          }

          .login-card,
          .quick-card {
            padding: 21px;
            border-radius: 14px;
          }

          .card-heading {
            margin-bottom: 22px;
          }

          .card-heading h2 {
            font-size: 23px;
          }

          .demo-grid {
            grid-template-columns: 1fr;
          }

          .portal-footer {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
        </div>
    );
};
