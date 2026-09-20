"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DotGridBackground from '@/components/DotGridBackground';
interface UserProfile {
  name: string;
  email: string;
  mobile_number: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
  name?: string;
  email?: string;
  mobile_number?: string;
}

interface MessageState {
  text: string;
  type: 'error' | 'success' | 'info' | '';
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    mobile_number: '',
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<MessageState>({ text: '', type: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpNewPassword, setOtpNewPassword] = useState('');
  const [otpConfirmPassword, setOtpConfirmPassword] = useState('');
  const [otpMsg, setOtpMsg] = useState<MessageState>({ text: '', type: '' });
  const [isOtpSent, setIsOtpSent] = useState(false);

  const API_BASE = 'https://simply-kwrn.onrender.com';

  useEffect(() => {
    const cachedName = localStorage.getItem('name') || '';
    const cachedEmail = localStorage.getItem('email') || '';
    const cachedMobile = localStorage.getItem('mobile_number') || '';
    setProfile({ name: cachedName, email: cachedEmail, mobile_number: cachedMobile });

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      setLoadingProfile(false);
      return;
    }

    fetch(`${API_BASE}/api/user-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (data.success) {
          setProfile({
            name: data.name || cachedName || 'User',
            email: data.email || cachedEmail || 'Registered User',
            mobile_number: data.mobile_number || cachedMobile || 'N/A',
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: '' });

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setPasswordMsg({ text: 'Please fill in all password fields', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters long', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    setIsUpdatingPassword(true);
    try {
      const res = await fetch(`${API_BASE}/api/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });
      const data: ApiResponse = await res.json();
      if (data.success) {
        setPasswordMsg({ text: 'Password updated successfully!', type: 'success' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ text: data.error || 'Failed to update password', type: 'error' });
      }
    } catch {
      setPasswordMsg({ text: 'Error connecting to server', type: 'error' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    localStorage.removeItem('access_token');
    localStorage.removeItem('name');
    localStorage.removeItem('mobile_number');
    localStorage.removeItem('login_timestamp');
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/delete-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      const data: ApiResponse = await res.json();
      if (data.success) {
        handleLogout();
      } else {
        setDeleteConfirmOpen(false);
        alert(`Account deletion failed: ${data.error || 'Unknown error. Please try again.'}`);
      }
    } catch {
      setDeleteConfirmOpen(false);
      alert('Could not connect to server. Please check your connection and try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative w-screen min-h-screen bg-simply-dark text-simply-coral font-satoshi flex items-center justify-center p-4">
      <DotGridBackground />

      <div className="relative z-10 w-[90%] max-w-[850px] max-h-[96vh] bg-simply-dark rounded-[24px] p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] border-[1.5px] border-simply-coral/20 overflow-y-auto">
        {/* Back Link */}
        <div className="relative inline-block group mb-6">
          <Link
            href="/"
            className="text-simply-coral text-xs font-semibold tracking-[0.15em] uppercase pb-1 inline-block no-underline"
          >
            ← BACK TO LANDING
          </Link>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-simply-coral scale-x-0 origin-left transition-transform duration-400 ease-out group-hover:scale-x-100" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-normal tracking-[0.15em] uppercase m-0">
            ACCOUNT SETTINGS
          </h1>
        </div>

        {/* Profile Details */}
        <div className="bg-white/[0.015] border-[1.5px] border-simply-coral/20 rounded-xl p-6 mb-6">
          <h3 className="text-sm font-bold tracking-[0.15em] uppercase mb-4 text-simply-coral">
            PROFILE DETAILS
          </h3>

          {loadingProfile ? (
            <p className="opacity-60 text-xs text-simply-cream">Loading user details...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-xs opacity-60 block mb-1 tracking-wider text-simply-cream">
                  FULL NAME
                </span>
                <span className="text-base font-semibold text-white">{profile.name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs opacity-60 block mb-1 tracking-wider text-simply-cream">
                  EMAIL ADDRESS
                </span>
                <span className="text-base font-semibold text-white">{profile.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs opacity-60 block mb-1 tracking-wider text-simply-cream">
                  MOBILE NUMBER
                </span>
                <span className="text-base font-semibold text-white">{profile.mobile_number || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="bg-white/[0.015] border-[1.5px] border-simply-coral/20 rounded-xl p-6 mb-6">
          <h3 className="text-sm font-bold tracking-[0.15em] uppercase mb-4 text-simply-coral">
            CHANGE PASSWORD
          </h3>

          <form onSubmit={handleChangePassword} className="max-w-md">
            <input
              type="password"
              placeholder="OLD PASSWORD"
              className="input-field"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="NEW PASSWORD"
              className="input-field"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="CONFIRM NEW PASSWORD"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="mt-2 mb-4 text-xs opacity-90">
              <span className="text-simply-cream">Forget Password? </span>
              <span
                onClick={() => {
                  setOtpMsg({ text: '', type: '' });
                  setOtpCode('');
                  setOtpNewPassword('');
                  setOtpConfirmPassword('');
                  setIsOtpSent(false);
                  setOtpModalOpen(true);
                }}
                className="text-simply-coral font-bold underline cursor-pointer hover:opacity-80"
              >
                Try another way
              </span>
            </div>

            <button type="submit" className="btn-sweep text-xs py-2.5 px-5" disabled={isUpdatingPassword}>
              {isUpdatingPassword ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </form>

          {passwordMsg.text && (
            <p
              className={`mt-3 text-xs font-semibold ${
                passwordMsg.type === 'error' ? 'text-danger-light' : 'text-simply-coral'
              }`}
            >
              {passwordMsg.text}
            </p>
          )}
        </div>

        {/* Danger Zone */}
        <div className="border-[1.5px] border-danger/40 rounded-xl bg-danger/[0.02] overflow-hidden mt-6">
          <div className="flex justify-between items-center p-4 md:p-5 gap-4 flex-wrap">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Logout of account</h4>
              <p className="text-xs text-white/65 m-0">
                Log out of your current session on this device.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-danger/10 border-[1.5px] border-danger/40 text-danger text-xs font-bold tracking-wider rounded-md py-2 px-4 hover:bg-danger/25 transition-all"
            >
              Logout
            </button>
          </div>

          <div className="border-t border-danger/20 flex justify-between items-center p-4 md:p-5 gap-4 flex-wrap">
            <div>
              <h4 className="text-sm font-bold text-danger mb-1">Delete this account</h4>
              <p className="text-xs text-white/65 m-0">
                Once you delete an account, there is no going back. Please be certain.
              </p>
            </div>
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="bg-danger/15 border-[1.5px] border-danger/50 text-danger text-xs font-bold tracking-wider rounded-md py-2 px-4 hover:bg-danger hover:text-simply-dark transition-all"
            >
              Delete account
            </button>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-simply-dark border-[1.5px] border-simply-coral rounded-2xl p-7 w-full max-w-md flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <h3 className="text-simply-coral text-lg font-bold mb-2 tracking-wider">
              OTP VERIFICATION
            </h3>
            <p className="text-white/80 text-xs leading-relaxed mb-4">
              Enter the OTP sent to your registered email ID (
              <strong className="text-simply-coral">{profile.email || 'your email'}</strong>):
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setOtpMsg({ text: '', type: '' });

                if (!isOtpSent) {
                  setOtpMsg({ text: 'Please click SEND OTP first', type: 'error' });
                  return;
                }
                if (!otpCode.trim()) {
                  setOtpMsg({ text: 'Please enter the 6-digit OTP code', type: 'error' });
                  return;
                }
                if (!otpNewPassword.trim() || !otpConfirmPassword.trim()) {
                  setOtpMsg({ text: 'Please enter and confirm your new password', type: 'error' });
                  return;
                }
                if (otpNewPassword.length < 6) {
                  setOtpMsg({ text: 'New password must be at least 6 characters long', type: 'error' });
                  return;
                }
                if (otpNewPassword !== otpConfirmPassword) {
                  setOtpMsg({ text: 'Passwords do not match', type: 'error' });
                  return;
                }

                const userEmail = profile.email || localStorage.getItem('email') || '';
                try {
                  const res = await fetch(`${API_BASE}/api/verify-otp-reset`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: userEmail,
                      otp: otpCode.trim(),
                      new_password: otpNewPassword,
                    }),
                  });
                  const data: ApiResponse = await res.json();
                  if (data.success) {
                    setOtpMsg({ text: 'Password reset successfully!', type: 'success' });
                    setTimeout(() => {
                      setOtpModalOpen(false);
                      setOtpCode('');
                      setOtpNewPassword('');
                      setOtpConfirmPassword('');
                      setOtpMsg({ text: '', type: '' });
                    }, 1500);
                  } else {
                    setOtpMsg({ text: data.error || 'Invalid or expired OTP', type: 'error' });
                  }
                } catch {
                  setOtpMsg({ text: 'Could not connect to server', type: 'error' });
                }
              }}
              className="w-full"
            >
              <div className="flex gap-2 w-full mb-3 items-center">
                <input
                  type="text"
                  placeholder="ENTER 6-DIGIT OTP"
                  className="input-field mb-0 text-center tracking-[0.15em] text-xs flex-1"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!isOtpSent) return;
                    if (!otpCode.trim()) {
                      setOtpMsg({ text: 'Please enter the OTP first', type: 'error' });
                      return;
                    }
                    setOtpMsg({ text: 'OTP ready for verification! Enter new password and click RESET.', type: 'success' });
                  }}
                  disabled={!isOtpSent}
                  className={`py-2 px-3 text-xs font-bold rounded ${
                    isOtpSent
                      ? 'btn-sweep whitespace-nowrap'
                      : 'bg-white/5 border border-white/20 text-white/30 cursor-not-allowed whitespace-nowrap'
                  }`}
                >
                  VERIFY
                </button>
              </div>

              <input
                type="password"
                placeholder="NEW PASSWORD"
                className="input-field text-xs py-2 px-3 mb-2"
                value={otpNewPassword}
                onChange={(e) => setOtpNewPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="CONFIRM NEW PASSWORD"
                className="input-field text-xs py-2 px-3 mb-3"
                value={otpConfirmPassword}
                onChange={(e) => setOtpConfirmPassword(e.target.value)}
              />

              {otpMsg.text && (
                <p
                  className={`mb-3 text-xs font-semibold ${
                    otpMsg.type === 'error' ? 'text-danger-light' : 'text-simply-coral'
                  }`}
                >
                  {otpMsg.text}
                </p>
              )}

              <div className="flex gap-3 justify-center mt-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setOtpModalOpen(false)}
                  className="py-2 px-4 bg-transparent border border-white/40 text-white rounded-md text-xs font-semibold hover:bg-white/10 transition-all"
                >
                  CANCEL
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const userEmail = profile.email || localStorage.getItem('email');
                    if (!userEmail) {
                      setOtpMsg({ text: 'No registered email found', type: 'error' });
                      return;
                    }
                    setOtpMsg({ text: 'Sending OTP email via Supabase...', type: 'info' });
                    try {
                      const res = await fetch(`${API_BASE}/api/send-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: userEmail }),
                      });
                      const data: ApiResponse = await res.json();
                      if (data.success) {
                        setIsOtpSent(true);
                        setOtpMsg({ text: data.message || `OTP email sent to ${userEmail}! Please check your email inbox.`, type: 'success' });
                      } else {
                        setOtpMsg({ text: data.error || 'Failed to send OTP email', type: 'error' });
                      }
                    } catch {
                      setOtpMsg({ text: 'Could not connect to server', type: 'error' });
                    }
                  }}
                  className="btn-sweep py-2 px-4 text-xs"
                >
                  SEND OTP
                </button>

                <button type="submit" className="btn-sweep py-2 px-4 text-xs">
                  RESET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-simply-dark border-[1.5px] border-danger rounded-2xl p-7 max-w-md w-full text-left shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <h3 className="text-danger text-lg font-bold mb-3 uppercase tracking-wider text-center">
              Delete Account Confirmation
            </h3>

            <p className="text-white/90 text-sm leading-relaxed mb-2">
              Deleting your account will permanently remove the following:
            </p>

            <ul className="text-white/75 text-xs leading-relaxed mb-4 pl-5 list-disc">
              <li>Your personal profile details</li>
              <li>Your account authentication records and security credentials</li>
              <li>Your saved interaction history</li>
            </ul>

            <div className="text-danger text-sm font-extrabold tracking-wider mb-5 text-center uppercase">
              ARE YOU SURE TO DELETE THIS ACCOUNT?
            </div>

            <div className="flex gap-3 justify-end flex-wrap">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="py-2 px-4 bg-transparent border border-white/30 text-white rounded-md text-xs font-semibold hover:bg-white/10 transition-all"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-danger/20 border border-danger text-danger text-xs font-bold py-2 px-4 rounded-md hover:bg-danger hover:text-simply-dark transition-all disabled:opacity-50"
              >
                {isDeleting ? 'DELETING...' : 'DELETE ACCOUNT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
