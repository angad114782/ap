import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import OnBoardingOneSlider from "./assets/onboadingOneSlider.svg";
import OnBoardingOneLogo from "./assets/OnBoardingOneLogo.svg";
import OnboardingThreeLogo from "./assets/OnBoardingThreeLogo.svg";
import OnboardingTwoLogo from "./assets/OnBoardingTwoLogo.svg";
import OnboardingTwoSlider from "./assets/OnBoardingTwoSlider.svg";
import MobileLayout from "./components/Layout/MobileLayout";
import GetStarted from "./Pages/GetStarted";
import InvestmentPlan from "./Pages/InvestmentPlan";
import InviteAndEarn from "./Pages/Invite&Earn";
import LoginForm from "./Pages/LoginForm";
import MainScreen from "./Pages/MainScreen";
import Onboarding from "./Pages/Onboarding-1";
import Passbook from "./Pages/PassBook";
import ProfileScreen from "./Pages/Profile";
import ReceiveCurrency from "./Pages/ReceiveCurrency";
import ReceiveFinal from "./Pages/ReceiveFinal";
import RegistrationOne from "./Pages/RegistrationOne";
import RequestSubmitted from "./Pages/RequestSubmitted";
import SendCurrency from "./Pages/SendCurrency";
import SplashScreen from "./Pages/SplashScreen";
import TransferReceipt from "./Pages/TransferReceipt";
import Dashboard from "./components/admin/AdminDashboard";
import Portfolio from "./Pages/Portfolio";
import Setmpin from "./Pages/SetMpin";
import InvestmentPlanFinal from "./Pages/InvestmentPlanFinal";
import EnterOtp from "./Pages/EnterOtp";
import RegOtp from "./Pages/RegOtp";
import ForgetPassword from "./Pages/ForgetPassword";
import PDFViewer from "./Pages/PDFViewer";
import {
  AdminRoute,
  AuthProvider,
  PublicRoute,
  UserRoute,
} from "./context/AuthContext";
import PartialWithdraw from "./Pages/PartialWithdraw";
import SetNewPassword from "./Pages/SetNewPassword";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" richColors />
        <Routes>
          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/:tab" element={<Dashboard />} />
          </Route>

          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            {/* Public Routes */}
            <Route
              path="/splash"
              element={
                <MobileLayout>
                  <SplashScreen />
                </MobileLayout>
              }
            />
            <Route
              path="/onboarding-1"
              element={
                <MobileLayout>
                  <Onboarding
                    mainLogo={OnBoardingOneLogo}
                    smallLogo={OnBoardingOneSlider}
                    text="Welcome to our App"
                    to="/onboarding-2"
                  />
                </MobileLayout>
              }
            />
            <Route
              path="/onboarding-2"
              element={
                <MobileLayout>
                  <Onboarding
                    mainLogo={OnboardingTwoLogo}
                    smallLogo={OnboardingTwoSlider}
                    text="Discover the features"
                    to="/onboarding-3"
                  />
                </MobileLayout>
              }
            />
            <Route
              path="/onboarding-3"
              element={
                <MobileLayout>
                  <Onboarding
                    mainLogo={OnboardingThreeLogo}
                    smallLogo={OnBoardingOneSlider}
                    text="Get started with us"
                    to="/get-started"
                  />
                </MobileLayout>
              }
            />
            <Route
              path="/get-started"
              element={
                <MobileLayout>
                  <GetStarted />
                </MobileLayout>
              }
            />
            <Route
              path="/login-register"
              element={
                <MobileLayout>
                  <LoginForm />
                </MobileLayout>
              }
            />
            <Route
              path="/register"
              element={
                <MobileLayout>
                  <RegistrationOne />
                </MobileLayout>
              }
            />
            <Route
              path="/forget-password"
              element={
                <MobileLayout>
                  <ForgetPassword />
                </MobileLayout>
              }
            />
            <Route
              path="/enter-otp"
              element={
                <MobileLayout>
                  <EnterOtp />
                </MobileLayout>
              }
            />
            <Route
              path="/reg-otp"
              element={
                <MobileLayout>
                  <RegOtp/>
                </MobileLayout>
              }
            />
          </Route>
            <Route
              path="/set-password"
              element={
                <MobileLayout>
                  <SetNewPassword />
                </MobileLayout>
              }
            />

          {/* Protected User Routes */}
          <Route element={<UserRoute />}>
            <Route
              path="/main-screen"
              element={
                <MobileLayout>
                  <MainScreen />
                </MobileLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <MobileLayout>
                  <ProfileScreen />
                </MobileLayout>
              }
            />
            <Route
              path="/transfer-receipt"
              element={
                <MobileLayout>
                  <TransferReceipt />
                </MobileLayout>
              }
            />
            <Route
              path="/select-wallet-send"
              element={
                <MobileLayout>
                  <SendCurrency />
                </MobileLayout>
              }
            />
            <Route
              path="/select-wallet-receive"
              element={
                <MobileLayout>
                  <ReceiveCurrency />
                </MobileLayout>
              }
            />
            <Route
              path="/receive-final"
              element={
                <MobileLayout>
                  <ReceiveFinal />
                </MobileLayout>
              }
            />
            <Route
              path="/request-submitted"
              element={
                <MobileLayout>
                  <RequestSubmitted />
                </MobileLayout>
              }
            />
            <Route
              path="/passbook"
              element={
                <MobileLayout>
                  <Passbook />
                </MobileLayout>
              }
            />
            <Route
              path="/invite-and-earn"
              element={
                <MobileLayout>
                  <InviteAndEarn />
                </MobileLayout>
              }
            />
            <Route
              path="/investment-plan"
              element={
                <MobileLayout>
                  <InvestmentPlan />
                </MobileLayout>
              }
            />
            <Route
              path="/investment-plan-final"
              element={
                <MobileLayout>
                  <InvestmentPlanFinal />
                </MobileLayout>
              }
            />
            <Route
              path="/portfolio"
              element={
                <MobileLayout>
                  <Portfolio />
                </MobileLayout>
              }
            />
            <Route
              path="/partial-withdraw"
              element={
                <MobileLayout>
                  <PartialWithdraw />
                </MobileLayout>
              }
            />
            <Route
              path="/set-mpin"
              element={
                <MobileLayout>
                  <Setmpin />
                </MobileLayout>
              }
            />
          </Route>
          <Route
            path="/pdf-viewer"
            element={
              <MobileLayout>
                <PDFViewer />
              </MobileLayout>
            }
          />

          {/* Default Routes */}
          <Route
            path="/"
            element={
              <MobileLayout>
                <Navigate to="/splash" replace />
              </MobileLayout>
            }
          />
          <Route
            path="*"
            element={
              <MobileLayout>
                <Navigate to="/login-register" replace />
              </MobileLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
