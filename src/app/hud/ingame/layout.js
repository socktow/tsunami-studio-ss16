import LeagueDataProvider from "@/app/context/LeagueDataContext";

export default function OverlayLayout({ children }) {
  return (
    <LeagueDataProvider type="in">
      {children}
    </LeagueDataProvider>
  );
}