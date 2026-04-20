import LeagueDataProvider from "@/app/context/LeagueDataContext";

export default function OverlayLayout({ children }) {
  return <LeagueDataProvider>{children}</LeagueDataProvider>;
}