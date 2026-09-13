import RoleSelector from "@/components/auth/RoleSelector";

export const metadata = {
  title: "Choose Your Role — LegalEase",
  description: "Select whether you're a client or a lawyer on LegalEase.",
};

export default function SelectRolePage() {
  return <RoleSelector />;
}