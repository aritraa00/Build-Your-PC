import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { BuilderPage } from "./pages/BuilderPage";
import { AuthPage } from "./pages/AuthPage";
import { HomePage } from "./pages/HomePage";
import { SavedBuildsPage } from "./pages/SavedBuildsPage";
import { SharedBuildPage } from "./pages/SharedBuildPage";
import { ResetPassword } from "./pages/ResetPassword";

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/builder" element={<BuilderPage />} />
      <Route path="/auth" element={<AuthPage initialMode="login" />} />
      <Route path="/register" element={<AuthPage initialMode="register" />} />
      <Route path="/forgot-password" element={<AuthPage initialMode="forgot" />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/saved-builds" element={<SavedBuildsPage />} />
      <Route path="/build/:id" element={<SharedBuildPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
);

export default App;