import RoleSelector from "@/components/auth/RoleSelector";

export const metadata = {
  title: "Choose Your Role — LegitAssist",
  description: "Select whether you're a client or a lawyer on LegitAssist.",
};

export default function SelectRolePage() {
  return <RoleSelector />;
}