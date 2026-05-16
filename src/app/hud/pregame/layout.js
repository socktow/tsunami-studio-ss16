import LeagueDataProvider from "@/app/context/LeaguePregameContext";

export default function OverlayLayout({
  children,
}) {
  return (
    <LeagueDataProvider type="pre">
      {children}
    </LeagueDataProvider>
  );
}