"use client";

import React from 'react';
import TopLeftPanel from './components/topleftpanel';
import TopCenterPanel from './components/topcenterpanel';
import TopRightPanel from './components/toprightpanel';
import CenterLeftPanel from './components/centerleftpanel';
import TeamScoreboard from './components/teamscoreboard';
import BottomcenterPanel from './components/bottomcenterpanel'
import BottomRightLeftPanel from './components/bottomrightleftpanel';
const Ingame = () => {
  return (
    <div className="fixed inset-0 bg-transparent pointer-events-none select-none">
      <TopLeftPanel />
      <TopCenterPanel />
      <TopRightPanel />
      <CenterLeftPanel />
      {/* <TeamScoreboard /> */}
      <BottomcenterPanel />
      <BottomRightLeftPanel />
    </div>
  );
};

export default Ingame;