import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "登录 | AI Agent Workspace",
};

// 页面只负责"这一路由渲染什么"，具体逻辑放在组件里。
// 这样后续要给登录页加布局/SEO/loading 都只动这一层
export default function LoginPage() {
  return <LoginForm />;
}
