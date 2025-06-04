"use client";

import { LeftOutlined } from "@ant-design/icons";
import { Button, Card, ConfigProvider, Divider, Input, message, Tabs, TabsProps } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ContinueButton from "./continueButton";
import { Steps } from "@/enums/loginsteps.enum";
import {
  getCachedUserInfoToken,
} from "@/utils/account";
import { handleLoginSuccess } from "@/utils/auth";

import {
  useExchangeGoogleTokenMutation,
  useLazyGetGoogleAuthUrlQuery,
  useLoginMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
} from "@/api/aroomy-api";

const resendCodeCounterBack = 60;

const LoginCard = ({ className }: { className?: string }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);
  const [loginSteps, setLoginSteps] = useState<Steps>(Steps.EMAIL_FIRST_STEP);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailCode, setEmailCode] = useState<string>("");
  const [emailCodeError, setEmailCodeError] = useState<string | null>(null);
  const [newEmailUserName, setNewEmailUserName] = useState<string>("");
  const [newEmailUserNameError, setNewEmailUserNameError] = useState<
    string | null
  >(null);
  const [submitEmailLoading, setSubmitEmailLoading] = useState<boolean>(false);
  const [emailCodeLoading, setEmailCodeLoading] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(resendCodeCounterBack);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'code'>('password');
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const getQueryParam = (param: string) => isBrowser ? searchParams.get(param) : null;

  const [exchangeGoogleToken] = useExchangeGoogleTokenMutation();
  const [getGoogleAuthUrl] = useLazyGetGoogleAuthUrlQuery();


  const [requestOtp] = useRequestOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [login] = useLoginMutation();

  useEffect(() => {
    if (
      resendTimer > 0 &&
      (loginSteps === Steps.EMAIL_THIRD_STEP ||
        loginSteps === Steps.EMAIL_LOGIN_STEP)
    ) {
      timerRef.current = setTimeout(
        () => setResendTimer(resendTimer - 1),
        1000
      );
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resendTimer, loginSteps]);

  useEffect(() => {
    if (!isBrowser || !router) return;
    const loginWithGoogle = async () => {
      const token = getCachedUserInfoToken();
      const code = getQueryParam('code');
      if (!token && !code) {
        return;
      }
      console.log(code, 'code');
      if (code && typeof code === 'string') {
        try {
          const res = await exchangeGoogleToken({
            exchangeTokenV1Request: {
              code: code || '',
              redirectUri: `${window.location.origin}/login`,
            },
          });
          handleLoginSuccess(res.user, res.token, router);
          window.location.href = '/';
        } catch (error) {
          console.error("Error exchanging Google token:", error);
          message.error("Something went wrong, please try again");
          router.replace('/');
        }
      }
    };

    loginWithGoogle();
  }, [exchangeGoogleToken, searchParams, router, isBrowser, getQueryParam]);

  useEffect(() => {
    setEmailCode("");
  }, [loginSteps])


  const googleLogin = useCallback(async () => {
    try {
      const data = await getGoogleAuthUrl({
        redirectUri: `${location.origin}/login`,
      });
      console.log(data, 'data');
      if (data.authUrl) {
        location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Failed to get Google auth URL:", error);
      message.error("Failed to get Google auth URL");
    }
  }, [getGoogleAuthUrl]);

  const backToInputEmailStep = useCallback(() => {
    setNewEmailUserNameError(null);
    setLoginSteps(Steps.EMAIL_FIRST_STEP);
  }, []);

  const backToEmailSecondStep = useCallback(() => {
    setEmailCodeError(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setResendLoading(false);
    setResendTimer(resendCodeCounterBack);
    setLoginSteps(Steps.EMAIL_FIRST_STEP);
  }, []);

  const handleEmailSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(email)
    if (emailRegex.test(email)) {
      try {
        setSubmitEmailLoading(true);
        
        if (loginMethod === 'code') {
          setLoginSteps(Steps.EMAIL_LOGIN_STEP);
          await requestOtp({
            requestOtpV1Request: { type: "EMAIL", contact: email },
          });
        } else {
          if (!password) {
            setPasswordError("Please enter your password");
            setSubmitEmailLoading(false);
            return;
          }
          
          try {
            const res = await login({ 
              loginV1Request: { contact: email, password, type: "EMAIL" } 
            });
            
            handleLoginSuccess(res.user, res.token, router);
            setTimeout(() => window.location.reload(), 100);
          } catch (error) {
            console.error("Login failed:", error);
            setLoginMethod('code');
            message.error("Login failed, try using verification code");
          }
        }
      } catch (error) {
        message.error("Login failed, please try again");
        console.log('error', error);
      } finally {
        setSubmitEmailLoading(false);
        setEmailError(null);
      }
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  const handleNewEmailNameSubmit = async () => {
    if (newEmailUserName && newEmailUserName.trim()) {
      setLoginSteps(Steps.EMAIL_THIRD_STEP);
      setNewEmailUserNameError(null);

      await requestOtp({
        requestOtpV1Request: { type: "EMAIL", contact: email },
      });
    } else {
      setEmailError("Please enter a valid name.");
    }
  };

  const handleEmailCodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const regex = /^\\d*$/;
    if (regex.test(value)) {
      setEmailCode(value);
      if (value.length === 6) {
        try {
          setEmailCodeLoading(true);
          const { success, user, token } = await verifyOtp({
            verifyOtpV1Request: {
              type: "EMAIL",
              contact: email,
              code: value,
            },
          });
          
          if (success) {
            handleLoginSuccess(user, token, router);
            setTimeout(() => window.location.reload(), 100);
          } else {
            message.error("Invalid code");
          }
        } catch (err) {
          console.error("Error verifying OTP:", err);
          message.error("Something went wrong, please try again");
          router.replace("/login");
        } finally {
          setEmailCodeLoading(false);
        }
      }
    }
  };

  const handleEmailCodeSubmit = async () => {
    const codeRegex = /^\\d{6}$/;
    if (codeRegex.test(emailCode)) {
      try {
        setEmailCodeLoading(true);
        const { success, user, token } = await verifyOtp({
          verifyOtpV1Request: {
            type: "EMAIL",
            contact: email,
            code: emailCode,
          },
        });

        if (success) {
          handleLoginSuccess(user, token, router);
          setTimeout(() => window.location.reload(), 100);
        } else {
          message.error("Invalid code");
        }
      } catch (err: unknown) {
        console.error("Error verifying OTP:", err);
        if (err && typeof err === "object" && "data" in err) {
          setEmailCodeError((err as { data: string }).data || "Invalid verification code");
        } else {
          setEmailCodeError("Invalid verification code");
        }
      } finally {
        setEmailCodeLoading(false);
      }
    } else {
      setEmailCodeError("Please enter a valid 6-digit code.");
    }
  };

  const handleResendCode = async () => {
    try {
      setResendLoading(true);
      await requestOtp({
        requestOtpV1Request: { type: "EMAIL", contact: email },
      });
      setResendTimer(resendCodeCounterBack);
    } finally {
      setResendLoading(false);
    }
  };

  const isEmailLogin = useMemo(() => {
    return (
      loginSteps === Steps.EMAIL_FIRST_STEP ||
      loginSteps === Steps.EMAIL_NAME_STEP ||
      loginSteps === Steps.EMAIL_THIRD_STEP ||
      loginSteps === Steps.EMAIL_LOGIN_STEP
    );
  }, [loginSteps]);

  const items: TabsProps['items'] = [
    {
      key: 'password',
      label: 'Password',
      children: '',
    },
    {
      key: 'code',
      label: 'Verification Code',
      children: '',
    },
  ];
  const onChange = (key: string) => {
    setLoginMethod(key as "code" | "password");
  };
  if (!isBrowser) {
    return <Card className={`w-full border-0 p-2 ${className}`}>
      <div className="text-black mb-8 text-2xl text-left font-bold font-nunito">
        Loading...
      </div>
    </Card>;
  }

  return (
    <ConfigProvider theme={{
      components: {
        Tabs: {
          itemSelectedColor: "#5CB2D1",
          inkBarColor: "#5CB2D1",
          itemHoverColor: "black"
        },
      },
    }}>
      <Card className={`w-full border-0 p-2 ${className}`}>
        {isEmailLogin && (
          <>
            {loginSteps === Steps.EMAIL_FIRST_STEP && (
              <div className="text-black mb-8 text-2xl text-left font-bold font-nunito">
                Log in or Sign up 
              </div>
            )}
            {loginSteps === Steps.EMAIL_FIRST_STEP && (
              <>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                <div className="text-content-black text-sm font-normal">
                  Email
                </div>
                <Input
                  type="email"
                  size="large"
                  className="mt-1"
                  status={emailError ? "error" : ""}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bobby@example.com"
                ></Input>
                {emailError && (
                  <div className="text-red-500 text-xs mt-2">{emailError}</div>
                )}

                {loginMethod === 'password' && (
                  <>
                    <div className="mt-3 text-content-black text-sm font-normal">
                      Password
                    </div>
                    <Input.Password
                      size="large"
                      className="mt-1"
                      status={passwordError ? "error" : ""}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError(null);
                      }}
                      placeholder="Enter your password"
                    />
                    {passwordError && (
                      <div className="text-red-500 text-xs mt-2">{passwordError}</div>
                    )}
                  </>
                )}
                {loginMethod === 'password' && <div className="mt-3 cursor-pointer text-content-black text-sm font-normal">
                  Forget Password?
                </div>}
                <ContinueButton
                  onClick={handleEmailSubmit}
                  loading={submitEmailLoading}
                >
                  Continue
                </ContinueButton>
              </>
            )}
            {loginSteps === Steps.EMAIL_NAME_STEP && (
              <>
                <div className="">
                  <LeftOutlined
                    className="mb-2 text-xs text-left text-black-20-opaque"
                    onClick={backToInputEmailStep}
                  />
                  <br />
                  <span className="text-black text-2xl font-semibold">
                    Create your account
                  </span>
                </div>
                <div className="mt-2 text-xs text-black">{`You're creating an Aroomy account with ${email}`}</div>
                <div className="mt-3 text-black text-sm font-semibold">
                  Name
                </div>
                <Input
                  size="large"
                  className="mt-2"
                  status={emailError ? "error" : ""}
                  value={newEmailUserName}
                  onChange={(e) => setNewEmailUserName(e.target.value)}
                  placeholder="Your name"
                ></Input>
                {newEmailUserNameError && (
                  <div className="text-red-500 text-xs mt-2">
                    {newEmailUserNameError}
                  </div>
                )}
                <ContinueButton onClick={handleNewEmailNameSubmit}>
                  {" "}
                  Continue{" "}
                </ContinueButton>
              </>
            )}
            {loginSteps === Steps.EMAIL_THIRD_STEP && (
              <>
                <div className="">
                  <LeftOutlined
                    className="mb-2 text-xs text-left text-black-20-opaque"
                    onClick={backToEmailSecondStep}
                  />
                  <br />
                  <span className="text-black text-2xl font-semibold">
                    You&apos;re almost signed up
                  </span>
                </div>
                <div className="mt-2 text-xs text-black">{`Enter the code we sent to ${email} to finish signing up.`}</div>
                <div className="mt-3 text-black text-sm font-semibold">
                  Code
                </div>
                <Input
                  size="large"
                  className="mt-2"
                  status={emailCodeError ? "error" : ""}
                  value={emailCode}
                  onChange={handleEmailCodeChange}
                  placeholder="Enter code"
                  maxLength={6}
                />
                {emailCodeError && (
                  <div className="text-red-500 text-xs mt-2">
                    {emailCodeError}
                  </div>
                )}
                <ContinueButton
                  onClick={handleEmailCodeSubmit}
                  loading={emailCodeLoading}
                >
                  {" "}
                  Continue{" "}
                </ContinueButton>
                {resendTimer > 0 ? (
                  <div className="mt-6 text-xs text-black">
                    Didn&apos;t get the code? Resend code in {resendTimer} seconds
                  </div>
                ) : (
                  <Button
                    type="link"
                    onClick={handleResendCode}
                    className="mt-6 w-full"
                    loading={resendLoading}
                  >
                    Resend Code
                  </Button>
                )}
              </>
            )}
            {loginSteps === Steps.EMAIL_LOGIN_STEP && (
              <>
                <div className="">
                  <LeftOutlined
                    className="mb-2 text-xs text-left text-black-20-opaque"
                    onClick={backToEmailSecondStep}
                  />
                  <br />
                  <span className="text-black text-2xl font-semibold">
                    Log into your account
                  </span>
                </div>
                <div className="mt-2 text-xs text-black">{`Enter the code we sent to ${email}, you'll be all logged in.`}</div>
                <div className="mt-3 text-black text-sm font-semibold">
                  Code
                </div>
                <Input
                  size="large"
                  className="mt-2"
                  status={emailCodeError ? "error" : ""}
                  value={emailCode}
                  onChange={handleEmailCodeChange}
                  placeholder="Enter code"
                  maxLength={6}
                />
                {emailCodeError && (
                  <div className="text-red-500 text-xs mt-2">
                    {emailCodeError}
                  </div>
                )}
                <ContinueButton
                  onClick={handleEmailCodeSubmit}
                  loading={emailCodeLoading}
                >
                  {" "}
                  Continue{" "}
                </ContinueButton>

                {resendTimer > 0 ? (
                  <div className="mt-6 text-xs text-black">
                    Didn&apos;t get the code? Resend code in {resendTimer} seconds
                  </div>
                ) : (
                  <Button
                    type="link"
                    onClick={handleResendCode}
                    className="mt-6 w-full"
                    loading={resendLoading}
                  >
                    Resend Code
                  </Button>
                )}
              </>
            )}
          </>
        )}
        {loginSteps === Steps.EMAIL_FIRST_STEP && (
          <>
            <Divider>
              <div className="text-content-black-50 text-sm font-semibold">
                Or
              </div>
            </Divider>
            <div
              className="flex items-center justify-center h-12 w-full mt-4 mx-auto border border-content-black-20 text-sm font-semibold rounded-md cursor-pointer relative"
              onClick={googleLogin}
            >
              <span className="text-content-black flex text-sm items-center justify-center font-bold font-nunito flex-1 text-center">
                <span aria-hidden="true" className="text-2xl mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    height="24"
                    width="24"
                  >
                    <path
                      fill="#4285f4"
                      d="M386 400c45-42 65-112 53-179H260v74h102c-4 24-18 44-38 57z"
                    ></path>
                    <path
                      fill="#34a853"
                      d="M90 341a192 192 0 0 0 296 59l-62-48c-53 35-141 22-171-60z"
                    ></path>
                    <path
                      fill="#fbbc02"
                      d="M153 292c-8-25-8-48 0-73l-63-49c-23 46-30 111 0 171z"
                    ></path>
                    <path
                      fill="#ea4335"
                      d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55z"
                    ></path>
                  </svg>
                </span>
                Continue with Google
              </span>
            </div>


            <div className="mt-6 font-normal text-xs md:text-sm text-content-black">
              By continuing, you agree to Mochi Sofa&apos;s{" "}
              <a href="#" className="underline">
                Terms of Use
              </a>
              . Read our{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </div>
          </>)}

      </Card>
    </ConfigProvider>
  );
};

export default LoginCard;
